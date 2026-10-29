import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface CardParams {
  type: string;
  username?: string;
  repo?: string;
  theme?: string;
  bgColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  showBorder?: boolean;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  width?: number;
  height?: number;
  customText?: string;
  customDescription?: string;
  showOwner?: boolean;
  animate?: boolean;
  animation?: string;
  speed?: string;
  gradient?: boolean;
  gradientType?: string;
  gradientAngle?: number;
  gradientStart?: string;
  gradientEnd?: string;
  bannerName?: string;
  bannerDescription?: string;
  waveStyle?: string;
  quoteTopic?: string;
  stats?: {
    totalStars: number;
    publicRepos: number;
    followers: number;
    totalForks: number;
  };
  languages?: Array<{ name: string; percentage: number; color?: string }>;
  streak?: {
    current: number;
    longest: number;
    total: number;
    startDate?: string;
    endDate?: string;
    longestStreakStart?: string;
    longestStreakEnd?: string;
    currentStreakStart?: string;
    currentStreakEnd?: string;
    days?: Array<{ date: string; contributionCount: number; level?: number }>;
  };
  contributionDays?: Array<{ date: string; count: number; level: number }>;
  repoData?: {
    name: string;
    owner: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    languageColor?: string;
    isFork?: boolean;
    isArchived?: boolean;
  };
  activity?: number[];
  quote?: { quote: string; author: string };
  skills?: string | string[];
  stacks?: string | string[];
  skillsLayout?: 'matrix' | 'stacks' | 'compact';
}

export const PRESET_STACKS: Record<string, { label: string; skills: string[] }> = {
  farm: {
    label: 'FastAPI · FARM Stack',
    skills: ['Python', 'FastAPI', 'React', 'MongoDB', 'Redis', 'Docker'],
  },
  pern: {
    label: 'PERN · Node Stack',
    skills: ['PostgreSQL', 'Express', 'React', 'Node.js'],
  },
  lemp: {
    label: 'LEMP · Laravel Stack',
    skills: ['Linux', 'Nginx', 'MySQL', 'MariaDB', 'PHP', 'Laravel'],
  },
  django: {
    label: 'Django Stack',
    skills: ['Python', 'Django', 'PostgreSQL', 'Nginx'],
  },
  languages: {
    label: 'Core Languages',
    skills: ['TypeScript', 'Python', 'JavaScript', 'PHP', 'Rust', 'C#', 'Bash'],
  },
  devops: {
    label: 'DevOps & Systems',
    skills: ['Docker', 'Linux', 'Nginx', 'Git', 'Cloudflare'],
  },
};

export function getSkillCategory(skill: string): string {
  const s = skill.toLowerCase();
  const languages = ['typescript', 'javascript', 'python', 'php', 'rust', 'c#', 'c++', 'c', 'bash', 'shell', 'go', 'golang', 'ruby', 'swift', 'kotlin', 'dart', 'html', 'css', 'scss', 'sql', 'r', 'lua', 'solidity'];
  const frameworks = ['react', 'vue', 'angular', 'svelte', 'next.js', 'nextjs', 'fastapi', 'django', 'flask', 'laravel', 'express', 'node.js', 'nodejs', 'spring', 'asp.net', 'tailwind', 'bootstrap'];
  const databases = ['postgresql', 'postgres', 'mysql', 'mariadb', 'mongodb', 'redis', 'sqlite', 'supabase', 'firebase', 'cassandra', 'elasticsearch'];
  const devops = ['docker', 'kubernetes', 'linux', 'nginx', 'apache', 'git', 'github', 'gitlab', 'aws', 'gcp', 'cloudflare', 'vercel', 'terraform', 'ansible'];

  if (languages.includes(s)) return 'Languages';
  if (frameworks.includes(s)) return 'Frameworks & Runtimes';
  if (databases.includes(s)) return 'Databases & Storage';
  if (devops.includes(s)) return 'DevOps & Systems';
  return 'Languages';
}

export const THEMES: Record<string, { bg: string; primary: string; secondary: string; text: string; border: string }> = {
  'electric-blue': { bg: '#0b1220', primary: '#3b82f6', secondary: '#06b6d4', text: '#f1f5f9', border: '#3b82f6' },
  'midnight': { bg: '#0f0f23', primary: '#ffff66', secondary: '#9999cc', text: '#cccccc', border: '#ffff66' },
  'tokyo-night': { bg: '#1a1b26', primary: '#7aa2f7', secondary: '#bb9af7', text: '#c0caf5', border: '#7aa2f7' },
  'dracula': { bg: '#282a36', primary: '#ff79c6', secondary: '#bd93f9', text: '#f8f8f2', border: '#ff79c6' },
  'github-dark': { bg: '#0d1117', primary: '#58a6ff', secondary: '#8b949e', text: '#c9d1d9', border: '#30363d' },
  'ocean': { bg: '#0a192f', primary: '#64ffda', secondary: '#8892b0', text: '#ccd6f6', border: '#64ffda' },
  'sunset': { bg: '#1a1a2e', primary: '#ff6b6b', secondary: '#ffd93d', text: '#f0f0f0', border: '#ff6b6b' },
  'forest': { bg: '#1e2a1e', primary: '#7cb342', secondary: '#aed581', text: '#e8f5e9', border: '#7cb342' },
  'cyberpunk': { bg: '#0a0a0f', primary: '#f706cf', secondary: '#00f0ff', text: '#ffffff', border: '#f706cf' },
  'nord': { bg: '#2e3440', primary: '#88c0d0', secondary: '#81a1c1', text: '#eceff4', border: '#4c566a' },
  'monokai': { bg: '#272822', primary: '#a6e22e', secondary: '#f92672', text: '#f8f8f2', border: '#a6e22e' },
  'gruvbox': { bg: '#282828', primary: '#fabd2f', secondary: '#83a598', text: '#ebdbb2', border: '#fabd2f' },
  'solarized': { bg: '#002b36', primary: '#b58900', secondary: '#268bd2', text: '#839496', border: '#b58900' },
  'catppuccin': { bg: '#1e1e2e', primary: '#cba6f7', secondary: '#f5c2e7', text: '#cdd6f4', border: '#cba6f7' },
  'aurora': { bg: '#0b0d17', primary: '#00d9ff', secondary: '#ff6bcb', text: '#e0e0e0', border: '#00d9ff' },
  'matrix': { bg: '#000000', primary: '#00ff00', secondary: '#00aa00', text: '#00ff00', border: '#00ff00' },
  'neon': { bg: '#0d1117', primary: '#0CF709', secondary: '#00e1ff', text: '#c9d1d9', border: '#0CF709' },
  'transparent': { bg: 'none', primary: '#58a6ff', secondary: '#8b949e', text: '#c9d1d9', border: '#30363d' },
};

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Shell: '#89e051',
  Bash: '#89e051',
  Docker: '#2496ed',
  Linux: '#fcc624',
  Nginx: '#009639',
  PostgreSQL: '#4169e1',
  MySQL: '#4479a1',
  MariaDB: '#003545',
  MongoDB: '#47a248',
  Redis: '#dc382d',
  React: '#61dafb',
  FastAPI: '#009688',
  Django: '#092e20',
  Laravel: '#ff2d20',
  'Node.js': '#339933',
  Express: '#e0e0e0',
  Git: '#f05032',
  PowerShell: '#012456',
  Solidity: '#AA6746',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198CE7',
  Scala: '#c22d40',
  Zig: '#ec915c',
  Cloud: '#00e1ff',
};

