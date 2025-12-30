import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    env: {
      nodeVersion: process.version,
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
      platform: process.platform,
    },
    endpoints: {
      card: '/api/card?type=stats&username=YOUR_USERNAME&theme=github',
      health: '/api/health',
    },
    test: {
      statsCard: '/api/card?type=stats&username=pgwiz',
      quotesCard: '/api/card?type=quote',
      languagesCard: '/api/card?type=languages&username=pgwiz',
    }
  });
}
