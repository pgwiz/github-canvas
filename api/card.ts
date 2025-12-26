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

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
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

// Speed multipliers for animations
function getSpeedMultiplier(speed: string): number {
  const multipliers: Record<string, number> = {
    slow: 2,
    normal: 1,
    fast: 0.5,
  };
  return multipliers[speed] || 1;
}

// Animation styles generator
function getAnimationStyles(animation: string, primaryColor: string, speed: string = 'normal'): string {
  const m = getSpeedMultiplier(speed);
  const animations: Record<string, string> = {
    fadeIn: `
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate { animation: fadeIn ${0.8 * m}s ease-out forwards; opacity: 0; }
      .delay-1 { animation-delay: ${0.1 * m}s; } .delay-2 { animation-delay: ${0.2 * m}s; } .delay-3 { animation-delay: ${0.3 * m}s; } .delay-4 { animation-delay: ${0.4 * m}s; }
    `,
    typing: `
      @keyframes typing { from { width: 0; } to { width: 100%; } }
      @keyframes cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      .animate { overflow: hidden; white-space: nowrap; animation: typing ${2 * m}s steps(30) forwards; width: 0; }
      .cursor { animation: cursor ${0.8 * m}s infinite; }
      .delay-1 { animation-delay: ${0.3 * m}s; } .delay-2 { animation-delay: ${0.6 * m}s; } .delay-3 { animation-delay: ${0.9 * m}s; } .delay-4 { animation-delay: ${1.2 * m}s; }
    `,
    wave: `
      @keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .animate { animation: wave ${1.5 * m}s ease-in-out infinite; }
      .delay-1 { animation-delay: ${0.1 * m}s; } .delay-2 { animation-delay: ${0.2 * m}s; } .delay-3 { animation-delay: ${0.3 * m}s; } .delay-4 { animation-delay: ${0.4 * m}s; }
    `,
    blink: `
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .animate { animation: blink ${1.5 * m}s ease-in-out infinite; }
    `,
    scaleIn: `
      @keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .animate { animation: scaleIn ${0.5 * m}s ease-out forwards; transform-origin: center; opacity: 0; }
      .delay-1 { animation-delay: ${0.15 * m}s; } .delay-2 { animation-delay: ${0.3 * m}s; } .delay-3 { animation-delay: ${0.45 * m}s; } .delay-4 { animation-delay: ${0.6 * m}s; }
    `,
    glow: `
      @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 3px ${primaryColor}40); } 50% { filter: drop-shadow(0 0 12px ${primaryColor}80); } }
      .animate { animation: glow ${2 * m}s ease-in-out infinite; }
    `,
    slideInLeft: `
      @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
      .animate { animation: slideInLeft ${0.6 * m}s ease-out forwards; opacity: 0; }
      .delay-1 { animation-delay: ${0.1 * m}s; } .delay-2 { animation-delay: ${0.2 * m}s; } .delay-3 { animation-delay: ${0.3 * m}s; } .delay-4 { animation-delay: ${0.4 * m}s; }
    `,
    slideInRight: `
      @keyframes slideInRight { 0% { opacity: 0; transform: translateX(30px); } 100% { opacity: 1; transform: translateX(0); } }
      .animate { animation: slideInRight ${0.6 * m}s ease-out forwards; opacity: 0; }
      .delay-1 { animation-delay: ${0.1 * m}s; } .delay-2 { animation-delay: ${0.2 * m}s; } .delay-3 { animation-delay: ${0.3 * m}s; } .delay-4 { animation-delay: ${0.4 * m}s; }
    `,
    slideInUp: `
      @keyframes slideInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate { animation: slideInUp ${0.6 * m}s ease-out forwards; opacity: 0; }
      .delay-1 { animation-delay: ${0.1 * m}s; } .delay-2 { animation-delay: ${0.2 * m}s; } .delay-3 { animation-delay: ${0.3 * m}s; } .delay-4 { animation-delay: ${0.4 * m}s; }
    `,
    bounce: `
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-8px); } 50% { transform: translateY(0); } 75% { transform: translateY(-4px); } }
      .animate { animation: bounce ${1 * m}s ease-in-out infinite; }
      .delay-1 { animation-delay: ${0.1 * m}s; } .delay-2 { animation-delay: ${0.2 * m}s; } .delay-3 { animation-delay: ${0.3 * m}s; } .delay-4 { animation-delay: ${0.4 * m}s; }
    `,
  };
  return animations[animation] || animations.fadeIn;
}

// Generate gradient defs for SVG
function getGradientDefs(p: any): string {
  if (!p.gradient) return '';
  
  const id = 'bgGradient';
  if (p.gradientType === 'radial') {
    return `
      <defs>
        <radialGradient id="${id}" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="${p.gradientStart}"/>
          <stop offset="100%" stop-color="${p.gradientEnd}"/>
        </radialGradient>
      </defs>`;
  }
  
  // Convert angle to SVG gradient coordinates
  const angle = p.gradientAngle || 135;
  const angleRad = (angle - 90) * Math.PI / 180;
  const x1 = 50 - Math.cos(angleRad) * 50;
  const y1 = 50 - Math.sin(angleRad) * 50;
  const x2 = 50 + Math.cos(angleRad) * 50;
  const y2 = 50 + Math.sin(angleRad) * 50;
  
  return `
    <defs>
      <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${p.gradientStart}"/>
        <stop offset="100%" stop-color="${p.gradientEnd}"/>
      </linearGradient>
    </defs>`;
}

function getBgFill(p: any): string {
  return p.gradient ? 'url(#bgGradient)' : p.bgColor;
}

