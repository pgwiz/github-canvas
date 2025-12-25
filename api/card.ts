import type { VercelRequest, VercelResponse } from '@vercel/node';

// Theme configurations
const themes: Record<string, any> = {
  github: { bg: '#0d1117', primary: '#58a6ff', secondary: '#8b949e', text: '#c9d1d9', border: '#30363d' },
  dracula: { bg: '#282a36', primary: '#bd93f9', secondary: '#ff79c6', text: '#f8f8f2', border: '#44475a' },
  nord: { bg: '#2e3440', primary: '#88c0d0', secondary: '#81a1c1', text: '#eceff4', border: '#4c566a' },
  tokyonight: { bg: '#1a1b26', primary: '#7aa2f7', secondary: '#bb9af7', text: '#c0caf5', border: '#414868' },
  gruvbox: { bg: '#282828', primary: '#fabd2f', secondary: '#8ec07c', text: '#ebdbb2', border: '#504945' },
  catppuccin: { bg: '#1e1e2e', primary: '#cba6f7', secondary: '#f5c2e7', text: '#cdd6f4', border: '#45475a' },
  synthwave: { bg: '#2b213a', primary: '#ff7edb', secondary: '#72f1b8', text: '#f0e6ff', border: '#495495' },
  cobalt: { bg: '#193549', primary: '#ffc600', secondary: '#0088ff', text: '#ffffff', border: '#0d3a58' },
  monokai: { bg: '#272822', primary: '#f92672', secondary: '#a6e22e', text: '#f8f8f2', border: '#49483e' },
  solarized: { bg: '#002b36', primary: '#b58900', secondary: '#268bd2', text: '#839496', border: '#073642' },
  onedark: { bg: '#282c34', primary: '#61afef', secondary: '#c678dd', text: '#abb2bf', border: '#3e4451' },
  ayu: { bg: '#0a0e14', primary: '#ffb454', secondary: '#39bae6', text: '#b3b1ad', border: '#11151c' },
  palenight: { bg: '#292d3e', primary: '#82aaff', secondary: '#c792ea', text: '#a6accd', border: '#4e5579' },
  material: { bg: '#263238', primary: '#89ddff', secondary: '#f78c6c', text: '#eeffff', border: '#37474f' },
  ocean: { bg: '#1b2b34', primary: '#6699cc', secondary: '#99c794', text: '#d8dee9', border: '#343d46' },
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

async function fetchGitHubStats(username: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Stats-Card',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) return null;
    const user = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const repos = reposRes.ok ? await reposRes.json() : [];

    let totalStars = 0;
    let totalForks = 0;
    const languageBytes: Record<string, number> = {};

    for (const repo of repos) {
      if (!repo.fork) {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
        if (repo.language) {
          languageBytes[repo.language] = (languageBytes[repo.language] || 0) + (repo.size || 0);
        }
      }
    }

    const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    return {
      user: { login: user.login, name: user.name, avatar_url: user.avatar_url, created_at: user.created_at },
      stats: { totalStars, totalForks, publicRepos: user.public_repos, followers: user.followers, following: user.following },
      languages,
      streak: { current: 0, longest: 0, total: repos.length },
      activity: Array(7).fill(Math.floor(Math.random() * 10)),
    };
  } catch {
    return null;
  }
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
    'C++': '#f34b7d', C: '#555555', 'C#': '#239120', Go: '#00ADD8', Rust: '#dea584',
    Ruby: '#701516', PHP: '#4F5D95', Swift: '#ffac45', Kotlin: '#A97BFF', Dart: '#00B4AB',
    HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883', Svelte: '#ff3e00',
  };
  return colors[lang] || '#8b949e';
}