export const FALLBACK_QUOTES = [
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { quote: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
];

function normalizeColor(c: string | undefined, fallback: string): string {
  if (!c) return fallback;
  const trimmed = decodeURIComponent(c).trim();
  if (trimmed === 'transparent') return 'none';
  if (trimmed === '0d11' || trimmed === '#0d11') return '#0d1117';
  if (/^[0-9a-fA-F]{3,8}$/.test(trimmed)) return '#' + trimmed;
  return trimmed;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return (num || 0).toString();
}

function escapeXml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateCardSVG(rawParams: CardParams): string {
  const themeName = rawParams.theme || 'electric-blue';
  const theme = THEMES[themeName] || THEMES['electric-blue'];

  const type = rawParams.type || 'stats';
  const username = rawParams.username || 'developer';
  const bgColor = rawParams.bgColor !== undefined ? rawParams.bgColor : theme.bg;
  const primaryColor = rawParams.primaryColor || theme.primary;
  const secondaryColor = rawParams.secondaryColor || theme.secondary;
  const textColor = rawParams.textColor || theme.text;
  const borderColor = rawParams.borderColor || theme.border;
  const borderRadius = rawParams.borderRadius !== undefined ? rawParams.borderRadius : 12;
  const showBorder = rawParams.showBorder !== false;
  const animate = rawParams.animate !== false;
  const animation = rawParams.animation || 'fadeIn';
  const speed = rawParams.speed || 'normal';
  const gradient = rawParams.gradient === true;
  const gradientType = rawParams.gradientType || 'linear';
  const gradientAngle = rawParams.gradientAngle !== undefined ? rawParams.gradientAngle : 135;
  const gradientStart = rawParams.gradientStart || primaryColor;
  const gradientEnd = rawParams.gradientEnd || secondaryColor;
  const bannerName = rawParams.bannerName || username;
  const bannerDescription = rawParams.bannerDescription || 'Full Stack Architect & Open-Source Builder';

  const defaultDimensions: Record<string, { width: number; height: number }> = {
    languages: { width: 340, height: 320 },
    contribution: { width: 720, height: 250 },
    stats: { width: 495, height: 195 },
    streak: { width: 495, height: 195 },
    pin: { width: 400, height: 120 },
    repo: { width: 400, height: 120 },
    activity: { width: 495, height: 195 },
    quote: { width: 495, height: 195 },
    banner: { width: 600, height: 200 },
    custom: { width: 495, height: 195 },
    skills: { width: 500, height: 260 },
    stack: { width: 500, height: 260 },
  };

  const dims = defaultDimensions[type] || { width: 495, height: 195 };
  const width = rawParams.width || dims.width;
  const height = rawParams.height || dims.height;

  const borderStyle = showBorder ? `stroke="${borderColor}" stroke-width="1.5"` : '';

  let gradientDef = '';
  let bgFill = bgColor;
  if (gradient) {
    if (gradientType === 'radial') {
      gradientDef = `
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="${gradientStart}" />
          <stop offset="100%" stop-color="${gradientEnd}" />
        </radialGradient>`;
    } else {
      const angleRad = ((gradientAngle - 90) * Math.PI) / 180;
      const x1 = Math.round(50 - Math.cos(angleRad) * 50);
      const y1 = Math.round(50 - Math.sin(angleRad) * 50);
      const x2 = Math.round(50 + Math.cos(angleRad) * 50);
      const y2 = Math.round(50 + Math.sin(angleRad) * 50);
      gradientDef = `
        <linearGradient id="bgGrad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${gradientStart}" />
          <stop offset="100%" stop-color="${gradientEnd}" />
        </linearGradient>`;
    }
    bgFill = 'url(#bgGrad)';
  }

  const speedMultipliers: Record<string, number> = { slow: 1.8, normal: 1, fast: 0.6 };
  const m = speedMultipliers[speed] || 1;

  const animCSS = animate ? `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .card-anim { animation: fadeIn ${0.45 * m}s ease-out forwards; }
    .d-1 { animation-delay: ${0.05 * m}s; }
    .d-2 { animation-delay: ${0.1 * m}s; }
    .d-3 { animation-delay: ${0.15 * m}s; }
    .d-4 { animation-delay: ${0.2 * m}s; }
  ` : '';

  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap');
      * { box-sizing: border-box; }
      text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .header-title { font-size: 15px; font-weight: 700; fill: ${primaryColor}; letter-spacing: -0.01em; }
      .header-sub { font-size: 11px; font-weight: 500; fill: ${textColor}; opacity: 0.6; }
      .stat-val { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
      .stat-lbl { font-size: 10px; font-weight: 500; fill: ${textColor}; opacity: 0.65; text-transform: uppercase; letter-spacing: 0.05em; }
      ${animCSS}
    </style>
  `;

  switch (type) {
    case 'contribution': {
      const streak = rawParams.streak || { current: 0, longest: 0, total: 0 };
      const days = rawParams.contributionDays || (rawParams.streak?.days?.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: d.contributionCount === 0 ? 0 : d.contributionCount <= 3 ? 1 : d.contributionCount <= 6 ? 2 : d.contributionCount <= 9 ? 3 : 4,
      }))) || [];

      const initial = username.charAt(0).toUpperCase() || 'U';

      // 53 cols x 7 rows
      const cols = 53;
      const rows = 7;
      const startX = 52;
      const gridY = 82;
      const availableW = width - startX - 24;
      const pitchX = Math.max(9, Math.min(13, availableW / cols));
      const cellSize = Math.max(7, pitchX - 2.5);

      // Extract last 53 * 7 days
      const totalCells = cols * rows;
      const displayDays = days.length >= totalCells
        ? days.slice(-totalCells)
        : Array.from({ length: totalCells }).map((_, i) => {
            const existing = days[days.length - totalCells + i];
            if (existing) return existing;
            return { date: '', count: 0, level: 0 };
          });

      // Month labels extraction
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthLabels: Array<{ text: string; col: number }> = [];
      let lastMonth = -1;

      for (let c = 0; c < cols; c++) {
        const d = displayDays[c * rows];
        if (d && d.date) {
          const mIdx = new Date(d.date).getMonth();
          if (mIdx !== lastMonth && (c === 0 || c - (monthLabels[monthLabels.length - 1]?.col ?? -10) >= 3)) {
            monthLabels.push({ text: months[mIdx], col: c });
            lastMonth = mIdx;
          }
        }
      }

      // Render cells
      let cellsSvg = '';
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          const day = displayDays[idx] || { count: 0, level: 0 };
          const x = Math.round(startX + c * pitchX);
          const y = Math.round(gridY + r * pitchX);

          let cellFill = `${textColor}`;
          let fillOpacity = 0.08;

          if (day.level === 1) {
            cellFill = primaryColor;
            fillOpacity = 0.32;
          } else if (day.level === 2) {
            cellFill = primaryColor;
            fillOpacity = 0.58;
          } else if (day.level === 3) {
            cellFill = primaryColor;
            fillOpacity = 0.82;
          } else if (day.level >= 4) {
            cellFill = primaryColor;
            fillOpacity = 1.0;
          }

          cellsSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${cellFill}" fill-opacity="${fillOpacity}" />\n`;
        }
      }

      const gridBottomY = Math.round(gridY + rows * pitchX + 18);

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <!-- Header Section -->
  <g transform="translate(24, 20)">
    <!-- Avatar circle -->
    <circle cx="16" cy="16" r="16" fill="${primaryColor}" fill-opacity="0.12" stroke="${primaryColor}" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="16" y="21" text-anchor="middle" font-size="13" font-weight="800" fill="${primaryColor}">${escapeXml(initial)}</text>

    <!-- Title -->
    <text class="header-title" x="42" y="16">${escapeXml(username)}'s Contribution Graph</text>
    <text class="header-sub" x="42" y="28">GitHub Activity Calendar</text>

    <!-- Stats Badges -->
    <g transform="translate(${width - 48}, 14)" text-anchor="end" class="${animate ? 'card-anim d-1' : ''}">
      <text font-size="11" font-weight="600" fill="${textColor}">
        <tspan fill="${primaryColor}" font-weight="800">${formatNumber(streak.total)}</tspan> Contributions  |  
        <tspan fill="${secondaryColor}" font-weight="800">${streak.current}</tspan>d Streak  |  
        <tspan fill="${primaryColor}" font-weight="800">${streak.longest}</tspan>d Longest
      </text>
    </g>

    <!-- Header Divider -->
    <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
  </g>

  <!-- Month Labels -->
  <g class="${animate ? 'card-anim d-2' : ''}">
    ${monthLabels.map((m) => `<text x="${Math.round(startX + m.col * pitchX)}" y="${gridY - 8}" font-size="9" font-weight="600" fill="${textColor}" fill-opacity="0.55">${m.text}</text>`).join('\n    ')}
  </g>

  <!-- Day Labels -->
  <g class="${animate ? 'card-anim d-2' : ''}">
    <text x="${startX - 8}" y="${Math.round(gridY + 1 * pitchX + cellSize - 1)}" text-anchor="end" font-size="8.5" font-weight="500" fill="${textColor}" fill-opacity="0.45">Mon</text>
    <text x="${startX - 8}" y="${Math.round(gridY + 3 * pitchX + cellSize - 1)}" text-anchor="end" font-size="8.5" font-weight="500" fill="${textColor}" fill-opacity="0.45">Wed</text>
    <text x="${startX - 8}" y="${Math.round(gridY + 5 * pitchX + cellSize - 1)}" text-anchor="end" font-size="8.5" font-weight="500" fill="${textColor}" fill-opacity="0.45">Fri</text>
  </g>

  <!-- Contribution Heatmap Grid -->
  <g class="${animate ? 'card-anim d-3' : ''}">
    ${cellsSvg}
  </g>

  <!-- Footer Legend -->
  <g transform="translate(24, ${gridBottomY})" class="${animate ? 'card-anim d-4' : ''}">
    <text x="${startX - 24}" y="7" font-size="10" font-weight="500" fill="${textColor}" fill-opacity="0.5">Real-time commit calendar</text>

    <!-- Less / More Scale -->
    <g transform="translate(${width - 48 - 140}, 0)">
      <text x="0" y="7" font-size="9" font-weight="500" fill="${textColor}" fill-opacity="0.5">Less</text>
      <rect x="28" y="0" width="8" height="8" rx="1.5" fill="${textColor}" fill-opacity="0.08" />
      <rect x="40" y="0" width="8" height="8" rx="1.5" fill="${primaryColor}" fill-opacity="0.32" />
      <rect x="52" y="0" width="8" height="8" rx="1.5" fill="${primaryColor}" fill-opacity="0.58" />
      <rect x="64" y="0" width="8" height="8" rx="1.5" fill="${primaryColor}" fill-opacity="0.82" />
      <rect x="76" y="0" width="8" height="8" rx="1.5" fill="${primaryColor}" fill-opacity="1.0" />
      <text x="92" y="7" font-size="9" font-weight="500" fill="${textColor}" fill-opacity="0.5">More</text>
    </g>
  </g>
</svg>`;
    }

    case 'pin':
    case 'repo': {
      const showOwner = rawParams.showOwner === true;
      const repo = rawParams.repoData || {
        name: rawParams.repo || 'repository',
        owner: username,
        description: rawParams.customDescription || `Pinned repository by @${username}`,
        stars: 0,
        forks: 0,
        language: 'TypeScript',
        languageColor: LANGUAGE_COLORS['TypeScript'],
        isFork: false,
        isArchived: false,
      };

      const displayName = showOwner ? `${repo.owner}/${repo.name}` : repo.name;
      const maxLineChars = Math.max(30, Math.floor((width - 48) / 6.5));
      const words = (repo.description || '').split(' ');
      const lines: string[] = [];
      let curLine = '';

      for (const w of words) {
        if ((curLine + ' ' + w).length > maxLineChars) {
          lines.push(curLine.trim());
          curLine = w;
          if (lines.length === 2) break;
        } else {
          curLine = curLine ? curLine + ' ' + w : w;
        }
      }
      if (curLine && lines.length < 2) lines.push(curLine.trim());

      const descBlock = lines.map((l, idx) =>
        `<tspan x="24" dy="${idx === 0 ? 0 : 16}">${escapeXml(l)}</tspan>`
      ).join('');

      const badgeText = repo.isArchived ? 'Archived' : repo.isFork ? 'Fork' : 'Public';
      const badgeWidth = badgeText.length * 6.5 + 16;
      const badgeX = width - 24 - badgeWidth;

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <!-- Header -->
  <g class="${animate ? 'card-anim d-1' : ''}" transform="translate(24, 22)">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11 1h4.25a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.25a2.25 2.25 0 0 0-2.25 2.25.75.75 0 0 1-1.5 0 2.25 2.25 0 0 0-2.25-2.25H.75a.75.75 0 0 1-.75-.75V1.75Zm8.25 10.18a3.758 3.758 0 0 1 1.25-.93V2.503a2.25 2.25 0 0 0-1.25.928v8.499ZM6.75 2.504a2.25 2.25 0 0 0-1.25-.93v8.5a3.757 3.757 0 0 1 1.25.93V2.504Z" fill="${secondaryColor}" />
    <text font-size="14" font-weight="700" fill="${primaryColor}" x="22" y="11">${escapeXml(displayName)}</text>
  </g>

  <!-- Badge -->
  <g class="${animate ? 'card-anim d-1' : ''}">
    <rect x="${badgeX}" y="12" width="${badgeWidth}" height="18" rx="9" fill="${textColor}" fill-opacity="0.08" stroke="${textColor}" stroke-opacity="0.18" stroke-width="1" />
    <text font-size="9" font-weight="600" fill="${textColor}" opacity="0.85" x="${badgeX + badgeWidth / 2}" y="24" text-anchor="middle">${badgeText}</text>
  </g>

  <!-- Description -->
  <g class="${animate ? 'card-anim d-2' : ''}">
    <text font-size="11.5" font-weight="400" fill="${textColor}" opacity="0.8" x="24" y="52">
      ${descBlock}
    </text>
  </g>

  <!-- Footer Meta -->
  <g class="${animate ? 'card-anim d-3' : ''}" transform="translate(24, ${height - 20})">
    <g transform="translate(0, 0)">
      <circle cx="5" cy="-4" r="4.5" fill="${repo.languageColor || primaryColor}" />
      <text font-size="11" font-weight="500" fill="${textColor}" opacity="0.85" x="14" y="0">${escapeXml(repo.language || 'Code')}</text>
    </g>

    <g transform="translate(110, 0)">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill="${secondaryColor}" transform="translate(0, -9) scale(0.85)" />
      <text font-size="11" font-weight="500" fill="${textColor}" opacity="0.85" x="18" y="0">${formatNumber(repo.stars)}</text>
    </g>

    <g transform="translate(180, 0)">
      <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="${secondaryColor}" transform="translate(0, -9) scale(0.85)" />
      <text font-size="11" font-weight="500" fill="${textColor}" opacity="0.85" x="18" y="0">${formatNumber(repo.forks)}</text>
    </g>
  </g>
</svg>`;
    }

    case 'streak': {
      const streak = rawParams.streak || { current: 58, longest: 97, total: 16691 };
      const colW = Math.round((width - 48) / 3);

      const longestSub = streak.longestStreakStart && streak.longestStreakEnd
        ? `${streak.longestStreakStart} to ${streak.longestStreakEnd}`
        : 'Personal record';
      const currentSub = streak.current > 0 ? 'Streak continuing' : 'Inactive today';

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <g transform="translate(24, 22)">
    <g class="${animate ? 'card-anim d-1' : ''}">
      <text class="header-title" x="0" y="12">Contribution Streak</text>
      <text class="header-sub" x="${width - 48}" y="12" text-anchor="end">Active Profile</text>
      <line x1="0" y1="22" x2="${width - 48}" y2="22" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
    </g>

    <g transform="translate(0, 48)">
      <g transform="translate(0, 0)" class="${animate ? 'card-anim d-1' : ''}">
        <text class="stat-lbl" x="0" y="14">Total Contributions</text>
        <text class="stat-val" x="0" y="44" fill="${textColor}">${formatNumber(streak.total)}</text>
        <text font-size="10" fill="${textColor}" opacity="0.4" x="0" y="64">Lifetime total</text>
      </g>

      <line x1="${colW - 10}" y1="8" x2="${colW - 10}" y2="70" stroke="${textColor}" stroke-opacity="0.1" />

      <g transform="translate(${colW}, 0)" class="${animate ? 'card-anim d-2' : ''}">
        <g transform="translate(0, 2)">
          <path d="M12 2c.5 3-1.5 5.5-2.5 7.5S8 13.5 9 16c.8-1.5 2-2.5 3.5-3 0 2 1.5 3.5 1.5 5.5 0 3-2.5 5.5-5.5 5.5S3 21.5 3 18.5C3 13 8 7 12 2z" fill="${primaryColor}" />
        </g>
        <text class="stat-lbl" x="22" y="14" fill="${primaryColor}">Current Streak</text>
        <text class="stat-val" x="0" y="44" fill="${primaryColor}">${streak.current} Days</text>
        <text font-size="10" fill="${secondaryColor}" x="0" y="64">${currentSub}</text>
      </g>

      <line x1="${colW * 2 - 10}" y1="8" x2="${colW * 2 - 10}" y2="70" stroke="${textColor}" stroke-opacity="0.1" />

      <g transform="translate(${colW * 2}, 0)" class="${animate ? 'card-anim d-3' : ''}">
        <text class="stat-lbl" x="0" y="14">Longest Streak</text>
        <text class="stat-val" x="0" y="44" fill="${secondaryColor}">${streak.longest} Days</text>
        <text font-size="10" fill="${textColor}" opacity="0.4" x="0" y="64">${longestSub}</text>
      </g>
    </g>

    <g transform="translate(0, 136)" class="${animate ? 'card-anim d-4' : ''}">
      ${Array.from({ length: 16 }).map((_, i) => {
        const dotW = Math.round((width - 48 - 15 * 4) / 16);
        const x = i * (dotW + 4);
        const active = i >= 8;
        return `<rect x="${x}" y="0" width="${dotW}" height="4" rx="2" fill="${active ? primaryColor : secondaryColor}" fill-opacity="${0.2 + (i * 0.05)}" />`;
      }).join('')}
    </g>
  </g>
</svg>`;
    }

    case 'stats': {
      const stats = rawParams.stats || { totalStars: 1420, publicRepos: 48, followers: 890, totalForks: 312 };
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientDef}
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
  </defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <g transform="translate(24, 22)">
    <g class="${animate ? 'card-anim d-1' : ''}">
      <text class="header-title" x="0" y="12">${escapeXml(username)}'s GitHub Stats</text>
      <text class="header-sub" x="${width - 48}" y="12" text-anchor="end">Top Rank</text>
      <line x1="0" y1="22" x2="${width - 48}" y2="22" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
    </g>

    <g transform="translate(0, 48)">
      <g transform="translate(0, 0)" class="${animate ? 'card-anim d-1' : ''}">
        <rect x="0" y="0" width="36" height="36" rx="8" fill="${primaryColor}" fill-opacity="0.12" />
        <path d="M18 10l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L18 10z" fill="${primaryColor}" />
        <text class="stat-val" x="48" y="20" fill="${primaryColor}">${formatNumber(stats.totalStars)}</text>
        <text class="stat-lbl" x="48" y="34">Total Stars</text>
      </g>

      <g transform="translate(${Math.round((width - 48) / 2)}, 0)" class="${animate ? 'card-anim d-2' : ''}">
        <rect x="0" y="0" width="36" height="36" rx="8" fill="${secondaryColor}" fill-opacity="0.12" />
        <path d="M11 14h14v10H11z M14 11h8v3h-8z" fill="none" stroke="${secondaryColor}" stroke-width="1.8" stroke-linejoin="round" />
        <text class="stat-val" x="48" y="20" fill="${secondaryColor}">${formatNumber(stats.publicRepos)}</text>
        <text class="stat-lbl" x="48" y="34">Repositories</text>
      </g>

      <g transform="translate(0, 56)" class="${animate ? 'card-anim d-3' : ''}">
        <rect x="0" y="0" width="36" height="36" rx="8" fill="${primaryColor}" fill-opacity="0.12" />
        <path d="M14 17a4 4 0 100-8 4 4 0 000 8zm8 2a3 3 0 100-6 3 3 0 000 6zm-8 2c-3.3 0-8 1.7-8 5v2h16v-2c0-3.3-4.7-5-8-5z" fill="${primaryColor}" />
        <text class="stat-val" x="48" y="20" fill="${primaryColor}">${formatNumber(stats.followers)}</text>
        <text class="stat-lbl" x="48" y="34">Followers</text>
      </g>

      <g transform="translate(${Math.round((width - 48) / 2)}, 56)" class="${animate ? 'card-anim d-4' : ''}">
        <rect x="0" y="0" width="36" height="36" rx="8" fill="${secondaryColor}" fill-opacity="0.12" />
        <path d="M13 11a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4zm-5 14a2 2 0 100-4 2 2 0 000 4z M13 11v3c0 2 1.5 3.5 3.5 3.5h3c2 0 3.5-1.5 3.5-3.5v-3 M18 17.5v3.5" fill="none" stroke="${secondaryColor}" stroke-width="1.8" stroke-linecap="round" />
        <text class="stat-val" x="48" y="20" fill="${secondaryColor}">${formatNumber(stats.totalForks)}</text>
        <text class="stat-lbl" x="48" y="34">Total Forks</text>
      </g>
    </g>
  </g>
</svg>`;
    }

    case 'languages': {
      const langs = (rawParams.languages && rawParams.languages.length > 0)
        ? rawParams.languages.slice(0, 5)
        : [
            { name: 'TypeScript', percentage: 46, color: '#3178c6' },
            { name: 'Python', percentage: 24, color: '#3572a5' },
            { name: 'Rust', percentage: 14, color: '#dea584' },
            { name: 'Go', percentage: 10, color: '#00add8' },
            { name: 'HTML/CSS', percentage: 6, color: '#e34c26' },
          ];

      const barWidth = width - 48;
      let progressOffset = 0;
      const progressSegments = langs.map((l) => {
        const segWidth = Math.max(2, Math.round((l.percentage / 100) * barWidth));
        const seg = `<rect x="${progressOffset}" y="0" width="${segWidth}" height="8" rx="2" fill="${l.color || primaryColor}" />`;
        progressOffset += segWidth;
        return seg;
      }).join('\n      ');

      const rows = langs.map((l, idx) => {
        const y = 88 + idx * 36;
        return `
      <g transform="translate(0, ${y})" class="${animate ? `card-anim d-${(idx % 4) + 1}` : ''}">
        <circle cx="6" cy="6" r="5" fill="${l.color || primaryColor}" />
        <text x="20" y="10" font-size="12" font-weight="600" fill="${textColor}">${escapeXml(l.name)}</text>
        <text x="${barWidth}" y="10" font-size="12" font-weight="700" fill="${primaryColor}" text-anchor="end">${l.percentage}%</text>
        <rect x="20" y="16" width="${barWidth - 20}" height="4" rx="2" fill="${textColor}" fill-opacity="0.1" />
        <rect x="20" y="16" width="${Math.round(((barWidth - 20) * l.percentage) / 100)}" height="4" rx="2" fill="${l.color || primaryColor}" />
      </g>`;
      }).join('');

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <g transform="translate(24, 22)">
    <g class="${animate ? 'card-anim d-1' : ''}">
      <text class="header-title" x="0" y="12">Top Languages</text>
      <text class="header-sub" x="${barWidth}" y="12" text-anchor="end">${langs.length} Tracked</text>
      <line x1="0" y1="22" x2="${barWidth}" y2="22" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
    </g>

    <g transform="translate(0, 36)" class="${animate ? 'card-anim d-2' : ''}">
      <rect x="0" y="0" width="${barWidth}" height="8" rx="4" fill="${textColor}" fill-opacity="0.1" />
      <g clip-path="url(#barClip)">${progressSegments}</g>
    </g>
    <clipPath id="barClip"><rect x="0" y="36" width="${barWidth}" height="8" rx="4" /></clipPath>

    ${rows}
  </g>
</svg>`;
    }

    case 'activity': {
      const activityData = rawParams.activity || [12, 18, 25, 20, 32, 45, 60, 48, 55, 70, 85, 92, 110];
      const max = Math.max(...activityData, 10);
      const graphW = width - 48;
      const graphH = 65;

      const points = activityData.map((val, idx) => {
        const x = Math.round((idx / (activityData.length - 1)) * graphW);
        const y = Math.round(graphH - (val / max) * graphH);
        return { x, y };
      });

      const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
      const areaD = `${pathD} L ${graphW} ${graphH} L 0 ${graphH} Z`;

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientDef}
    <linearGradient id="actArea" x1="0%" y1="0%" x2="0%" y2="1">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.0" />
    </linearGradient>
  </defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <g transform="translate(24, 22)">
    <g class="${animate ? 'card-anim d-1' : ''}">
      <text class="header-title" x="0" y="12">Weekly Activity</text>
      <text class="header-sub" x="${graphW}" y="12" text-anchor="end">Last 12 Weeks</text>
      <line x1="0" y1="22" x2="${graphW}" y2="22" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
    </g>

    <g transform="translate(0, 48)" class="${animate ? 'card-anim d-2' : ''}">
      <path d="${areaD}" fill="url(#actArea)" />
      <path d="${pathD}" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map((pt, i) => (i % 3 === 0 || i === points.length - 1) ? `<circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="${bgFill}" stroke="${primaryColor}" stroke-width="2" />` : '').join('')}
    </g>

    <g transform="translate(0, 134)" class="${animate ? 'card-anim d-3' : ''}">
      <text font-size="10" fill="${textColor}" opacity="0.5" x="0" y="10">Earlier</text>
      <text font-size="10" fill="${textColor}" opacity="0.5" x="${graphW / 2}" y="10" text-anchor="middle">Mid-Period</text>
      <text font-size="10" font-weight="700" fill="${primaryColor}" x="${graphW}" y="10" text-anchor="end">This Week (Peak)</text>
    </g>
  </g>
</svg>`;
    }

    case 'quote': {
      const q = rawParams.quote || FALLBACK_QUOTES[0];
      const maxCharsPerLine = 48;
      const words = q.quote.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + ' ' + word).length > maxCharsPerLine) {
          lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        }
      }
      if (currentLine) lines.push(currentLine.trim());

      const displayedLines = lines.slice(0, 3);
      const textBlock = displayedLines.map((line, i) =>
        `<tspan x="${width / 2}" dy="${i === 0 ? 0 : 22}">${escapeXml(line)}</tspan>`
      ).join('');

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <g transform="translate(24, 22)">
    <g class="${animate ? 'card-anim d-1' : ''}">
      <text class="header-title" x="0" y="12">Developer Wisdom</text>
      <text class="header-sub" x="${width - 48}" y="12" text-anchor="end">#inspiration</text>
      <line x1="0" y1="22" x2="${width - 48}" y2="22" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
    </g>

    <path d="M14 0c-4 0-7 3-7 7 0 2 1 4 3 5-1 2-3 4-5 5l2 2c4-2 7-6 7-9V0zm14 0c-4 0-7 3-7 7 0 2 1 4 3 5-1 2-3 4-5 5l2 2c4-2 7-6 7-9V0z" fill="${primaryColor}" opacity="0.15" transform="translate(10, 32) scale(1.4)" />

    <g class="${animate ? 'card-anim d-2' : ''}">
      <text x="${width / 2}" y="76" font-size="14" font-style="italic" font-weight="500" fill="${textColor}" text-anchor="middle" line-height="1.5">
        "${textBlock}"
      </text>
    </g>

    <g class="${animate ? 'card-anim d-3' : ''}">
      <text x="${width / 2}" y="138" font-size="12" font-weight="600" fill="${secondaryColor}" text-anchor="middle">
        — ${escapeXml(q.author)}
      </text>
    </g>
  </g>
