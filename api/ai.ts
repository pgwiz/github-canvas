import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DOCS_CONTEXT = `
# GitHub Stats Card Generator Documentation
Base URL: https://github-canvas.vercel.app/api/card

Available Card Types:
- stats: Total stars, forks, repos, followers.
  URL: https://github-canvas.vercel.app/api/card?type=stats&username={username}&theme={theme}&animation=fadeIn
- languages: Top programming languages with percentage bars.
  URL: https://github-canvas.vercel.app/api/card?type=languages&username={username}&theme={theme}&animation=fadeIn
- streak: Contribution streak and current active days.
  URL: https://github-canvas.vercel.app/api/card?type=streak&username={username}&theme={theme}&animation=fadeIn
- activity: Weekly commit and activity sparkline.
  URL: https://github-canvas.vercel.app/api/card?type=activity&username={username}&theme={theme}&animation=fadeIn
- quote: Inspiring developer quote.
  URL: https://github-canvas.vercel.app/api/card?type=quote&theme={theme}&animation=fadeIn
- banner: High-impact hero banner with name, title, and wave animation.
  URL: https://github-canvas.vercel.app/api/card?type=banner&username={username}&bannerName={name}&bannerDescription={tagline}&theme={theme}&animation=wave

Themes: electric-blue, midnight, tokyo-night, dracula, ocean, sunset, cyberpunk, nord, catppuccin, matrix.
Animations: fadeIn, wave, glow, float, typewriter, pulse.
`;