// Animation styles generator
function getAnimationStyles(animation: string, primaryColor: string): string {
  const animations: Record<string, string> = {
    fadeIn: `
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
      .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; }
    `,
    typing: `
      @keyframes typing { from { width: 0; } to { width: 100%; } }
      @keyframes blink { 50% { border-color: transparent; } }
      .animate { overflow: hidden; white-space: nowrap; animation: typing 2s steps(30) forwards; }
    `,
    wave: `
      @keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .animate { animation: wave 1.5s ease-in-out infinite; }
      .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; }
    `,
    blink: `
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .animate { animation: blink 1.5s ease-in-out infinite; }
    `,
    scaleIn: `
      @keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .animate { animation: scaleIn 0.5s ease-out forwards; transform-origin: center; opacity: 0; }
      .delay-1 { animation-delay: 0.15s; } .delay-2 { animation-delay: 0.3s; } .delay-3 { animation-delay: 0.45s; } .delay-4 { animation-delay: 0.6s; }
    `,
    glow: `
      @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 3px ${primaryColor}40); } 50% { filter: drop-shadow(0 0 12px ${primaryColor}80); } }
      .animate { animation: glow 2s ease-in-out infinite; }
    `,
  };
  return animations[animation] || animations.fadeIn;
}

function generateStatsSVG(p: any): string {
  const { stats, animation = 'fadeIn' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor);
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title{font:600 16px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    .stat-value{font:700 18px 'Segoe UI',Ubuntu,sans-serif}
    .stat-label{font:400 11px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor};opacity:0.8}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${p.bgColor}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(25, 25)" class="animate">
    <text class="title">${p.username}'s GitHub Stats</text>
    <g transform="translate(0, 45)" class="animate delay-1">
      <text class="stat-value" fill="${p.primaryColor}">⭐ ${formatNumber(stats.totalStars)}</text>
      <text class="stat-label" y="22">Total Stars</text>
    </g>
    <g transform="translate(115, 45)" class="animate delay-2">
      <text class="stat-value" fill="${p.secondaryColor}">📦 ${stats.publicRepos}</text>
      <text class="stat-label" y="22">Repositories</text>
    </g>
    <g transform="translate(230, 45)" class="animate delay-3">
      <text class="stat-value" fill="${p.primaryColor}">👥 ${formatNumber(stats.followers)}</text>
      <text class="stat-label" y="22">Followers</text>
    </g>
    <g transform="translate(345, 45)" class="animate delay-4">
      <text class="stat-value" fill="${p.secondaryColor}">🔀 ${formatNumber(stats.totalForks)}</text>
      <text class="stat-label" y="22">Total Forks</text>
    </g>
  </g>
</svg>`;
}

function generateLanguagesSVG(p: any): string {
  const { languages, animation = 'fadeIn' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor);
  const barWidth = p.width - 50;
  let offset = 0;
  const bars = languages.map((lang: any, i: number) => {
    const width = (lang.percentage / 100) * barWidth;
    const bar = `<rect x="${offset}" y="0" width="${width}" height="8" fill="${lang.color}" rx="2" class="animate delay-${i + 1}"/>`;
    offset += width;
    return bar;
  }).join('');

  const labels = languages.map((lang: any, i: number) => `
    <g transform="translate(${(i % 3) * 140}, ${Math.floor(i / 3) * 20})" class="animate delay-${i + 1}">
      <circle r="5" cx="5" cy="5" fill="${lang.color}"/>
      <text x="15" y="9" class="lang-label">${lang.name} ${lang.percentage}%</text>
    </g>`).join('');

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title{font:600 16px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    .lang-label{font:400 11px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${p.bgColor}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(25, 25)">
    <text class="title animate">Most Used Languages</text>
    <g transform="translate(0, 35)">${bars}</g>
    <g transform="translate(0, 55)">${labels}</g>
  </g>
</svg>`;
}