</svg>`;
    }

    case 'banner': {
      const h = height;
      const w = width;

      const waveD1 = `M0 0 L0 ${Math.round(h * 0.6)} Q ${Math.round(w * 0.25)} ${Math.round(h * 0.8)} ${Math.round(w * 0.5)} ${Math.round(h * 0.65)} T ${w} ${Math.round(h * 0.75)} L ${w} 0 Z`;
      const waveD2 = `M0 0 L0 ${Math.round(h * 0.7)} Q ${Math.round(w * 0.25)} ${Math.round(h * 0.6)} ${Math.round(w * 0.5)} ${Math.round(h * 0.75)} T ${w} ${Math.round(h * 0.65)} L ${w} 0 Z`;

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bannerWave" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.15" />
    </linearGradient>
    <clipPath id="bannerClip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" />
    </clipPath>
  </defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />

  <g clip-path="url(#bannerClip)">
    <path d="${waveD1}" fill="url(#bannerWave)">
      ${animate ? `<animate attributeName="d" dur="${12 * m}s" repeatCount="indefinite" values="${waveD1};${waveD2};${waveD1}" />` : ''}
    </path>
  </g>

  <g transform="translate(${Math.round(width / 2)}, ${Math.round(height / 2)})" text-anchor="middle" class="${animate ? 'card-anim d-1' : ''}">
    <text y="-8" font-size="28" font-weight="800" fill="${primaryColor}" letter-spacing="-0.03em">
      ${escapeXml(bannerName)}
    </text>
    <text y="22" font-size="13" font-weight="500" fill="${textColor}" opacity="0.8" letter-spacing="0.02em">
      ${escapeXml(bannerDescription)}
    </text>
  </g>
</svg>`;
    }

    case 'skills':
    case 'stack': {
      const skillsLayout = rawParams.skillsLayout || 'matrix';
      const title = rawParams.customText || `${username}'s Tech Stack`;
      const subtitle = rawParams.customDescription || '#fullstack · ecosystem';

      let userStacks: string[] = [];
      if (Array.isArray(rawParams.stacks)) {
        userStacks = rawParams.stacks;
      } else if (typeof rawParams.stacks === 'string' && rawParams.stacks.trim().length > 0) {
        userStacks = rawParams.stacks.split(',').map((s) => s.trim().toLowerCase());
      } else {
        userStacks = ['languages', 'farm', 'pern', 'lemp', 'django'];
      }

      let groups: Array<{ label: string; skills: string[] }> = [];

      if (skillsLayout === 'stacks') {
        groups = userStacks
          .map((stk) => PRESET_STACKS[stk] || { label: stk.toUpperCase(), skills: [stk] })
          .filter(Boolean);
      } else {
        let allSkills: string[] = [];
        if (rawParams.skills) {
          const list = typeof rawParams.skills === 'string' ? rawParams.skills.split(',') : rawParams.skills;
          allSkills = list.map((s) => s.trim()).filter(Boolean);
        } else {
          userStacks.forEach((stk) => {
            if (PRESET_STACKS[stk]) {
              allSkills.push(...PRESET_STACKS[stk].skills);
            }
          });
        }

        const seen = new Set<string>();
        const uniqueSkills: string[] = [];
        allSkills.forEach((s) => {
          const key = s.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueSkills.push(s);
          }
        });

        const categorized: Record<string, string[]> = {
          'Languages': [],
          'Frameworks & Runtimes': [],
          'Databases & Storage': [],
          'DevOps & Systems': [],
        };

        uniqueSkills.forEach((skill) => {
          const cat = getSkillCategory(skill);
          if (categorized[cat]) {
            categorized[cat].push(skill);
          } else {
            categorized['Languages'].push(skill);
          }
        });

        groups = Object.entries(categorized)
          .filter(([_, list]) => list.length > 0)
          .map(([label, skills]) => ({ label, skills }));
      }

      let contentSvg = '';
      let currentY = 66;

      groups.forEach((grp, gIdx) => {
        const rowDelay = (gIdx + 1) * 0.05 * m;
        contentSvg += `
          <g class="${animate ? 'card-anim' : ''}" style="animation-delay: ${rowDelay}s" transform="translate(25, ${currentY})">
            <text x="0" y="11" font-size="10" font-weight="700" fill="${secondaryColor}" letter-spacing="0.05em">${escapeXml(grp.label.toUpperCase())}</text>
            <g transform="translate(0, 16)">
        `;

        let curX = 0;
        let rowYOffset = 0;
        const maxRowWidth = width - 50;

        grp.skills.forEach((skill) => {
          const approxCharWidth = 6.4;
          const textWidth = Math.round(skill.length * approxCharWidth);
          const pillWidth = textWidth + 24;

          if (curX + pillWidth > maxRowWidth && curX > 0) {
            curX = 0;
            rowYOffset += 26;
          }

          const dotColor = LANGUAGE_COLORS[skill] || primaryColor;

          contentSvg += `
            <g transform="translate(${curX}, ${rowYOffset})">
              <rect width="${pillWidth}" height="22" rx="5" fill="${primaryColor}14" stroke="${primaryColor}35" stroke-width="1" />
              <circle cx="10" cy="11" r="3" fill="${dotColor}" />
              <text x="18" y="14.5" font-size="10" font-weight="600" fill="${textColor}">${escapeXml(skill)}</text>
            </g>
          `;
          curX += pillWidth + 6;
        });

        contentSvg += `
            </g>
          </g>
        `;
        currentY += 42 + rowYOffset;
      });

      const actualHeight = Math.max(height, currentY + 15);

      return `<svg width="${width}" height="${actualHeight}" viewBox="0 0 ${width} ${actualHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${actualHeight - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />
  
  <g transform="translate(25, 24)">
    <g class="${animate ? 'card-anim d-1' : ''}">
      <rect width="22" height="22" rx="5" fill="${primaryColor}" fill-opacity="0.2" />
      <path d="M11 6L5 9L11 12L17 9L11 6Z" stroke="${primaryColor}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 12L11 15L17 12" stroke="${primaryColor}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 15L11 18L17 15" stroke="${primaryColor}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      
      <text x="32" y="15" class="header-title">${escapeXml(title)}</text>
      <text x="${width - 50}" y="15" text-anchor="end" class="header-sub">${escapeXml(subtitle)}</text>
      <line x1="0" y1="26" x2="${width - 50}" y2="26" stroke="${textColor}" stroke-opacity="0.1" stroke-width="1" />
    </g>
  </g>
  
  ${contentSvg}
</svg>`;
    }

    default: {
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  ${baseStyles}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" fill="${bgFill}" ${borderStyle} />
  <g transform="translate(${width / 2}, ${height / 2})" text-anchor="middle">
    <text y="0" font-size="16" font-weight="700" fill="${primaryColor}">
      ${escapeXml(rawParams.customText || `${username}'s Canvas Card`)}
    </text>
  </g>
</svg>`;
    }
  }
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface GitHubUser {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface FetchedContributions {
  total: number;
  longest: number;
  longestStart: string;
  longestEnd: string;
  current: number;
  currentStart: string;
  currentEnd: string;
  days: Array<{ date: string; count: number; level: number }>;
}

// In-memory cache for contribution data (30 min TTL)
const contribCache = new Map<string, { data: FetchedContributions; expires: number }>();

async function fetchContributions(username: string): Promise<FetchedContributions> {
  const cached = contribCache.get(username.toLowerCase());
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Try jogruber contributions API for full all-time streak & total
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=all`);
    if (res.ok) {
      const data = await res.json();
      const allDays: Array<{ date: string; count: number; level?: number }> = Array.isArray(data.contributions) ? data.contributions : [];

      if (allDays.length > 0) {
        allDays.sort((a, b) => a.date.localeCompare(b.date));

        let total = 0;
        if (typeof data.total === 'object' && data.total !== null) {
          total = Object.values(data.total as Record<string, unknown>).reduce<number>(
            (sum: number, v: unknown) => sum + (Number(v) || 0),
            0
          );
        } else if (typeof data.total === 'number') {
          total = data.total;
        } else {
          total = allDays.reduce((sum, d) => sum + (d.count || 0), 0);
        }

        // Longest streak across all-time history
        let longestStreak = 0;
        let tempStreak = 0;
        let longestStart = '';
        let longestEnd = '';
        let tempStart = '';
        for (const d of allDays) {
          if (d.count > 0) {
            if (tempStreak === 0) tempStart = d.date;
            tempStreak++;
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
              longestStart = tempStart;
              longestEnd = d.date;
            }
          } else {
            tempStreak = 0;
          }
        }

        // Current streak (evaluating up to today)
        const pastDays = allDays.filter((d) => d.date <= todayStr);
        let curStreak = 0;
        let curStart = '';
        let curEnd = '';
        for (let i = pastDays.length - 1; i >= 0; i--) {
          const d = pastDays[i];
          if (d.count > 0) {
            if (curStreak === 0) curEnd = d.date;
            curStart = d.date;
            curStreak++;
          } else {
            if (d.date === todayStr && curStreak === 0) continue;
            break;
          }
        }

        // Past 53 weeks (53 * 7 = 371 days)
        const recentDays = allDays.slice(-371).map((d) => ({
          date: d.date,
          count: d.count,
          level: d.level !== undefined ? d.level : (d.count === 0 ? 0 : d.count <= 3 ? 1 : d.count <= 6 ? 2 : d.count <= 9 ? 3 : 4),
        }));

        const result: FetchedContributions = {
          total,
          longest: longestStreak,
          longestStart,
          longestEnd,
          current: curStreak,
          currentStart: curStart,
          currentEnd: curEnd,
          days: recentDays,
        };

        contribCache.set(username.toLowerCase(), { data: result, expires: Date.now() + 1800000 });
        return result;
      }
    }
  } catch (err) {
    console.warn('jogruber contributions API failed:', err);
  }

  // 2. Fallback: scrape https://github.com/users/{username}/contributions
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (res.ok) {
      const html = await res.text();
      const dayMatches = [...html.matchAll(/<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"[^>]*>/g)];
      const tooltipMatches = [...html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g)];
      const tooltipMap: Record<string, number> = {};
      for (const tm of tooltipMatches) {
        const text = tm[2].trim();
        const numMatch = text.match(/^(\d+)\s+contribution/);
        tooltipMap[tm[1]] = numMatch ? parseInt(numMatch[1], 10) : 0;
      }

      const days: Array<{ date: string; level: number; count: number }> = [];
      for (const dm of dayMatches) {
        const fullTag = dm[0];
        const date = dm[1];
        const level = parseInt(dm[2], 10);
        const idMatch = fullTag.match(/id="([^"]+)"/);
        const id = idMatch ? idMatch[1] : '';
        const count = tooltipMap[id] !== undefined ? tooltipMap[id] : (level > 0 ? level * 2 : 0);
        days.push({ date, level, count });
      }

      if (days.length > 0) {
        days.sort((a, b) => a.date.localeCompare(b.date));
        const total = days.reduce((sum, d) => sum + d.count, 0);

        let longestStreak = 0;
        let tempStreak = 0;
        let longestStart = '';
        let longestEnd = '';
        let tempStart = '';
        for (const d of days) {
          if (d.count > 0) {
            if (tempStreak === 0) tempStart = d.date;
            tempStreak++;
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
              longestStart = tempStart;
              longestEnd = d.date;
            }
          } else {
            tempStreak = 0;
          }
        }

        let curStreak = 0;
        let curStart = '';
        let curEnd = '';
        for (let i = days.length - 1; i >= 0; i--) {
          const d = days[i];
          if (d.count > 0) {
            if (curStreak === 0) curEnd = d.date;
            curStart = d.date;
            curStreak++;
          } else {
            if (d.date === todayStr && curStreak === 0) continue;
            break;
          }
        }

        const result: FetchedContributions = {
          total,
          longest: longestStreak,
          longestStart,
          longestEnd,
          current: curStreak,
          currentStart: curStart,
          currentEnd: curEnd,
          days,
        };

        contribCache.set(username.toLowerCase(), { data: result, expires: Date.now() + 1800000 });
        return result;
      }
    }
  } catch (err) {
    console.warn('Scraping contributions failed:', err);
  }

  // 3. Fallback deterministic data
  return {
    total: 0,
    longest: 0,
    longestStart: '',
    longestEnd: '',
    current: 0,
    currentStart: '',
    currentEnd: '',
    days: [],
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const q = req.query || {};
    const format = (q.format as string) || 'svg';

    const rawType = (q.type as string) || 'stats';
    const theme = (q.theme as string) || 'electric-blue';

    const bgColor = normalizeColor(q.bg_color as string || q.bg as string || q.bgColor as string, THEMES[theme]?.bg || '#0b1220');
    const primaryColor = normalizeColor(q.title_color as string || q.primary as string || q.primaryColor as string, THEMES[theme]?.primary || '#3b82f6');
    const secondaryColor = normalizeColor(q.icon_color as string || q.secondary as string || q.secondaryColor as string, THEMES[theme]?.secondary || '#06b6d4');
    const textColor = normalizeColor(q.text_color as string || q.text as string || q.textColor as string, THEMES[theme]?.text || '#f1f5f9');
    const borderColor = normalizeColor(q.border_color as string || q.border as string || q.borderColor as string, THEMES[theme]?.border || '#3b82f6');

    const username = (q.username as string) || (q.user as string) || (q.owner as string) || '';
    const repoName = (q.repo as string) || (q.repository as string) || '';

    const cardParams: CardParams = {
      type: rawType,
      username,
      repo: repoName,
      theme,
      bgColor,
      primaryColor,
      secondaryColor,
      textColor,
      borderColor,
      borderRadius: q.radius ? parseInt(q.radius as string, 10) : (q.borderRadius ? parseInt(q.borderRadius as string, 10) : 12),
      showBorder: q.showBorder !== 'false' && q.show_border !== 'false',
      showOwner: q.show_owner === 'true' || q.showOwner === 'true',
      width: q.width ? parseInt(q.width as string, 10) : undefined,
      height: q.height ? parseInt(q.height as string, 10) : undefined,
      customText: (q.customText as string) || '',
      customDescription: (q.description as string) || (q.customDescription as string) || undefined,
      animate: q.animate !== 'false',
      animation: (q.animation as string) || 'fadeIn',
      speed: (q.speed as string) || 'normal',
      gradient: q.gradient === 'true',
      gradientType: (q.gradientType as string) || 'linear',
      gradientAngle: q.gradientAngle ? parseInt(q.gradientAngle as string, 10) : 135,
      gradientStart: q.gradientStart ? decodeURIComponent(q.gradientStart as string) : undefined,
      gradientEnd: q.gradientEnd ? decodeURIComponent(q.gradientEnd as string) : undefined,
      bannerName: q.bannerName ? decodeURIComponent(q.bannerName as string) : undefined,
      bannerDescription: q.bannerDescription ? decodeURIComponent(q.bannerDescription as string) : undefined,
      waveStyle: (q.waveStyle as string) || 'wave',
      quoteTopic: (q.quoteTopic as string) || undefined,
      skills: (q.skills as string) || undefined,
      stacks: (q.stacks as string) || undefined,
      skillsLayout: (q.skillsLayout as 'matrix' | 'stacks' | 'compact') || (q.layout as 'matrix' | 'stacks' | 'compact') || undefined,
    };

    // If type is pin or repo, fetch repo info
    if (cardParams.type === 'pin' || cardParams.type === 'repo') {
      let repoData = {
        name: repoName || 'repository',
        owner: username || 'developer',
        description: cardParams.customDescription || `Pinned repository by @${username}`,
        stars: 0,
        forks: 0,
        language: 'TypeScript',
        languageColor: LANGUAGE_COLORS['TypeScript'],
        isFork: false,
        isArchived: false,
      };

      try {
        const ghHeaders: Record<string, string> = {
          'User-Agent': 'github-canvas-card-generator',
          'Accept': 'application/vnd.github.v3+json',
        };
        const token = process.env.GITHUB_TOKEN || process.env.GIT_TOKEN;
        if (token && !token.startsWith('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')) {
          ghHeaders['Authorization'] = `token ${token}`;
        }

        const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}`, {
          headers: ghHeaders,
        });

        if (res.ok) {
          const gh = await res.json();
          const lang = gh.language || 'Code';
          repoData = {
            name: gh.name || repoName,
            owner: gh.owner?.login || username,
            description: cardParams.customDescription || gh.description || 'No description provided.',
            stars: gh.stargazers_count || 0,
            forks: gh.forks_count || 0,
            language: lang,
            languageColor: LANGUAGE_COLORS[lang] || '#8b949e',
            isFork: gh.fork === true,
            isArchived: gh.archived === true,
          };
        } else {
          if (repoName.includes('.')) {
            repoData.language = 'Cloud';
            repoData.languageColor = LANGUAGE_COLORS['Cloud'];
            if (!cardParams.customDescription) {
              repoData.description = `Cloud infrastructure & microservices platform by @${username}`;
            }
          }
        }
      } catch (err) {
        console.warn('Card repo fetch error:', err);
      }

      cardParams.repoData = repoData;
    }

    // If type requires contribution data (contribution or streak)
    if (cardParams.username && (cardParams.type === 'contribution' || cardParams.type === 'streak')) {
      try {
        const contrib = await fetchContributions(cardParams.username);
        cardParams.streak = {
          current: contrib.current,
          longest: contrib.longest,
          total: contrib.total,
          longestStreakStart: contrib.longestStart,
          longestStreakEnd: contrib.longestEnd,
          currentStreakStart: contrib.currentStart,
          currentStreakEnd: contrib.currentEnd,
        };
        cardParams.contributionDays = contrib.days;
      } catch (cErr) {
        console.warn('Failed to fetch contributions:', cErr);
      }
    }

    // If type is stats or languages or activity
    if (cardParams.username && (cardParams.type === 'stats' || cardParams.type === 'languages' || cardParams.type === 'activity')) {
      try {
        const ghHeaders: Record<string, string> = {
          'User-Agent': 'github-canvas-svg-generator',
          'Accept': 'application/vnd.github.v3+json',
        };
        const token = process.env.GITHUB_TOKEN || process.env.GIT_TOKEN;
        if (token && !token.startsWith('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')) {
          ghHeaders['Authorization'] = `token ${token}`;
        }

        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${encodeURIComponent(cardParams.username)}`, { headers: ghHeaders }),
          fetch(`https://api.github.com/users/${encodeURIComponent(cardParams.username)}/repos?per_page=100&sort=updated`, { headers: ghHeaders }),
        ]);

        if (userRes.ok) {
          const user: GitHubUser = await userRes.json();
          let repos: GitHubRepo[] = [];
          if (reposRes.ok) {
            repos = await reposRes.json();
          }

          let totalStars = 0;
          let totalForks = 0;
          const langMap: Record<string, number> = {};

          repos.forEach((repo) => {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
            if (repo.language) {
              langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            }
          });

          cardParams.stats = {
            totalStars,
            publicRepos: user.public_repos || repos.length,
            followers: user.followers || 0,
            totalForks,
          };

          const totalLangRepos = Object.values(langMap).reduce((a, b) => a + b, 0);
          if (totalLangRepos > 0) {
            cardParams.languages = Object.entries(langMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name, count]) => ({
                name,
                percentage: Math.round((count / totalLangRepos) * 100),
                color: LANGUAGE_COLORS[name] || '#8b949e',
              }));
          }
        }
      } catch (ghErr) {
        console.warn('GitHub API fetch failed:', ghErr instanceof Error ? ghErr.message : String(ghErr));
      }
    }

    if (cardParams.type === 'quote') {
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      cardParams.quote = randomQuote;
    }

    const svg = generateCardSVG(cardParams);

    if (format === 'base64') {
      const base64 = Buffer.from(svg, 'utf-8').toString('base64');
      const dataUrl = `data:image/svg+xml;base64,${base64}`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(dataUrl);
    }

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(svg);

  } catch (error) {
    console.error('Fatal card handler error:', error);
    const fallbackSvg = `<svg width="495" height="195" viewBox="0 0 495 195" xmlns="http://www.w3.org/2000/svg">
      <rect width="495" height="195" rx="12" fill="#0b1220" stroke="#3b82f6" stroke-width="2" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#3b82f6" font-family="sans-serif" font-size="16" font-weight="bold">
        GitHub Canvas Stats Card
      </text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    return res.status(200).send(fallbackSvg);
  }
}