function generateStatsSVG(p: any): string {
  const { stats, animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    .title{font:600 16px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    .stat-value{font:700 18px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}
    .stat-label{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor};opacity:0.8}
    .icon{fill:currentColor}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${bgFill}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(25, 25)" class="animate">
    <text class="title">${escapeXml(p.username)}'s GitHub Stats</text>
    <g transform="translate(0, 45)" class="animate delay-1">
      <svg x="0" y="-14" width="16" height="16" viewBox="0 0 16 16" fill="${p.primaryColor}"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>
      <text class="stat-value" x="22" fill="${p.primaryColor}">${formatNumber(stats.totalStars)}</text>
      <text class="stat-label" y="22">Total Stars</text>
    </g>
    <g transform="translate(115, 45)" class="animate delay-2">
      <svg x="0" y="-14" width="16" height="16" viewBox="0 0 16 16" fill="${p.secondaryColor}"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8.5z"/></svg>
      <text class="stat-value" x="22" fill="${p.secondaryColor}">${stats.publicRepos}</text>
      <text class="stat-label" y="22">Repositories</text>
    </g>
    <g transform="translate(230, 45)" class="animate delay-3">
      <svg x="0" y="-14" width="16" height="16" viewBox="0 0 16 16" fill="${p.primaryColor}"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5zM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5z"/></svg>
      <text class="stat-value" x="22" fill="${p.primaryColor}">${formatNumber(stats.followers)}</text>
      <text class="stat-label" y="22">Followers</text>
    </g>
    <g transform="translate(345, 45)" class="animate delay-4">
      <svg x="0" y="-14" width="16" height="16" viewBox="0 0 16 16" fill="${p.secondaryColor}"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.372h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM8 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/></svg>
      <text class="stat-value" x="22" fill="${p.secondaryColor}">${formatNumber(stats.totalForks)}</text>
      <text class="stat-label" y="22">Total Forks</text>
    </g>
  </g>
</svg>`;
}

function generateLanguagesSVG(p: any): string {
  const { languages, animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    .title{font:600 16px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    .lang-label{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${bgFill}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(25, 25)">
    <text class="title animate">Most Used Languages</text>
    <g transform="translate(0, 35)">${bars}</g>
    <g transform="translate(0, 55)">${labels}</g>
  </g>
</svg>`;
}

function generateStreakSVG(p: any): string {
  const { animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    .title{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    .streak-num{font:700 28px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}
    .streak-label{font:400 10px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor};opacity:0.7}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${bgFill}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(${p.width / 2}, 20)" text-anchor="middle" class="animate">
    <svg x="-8" y="-12" width="16" height="16" viewBox="0 0 16 16" fill="${p.primaryColor}"><path d="M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.79 2.79 0 0 1-1.436-.874A3.198 3.198 0 0 0 3 10c0 2.53 2.164 4.5 4.998 4.5zM9.533.753C9.496.34 9.16.009 8.77.146 7.035.75 4.34 3.187 5.997 6.5c.344.689.285 1.218.003 1.5-.419.419-1.54.487-2.04-.832-.173-.454-.659-.762-1.035-.454C2.036 7.44 1.5 8.702 1.5 10c0 3.512 2.998 6 6.498 6s6.5-2.5 6.5-6c0-2.137-1.128-3.26-2.312-4.438-1.19-1.184-2.436-2.425-2.653-4.81z"/></svg>
    <text class="title" x="12">Contribution Streak</text>
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
  const { animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
  const quotes = [
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
    { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    .quote{font:italic 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    .author{font:600 12px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.primaryColor}}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${bgFill}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <text x="25" y="35" class="quote animate" fill="${p.secondaryColor}" font-size="24">"</text>
  <text x="45" y="50" class="quote animate delay-1">${escapeXml(quote.text)}</text>
  <text x="${p.width - 25}" y="${p.height - 25}" class="author animate delay-2" text-anchor="end">- ${escapeXml(quote.author)}</text>
</svg>`;
}

function generateActivitySVG(p: any): string {
  const { animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    .title{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    .day-label{font:400 9px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor};opacity:0.7}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${bgFill}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <g transform="translate(25, 20)" class="animate">
    <svg x="0" y="-12" width="14" height="14" viewBox="0 0 16 16" fill="${p.primaryColor}"><path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042z"/></svg>
    <text class="title" x="20">Weekly Activity</text>
  </g>
  ${bars}
</svg>`;
}

function generateCustomSVG(p: any): string {
  const { animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    .custom-text{font:600 16px -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;fill:${p.textColor}}
    ${animStyles}
  </style>
  <rect width="100%" height="100%" fill="${bgFill}" rx="${p.borderRadius}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="1"` : ''}/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="custom-text animate">${escapeXml(p.customText || 'Custom Card')}</text>
</svg>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type = 'stats', username = '', theme = 'github', format = 'svg' } = req.query;
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
    speed: (req.query.speed as string) || 'normal',
    gradient: req.query.gradient === 'true',
    gradientType: (req.query.gradientType as string) || 'linear',
    gradientAngle: parseInt(req.query.gradientAngle as string) || 135,
    gradientStart: decodeURIComponent((req.query.gradientStart as string) || '#667eea'),
    gradientEnd: decodeURIComponent((req.query.gradientEnd as string) || '#764ba2'),
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

  // Return based on format
  if (format === 'base64') {
    // Return base64 data URL for img src usage
    const base64 = Buffer.from(svg, 'utf-8').toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(dataUrl);
  }

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(svg);
}