function generateStreakSVG(p: any): string {
  const { animation = 'fadeIn' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor);
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title{font:600 14px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    .streak-num{font:700 28px 'Segoe UI',Ubuntu,sans-serif}
    .streak-label{font:400 10px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor};opacity:0.7}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${p.bgColor}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(${p.width / 2}, 20)" text-anchor="middle" class="animate">
    <text class="title">🔥 Contribution Streak</text>
  </g>
  <g transform="translate(${p.width / 4}, 55)" text-anchor="middle" class="animate delay-1">
    <text class="streak-num" fill="${p.primaryColor}">${p.streak?.current || 0}</text>
    <text class="streak-label" y="20">Current</text>
  </g>
  <g transform="translate(${(p.width / 4) * 3}, 55)" text-anchor="middle" class="animate delay-2">
    <text class="streak-num" fill="${p.secondaryColor}">${p.streak?.longest || 0}</text>
    <text class="streak-label" y="20">Longest</text>
  </g>
</svg>`;
}

function generateQuoteSVG(p: any): string {
  const { animation = 'fadeIn' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor);
  const quotes = [
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
    { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .quote{font:italic 14px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    .author{font:600 12px 'Segoe UI',Ubuntu,sans-serif;fill:${p.primaryColor}}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${p.bgColor}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <text x="25" y="35" class="quote animate" fill="${p.secondaryColor}" font-size="24">"</text>
  <text x="45" y="50" class="quote animate delay-1">${quote.text}</text>
  <text x="${p.width - 25}" y="${p.height - 25}" class="author animate delay-2" text-anchor="end">— ${quote.author}</text>
</svg>`;
}

function generateActivitySVG(p: any): string {
  const { animation = 'fadeIn' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activity = p.activity || Array(7).fill(0).map(() => Math.floor(Math.random() * 10));
  const maxVal = Math.max(...activity, 1);
  const barHeight = 60;
  
  const bars = activity.map((val: number, i: number) => {
    const height = (val / maxVal) * barHeight;
    const x = 30 + i * 35;
    return `
      <rect x="${x}" y="${80 - height}" width="25" height="${height}" fill="${p.primaryColor}" rx="3" opacity="0.8" class="animate delay-${Math.min(i + 1, 4)}"/>
      <text x="${x + 12}" y="95" text-anchor="middle" class="day-label">${days[i]}</text>`;
  }).join('');

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title{font:600 14px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    .day-label{font:400 9px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor};opacity:0.7}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${p.bgColor}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <text x="25" y="20" class="title animate">📊 Weekly Activity</text>
  ${bars}
</svg>`;
}

function generateCustomSVG(p: any): string {
  const { animation = 'fadeIn' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor);
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .custom-text{font:600 16px 'Segoe UI',Ubuntu,sans-serif;fill:${p.textColor}}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${p.bgColor}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="custom-text animate">${p.customText || 'Custom Card'}</text>
</svg>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type = 'stats', username = '', theme = 'github' } = req.query;
  const themeColors = themes[theme as string] || themes.github;

  const params = {
    type,
    username: username as string,
    theme,
    bgColor: (req.query.bg as string) || themeColors.bg,
    primaryColor: (req.query.primary as string) || themeColors.primary,
    secondaryColor: (req.query.secondary as string) || themeColors.secondary,
    textColor: (req.query.text as string) || themeColors.text,
    borderColor: (req.query.border as string) || themeColors.border,
    borderRadius: parseInt(req.query.radius as string) || 10,
    showBorder: req.query.showBorder !== 'false',
    width: parseInt(req.query.width as string) || 495,
    height: parseInt(req.query.height as string) || 125,
    customText: req.query.customText as string,
    animation: (req.query.animation as string) || 'fadeIn',
    stats: null as any,
    languages: [] as any[],
    streak: null as any,
    activity: [] as number[],
  };

  // Fetch GitHub data if needed
  if (username && ['stats', 'languages', 'streak', 'activity'].includes(type as string)) {
    const data = await fetchGitHubStats(username as string);
    if (data) {
      params.stats = data.stats;
      params.languages = data.languages;
      params.streak = data.streak;
      params.activity = data.activity;
    }
  }

  let svg: string;
  switch (type) {
    case 'stats': svg = generateStatsSVG(params); break;
    case 'languages': svg = generateLanguagesSVG(params); break;
    case 'streak': svg = generateStreakSVG(params); break;
    case 'activity': svg = generateActivitySVG(params); break;
    case 'quote': svg = generateQuoteSVG(params); break;
    case 'custom': svg = generateCustomSVG(params); break;
    default: svg = generateStatsSVG(params);
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(svg);
}
