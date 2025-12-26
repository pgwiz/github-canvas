import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      nodeVersion: process.version,
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
    },
    endpoints: {
      card: '/api/card?type=stats&username=YOUR_USERNAME&theme=github',
      health: '/api/health',
    },
  });
}
