import React from "react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  const renderedHtml = React.useMemo(() => {
    return parseMarkdownToHtml(content);
  }, [content]);

  return (
    <div
      className={`prose prose-invert max-w-none text-sm leading-relaxed overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

/**
 * Transforms GitHub Markdown into sanitized HTML, handling:
 * - <div align="center"> / <p align="center">
 * - Images with markdown ![alt](url) and HTML <img ...>
 * - Headings # .. ######
 * - Badges and links
 * - Bullet lists
 * - Code blocks and inline code
 * - Blockquotes
 */
function parseMarkdownToHtml(md: string): string {
  if (!md) return "";

  let html = md;

  // Preserve HTML tags like <div align="...">, <p align="...">, <img ...>, <a>
  // Replace code blocks first to protect their contents
  const codeBlocks: string[] = [];
  html = html.replace(/```([a-z0-9]*)\n([\s\S]*?)```/gi, (_match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(
      `<pre class="bg-black/60 p-4 rounded-lg font-mono text-xs overflow-x-auto my-3 border border-white/10"><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`
    );
    return placeholder;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    return `<code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-primary">${escapeHtml(code)}</code>`;
  });

  // Markdown Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    return `<img src="${encodeURI(url)}" alt="${escapeHtml(alt)}" class="rounded-lg my-2 inline-block max-w-full" loading="lazy" />`;
  });

  // Markdown Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    return `<a href="${encodeURI(url)}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">${text}</a>`;
  });

  // Headings
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-sm font-semibold text-foreground mt-4 mb-2">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold text-foreground mt-5 mb-2">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-foreground mt-6 mb-3 border-b border-white/10 pb-1">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold text-foreground mt-8 mb-4 border-b border-white/15 pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-foreground mt-8 mb-4 border-b border-white/20 pb-3">$1</h1>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/50 pl-4 py-1 italic text-muted-foreground my-3 bg-white/5 rounded-r">$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="border-white/10 my-6" />');

  // Unordered list items: - item or * item
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-muted-foreground my-1">$1</li>');

  // Wrap contiguous <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/gim, '<ul class="my-3 space-y-1">$1</ul>');

  // Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-muted-foreground">$1</em>');

  // Clean empty paragraphs and restore code blocks
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, block);
  });

  // Paragraph line breaks (double newlines to paragraphs)
  const parts = html.split(/\n{2,}/);
  html = parts.map(part => {
    const trimmed = part.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<pre') || trimmed.startsWith('<div') || trimmed.startsWith('<p') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr')) {
      return trimmed;
    }
    return `<p class="my-2.5 text-muted-foreground">${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