function cleanMarkdownFences(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```markdown')) {
    cleaned = cleaned.slice(11);
  } else if (cleaned.startsWith('```md')) {
    cleaned = cleaned.slice(5);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

function generateDeterministicProfile(params: {
  username: string;
  sourceContent: string;
  theme: string;
  selectedCards: string[];
}): string {
  const { username, sourceContent, theme, selectedCards } = params;
  const safeName = username || 'Developer';
  const baseUrl = 'https://github-canvas.vercel.app/api/card';

  // Extract potential keywords/skills from source text
  const skillsList = [
    'TypeScript', 'JavaScript', 'React', 'Node.js', 'Python', 'TailwindCSS',
    'PostgreSQL', 'Docker', 'Next.js', 'Git', 'GraphQL', 'AWS'
  ];
  const detectedSkills = skillsList.filter(s =>
    new RegExp(`\\b${s}\\b`, 'i').test(sourceContent)
  );
  const activeSkills = detectedSkills.length >= 3 ? detectedSkills : ['TypeScript', 'React', 'Node.js', 'Python', 'TailwindCSS', 'Docker'];

  const sections: string[] = [];

  // 1. Banner
  if (selectedCards.includes('banner')) {
    sections.push(
      `<div align="center">\n  <img src="${baseUrl}?type=banner&username=${encodeURIComponent(safeName)}&bannerName=${encodeURIComponent(safeName)}&bannerDescription=Full-Stack%20Engineer%20%26%20Open-Source%20Builder&theme=${theme}&animation=wave" alt="${safeName}'s Banner" width="100%" />\n</div>\n`
    );
  }

  // 2. Greeting & Intro
  sections.push(`## About Me

I am a passionate software engineer focused on building performant, accessible, and elegant web systems. Constantly exploring modern full-stack architectures, scalable cloud infrastructure, and open-source tooling.

- **Current Focus:** Modern distributed web applications & developer tools.
- **Learning & Exploring:** Edge runtimes, real-time sync, and intelligent agent workflows.
- **Ask me about:** Frontend architecture, backend API design, performance optimization.
- **Reach me:** [GitHub Profile](https://github.com/${safeName})
`);

  // 3. Tech Stack
  sections.push(`## Tech Stack & Tooling

${activeSkills.map(skill => `\`${skill}\``).join(' • ')}
`);

  // 4. GitStats Live Cards
  const cardElements: string[] = [];
  if (selectedCards.includes('stats')) {
    cardElements.push(`<img src="${baseUrl}?type=stats&username=${encodeURIComponent(safeName)}&theme=${theme}&animation=fadeIn" alt="GitHub Stats" height="175" />`);
  }
  if (selectedCards.includes('streak')) {
    cardElements.push(`<img src="${baseUrl}?type=streak&username=${encodeURIComponent(safeName)}&theme=${theme}&animation=fadeIn" alt="GitHub Streak" height="175" />`);
  }

  if (cardElements.length > 0) {
    sections.push(`## GitHub Statistics\n\n<p align="center">\n  ${cardElements.join('\n  ')}\n</p>\n`);
  }

  const secondaryCards: string[] = [];
  if (selectedCards.includes('languages')) {
    secondaryCards.push(`<img src="${baseUrl}?type=languages&username=${encodeURIComponent(safeName)}&theme=${theme}&animation=fadeIn" alt="Top Languages" height="175" />`);
  }
  if (selectedCards.includes('activity')) {
    secondaryCards.push(`<img src="${baseUrl}?type=activity&username=${encodeURIComponent(safeName)}&theme=${theme}&animation=fadeIn" alt="Activity Sparkline" height="175" />`);
  }

  if (secondaryCards.length > 0) {
    sections.push(`## Activity & Languages\n\n<p align="center">\n  ${secondaryCards.join('\n  ')}\n</p>\n`);
  }

  // 5. Quote
  if (selectedCards.includes('quote')) {
    sections.push(`## Daily Inspiration\n\n<p align="center">\n  <img src="${baseUrl}?type=quote&theme=${theme}&animation=fadeIn" alt="Developer Quote" />\n</p>\n`);
  }

  // 6. Connect
  sections.push(`## Connect With Me

<p align="left">
  <a href="https://github.com/${safeName}" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>
`);

  return sections.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      username = 'octocat',
      portfolio = '',
      cvText = '',
      theme = 'electric-blue',
      customPrompt = '',
      selectedCards = ['banner', 'stats', 'streak', 'languages', 'activity', 'quote'],
    } = req.body || {};

    const sourceContent = [cvText, portfolio, customPrompt].filter(Boolean).join('\n\n');

    const prompt = `You are an elite GitHub Profile Architect and Senior Staff Engineer.
Create an exceptionally compelling, modern, and beautiful GitHub Profile README.md for user "${username}".

Source Information (CV / Portfolio / Notes):
"""
${sourceContent || `GitHub Developer @${username}`}
"""

Documentation for GitStats Card Generator:
${DOCS_CONTEXT}

Selected Cards to Include: ${selectedCards.join(', ')}
Theme: ${theme}

Strict Guidelines:
1. Top Banner: Include the SVG banner card using <img src="https://github-canvas.vercel.app/api/card?type=banner&username=${encodeURIComponent(username)}&bannerName=${encodeURIComponent(username)}&bannerDescription=Software%20Engineer&theme=${theme}&animation=wave" width="100%" />.
2. Bio: Engaging 2-3 paragraph intro highlighting skills, passions, and background extracted from the CV/Portfolio.
3. Tech Stack / Skills: Categorized using clean Markdown badges or styled tables (Languages, Frameworks, Cloud, Tools).
4. Live GitStats Cards: Embed the selected cards using standard HTML or Markdown img tags with URLs from the documentation.
5. Featured Projects: Highlight 2-3 key accomplishments from the provided text.
6. Connect: Clean social link badges.
7. CRITICAL: Output ONLY pure Markdown text. Do NOT wrap the output in json or conversational pleasantries. Start immediately with the markdown content.`;

    // 1. Primary: Production AI Service (cr.pgwiz.cloud)
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'https://cr.pgwiz.cloud/api/chat';
    const aiApiKey = process.env.AI_API_KEY || 'pgwiz2026!';

    try {
      const aiRes = await fetch(aiServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': aiApiKey,
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (aiRes.ok) {
        const data = await aiRes.json();
        const markdown = data.message || data.text || (typeof data === 'string' ? data : null);
        if (markdown && typeof markdown === 'string') {
          return res.status(200).json({
            markdown: cleanMarkdownFences(markdown),
            source: 'ai-service',
            success: true,
          });
        }
      }
      console.warn('AI Service returned non-ok status:', aiRes.status);
    } catch (err) {
      console.warn('AI Service invocation failed:', err instanceof Error ? err.message : String(err));
    }

    // 2. Secondary: Direct Mistral API if key available
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (mistralKey) {
      try {
        const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mistralKey}`,
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });

        if (mistralRes.ok) {
          const mData = await mistralRes.json();
          const content = mData.choices?.[0]?.message?.content;
          if (content) {
            return res.status(200).json({
              markdown: cleanMarkdownFences(content),
              source: 'mistral-api',
              success: true,
            });
          }
        }
      } catch (mErr) {
        console.warn('Mistral direct API error:', mErr instanceof Error ? mErr.message : String(mErr));
      }
    }

    // 3. Tertiary: Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });
        const gRes = await model.generateContent(prompt);
        const text = gRes.response.text();
        if (text) {
          return res.status(200).json({
            markdown: cleanMarkdownFences(text),
            source: 'gemini-api',
            success: true,
          });
        }
      } catch (gErr) {
        console.warn('Gemini direct API error:', gErr instanceof Error ? gErr.message : String(gErr));
      }
    }

    // 4. Reliable deterministic fallback generator
    const fallbackMarkdown = generateDeterministicProfile({
      username,
      sourceContent,
      theme,
      selectedCards,
    });

    return res.status(200).json({
      markdown: fallbackMarkdown,
      source: 'smart-template',
      success: true,
    });

  } catch (error) {
    console.error('Fatal AI Handler Error:', error);
    return res.status(500).json({
      error: 'Failed to generate profile',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
