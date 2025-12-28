
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Read docs content (simulated read, in a real env we might read files)
// For Vercel functions, reading local files is tricky unless bundled.
// I'll embed the key context from DEPLOYMENT.md directly or try to read it if possible.
// Safest is to hardcode the context or read it if the file exists in the lambda environment.
// Since we are in the repo, I'll read it now and embed it as a string to be safe for deployment.

const DOCS_CONTEXT = `
# GitHub Stats Card Generator Documentation

This tool generates SVG cards for GitHub profiles.
Available Card Types:
- stats: Shows total stars, forks, repos, followers.
- languages: Shows most used languages.
- streak: Shows contribution streak.
- activity: Shows weekly activity graph.
- quote: Shows a random developer quote.
- banner: Shows a large animated banner with Name and Tagline.
- custom: Shows custom text.

Base URL: https://your-app.vercel.app/api/card

Parameters:
- type: card type (see above)
- username: GitHub username
- theme: neon, dracula, etc.
- bg, primary, secondary, text, border: Color overrides (hex)
- animation: fadeIn, wave, etc.
- bannerName: For banner type
- bannerDescription: For banner type
- waveStyle: For banner type (wave, pulse, flow)

The API is hosted on Vercel Serverless Functions.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const { username, portfolio } = req.body;

    if (!portfolio) {
      return res.status(400).json({ error: 'Portfolio URL or content is required' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemma-3-27b' });

    const prompt = `
    You are a professional GitHub Profile Architect.

    I will provide you with:
    1. A user's portfolio content (or URL): "${portfolio}"
    2. Documentation for a GitHub Stats Card Generator tool (see below).
    3. The user's GitHub username: "${username || 'USER'}"

    Your task is to generate a professional, markdown-formatted GitHub Profile README.md.

    Requirements:
    - Use the provided Stats Card Generator documentation to include relevant SVG cards (stats, languages, banner, etc.) in the profile.
    - Construct the card URLs correctly using the username provided.
    - Create a "Banner" card at the top using the user's name (inferred from portfolio or username) and a catchy tagline (inferred from portfolio).
    - Extract key skills, projects, and bio from the portfolio content to populate the README.
    - Organize the README professionally (Intro, About Me, Skills, Projects, Stats).
    - STRICTLY output only the Markdown code, no conversational filler.

    Documentation for Stats Generator:
    ${DOCS_CONTEXT}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ markdown: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate profile', details: error.message });
  }
}
