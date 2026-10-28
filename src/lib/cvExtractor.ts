/**
 * Client-side CV and document text extraction utility.
 * Supports .txt, .md, .json, and text stream extraction from .pdf.
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (['txt', 'md', 'markdown', 'json', 'yaml', 'yml'].includes(extension)) {
    return await file.text();
  }

  if (extension === 'pdf') {
    return await extractTextFromPdf(file);
  }

  // Fallback for other file types
  try {
    const raw = await file.text();
    // Clean null characters or binary garbage
    // eslint-disable-next-line no-control-regex
    return raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').slice(0, 15000);
  } catch (err) {
    throw new Error(`Unable to read file ${file.name}. Please paste text manually.`);
  }
}

/**
 * Lightweight, zero-dependency PDF text stream extractor.
 * Parses PDF text operators (BT ... ET, Tj, TJ) without external binaries.
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binaryString = '';
  
  // Convert bytes in chunks to avoid stack overflow
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binaryString += String.fromCharCode.apply(null, Array.from(chunk));
  }

  const extractedLines: string[] = [];

  // Match PDF string literal patterns: (Some text) Tj or [(Some) -20 (Text)] TJ
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(binaryString)) !== null) {
    const clean = cleanPdfString(match[1]);
    if (clean) extractedLines.push(clean);
  }

  // Match array text: [ (text1) 20 (text2) ] TJ
  const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(binaryString)) !== null) {
    const inner = match[1];
    const subMatches = inner.match(/\(([^)]+)\)/g);
    if (subMatches) {
      const line = subMatches
        .map(s => cleanPdfString(s.slice(1, -1)))
        .filter(Boolean)
        .join(' ');
      if (line) extractedLines.push(line);
    }
  }

  const result = extractedLines.join(' ').replace(/\s+/g, ' ').trim();
  if (result.length > 50) {
    return result;
  }

  // If PDF was compressed/scanned, return clean header notice with instructions
  return `[Extracted from ${file.name}]\n(Note: PDF content appeared compressed or scanned. For best AI customization, feel free to review or paste your text below.)\n\n${result}`;
}

function cleanPdfString(str: string): string {
  return str
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\r/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .trim();
}
