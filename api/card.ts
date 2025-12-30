import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = 'https://edxiyetfcnugrmxhmvpq.supabase.co';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract all query parameters and forward them to Supabase
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  }

  const supabaseUrl = `${SUPABASE_URL}/functions/v1/generate-card?${searchParams.toString()}`;

  try {
    const response = await fetch(supabaseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/svg+xml',
      },
    });

    const svg = await response.text();

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(response.status).send(svg);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch card from Supabase' });
  }
}
