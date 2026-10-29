import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export interface PinnedRepoData {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  isFork: boolean;
  isArchived: boolean;
}

export interface PinParams {
  username: string;
  repo: string;
  theme?: string;
  bgColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  strokeWidth?: number;
  showBorder?: boolean;
  showOwner?: boolean;
  width?: number;
  height?: number;
  customDescription?: string;
  animate?: boolean;
  animation?: string;
  speed?: string;
  gradient?: boolean;
  gradientType?: string;
  gradientAngle?: number;
  gradientStart?: string;
  gradientEnd?: string;
  repoData?: PinnedRepoData;
}

export function generatePinSVG(params: PinParams): string {
  const themeName = params.theme || 'github-dark';
  const theme = THEMES[themeName] || THEMES['github-dark'];

  const width = params.width || 400;
  const height = params.height || 120;
  const borderRadius = params.borderRadius !== undefined ? params.borderRadius : 12;
  const showBorder = params.showBorder !== false;
  const showOwner = params.showOwner === true;
  const animate = params.animate !== false;
  const speed = params.speed || 'normal';

  const bgColor = params.bgColor !== undefined ? params.bgColor : theme.bg;
  const primaryColor = params.primaryColor || theme.primary;
  const secondaryColor = params.secondaryColor || theme.secondary;
  const textColor = params.textColor || theme.text;
  const borderColor = params.borderColor || theme.border;

  const repo = params.repoData || {
    name: params.repo || 'repository',
    owner: params.username || 'developer',
    description: params.customDescription || 'Pinned repository on GitHub',
    stars: 0,
    forks: 0,
    language: 'TypeScript',
    languageColor: LANGUAGE_COLORS['TypeScript'],
    isFork: false,
    isArchived: false,
  };

  const displayName = showOwner ? `${repo.owner}/${repo.name}` : repo.name;
  const strokeWidth = params.strokeWidth !== undefined ? params.strokeWidth : 1.5;
  const borderStyle = showBorder && strokeWidth > 0 ? `stroke="${borderColor}" stroke-width="${strokeWidth}"` : '';

  const isTransparent = bgColor === 'transparent' || bgColor === 'none';
  let gradientDef = '';
  let bgFill = isTransparent ? 'none' : bgColor;
  if (params.gradient && !isTransparent) {
    const gradientType = params.gradientType || 'linear';
    const gradientStart = params.gradientStart || primaryColor;
    const gradientEnd = params.gradientEnd || secondaryColor;
    const gradientAngle = params.gradientAngle !== undefined ? params.gradientAngle : 135;

    if (gradientType === 'radial') {
      gradientDef = `
        <radialGradient id="pinBgGrad" cx="50%" cy="50%" r="70%">
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
        <linearGradient id="pinBgGrad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${gradientStart}" />
          <stop offset="100%" stop-color="${gradientEnd}" />
        </linearGradient>`;
    }
    bgFill = 'url(#pinBgGrad)';
  }

  const speedMultipliers: Record<string, number> = { slow: 1.8, normal: 1, fast: 0.6 };
  const m = speedMultipliers[speed] || 1;

  const animCSS = animate ? `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .card-anim { animation: fadeIn ${0.45 * m}s ease-out both; }
    .d-1 { animation-delay: ${0.05 * m}s; }
    .d-2 { animation-delay: ${0.1 * m}s; }
    .d-3 { animation-delay: ${0.15 * m}s; }
  ` : '';

  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap');
      * { box-sizing: border-box; }
      text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .repo-title { font-size: 14px; font-weight: 700; fill: ${primaryColor}; letter-spacing: -0.01em; }
      .repo-desc { font-size: 11.5px; font-weight: 400; fill: ${textColor}; opacity: 0.8; line-height: 1.5; }
      .meta-text { font-size: 11px; font-weight: 500; fill: ${textColor}; opacity: 0.85; }
      .pill-badge { font-size: 9px; font-weight: 600; fill: ${textColor}; opacity: 0.85; }
      ${animCSS}
    </style>
  `;

  // Text wrap for description (max 2 lines)
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
  if (curLine && lines.length < 2) {
    lines.push(curLine.trim());
  }

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
    <!-- Book / Repo Icon -->
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11 1h4.25a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.25a2.25 2.25 0 0 0-2.25 2.25.75.75 0 0 1-1.5 0 2.25 2.25 0 0 0-2.25-2.25H.75a.75.75 0 0 1-.75-.75V1.75Zm8.25 10.18a3.758 3.758 0 0 1 1.25-.93V2.503a2.25 2.25 0 0 0-1.25.928v8.499ZM6.75 2.504a2.25 2.25 0 0 0-1.25-.93v8.5a3.757 3.757 0 0 1 1.25.93V2.504Z" fill="${secondaryColor}" />
    <text class="repo-title" x="22" y="11">${escapeXml(displayName)}</text>
  </g>

  <!-- Badge -->
  <g class="${animate ? 'card-anim d-1' : ''}">
    <rect x="${badgeX}" y="12" width="${badgeWidth}" height="18" rx="9" fill="${textColor}" fill-opacity="0.08" stroke="${textColor}" stroke-opacity="0.18" stroke-width="1" />
    <text class="pill-badge" x="${badgeX + badgeWidth / 2}" y="24" text-anchor="middle">${badgeText}</text>
  </g>

  <!-- Description -->
  <g class="${animate ? 'card-anim d-2' : ''}">
    <text class="repo-desc" x="24" y="52">
      ${descBlock}
    </text>
  </g>

  <!-- Footer Meta -->
  <g class="${animate ? 'card-anim d-3' : ''}" transform="translate(24, ${height - 20})">
    <!-- Language -->
    <g transform="translate(0, 0)">
      <circle cx="5" cy="-4" r="4.5" fill="${repo.languageColor || primaryColor}" />
      <text class="meta-text" x="14" y="0">${escapeXml(repo.language || 'Code')}</text>
    </g>

    <!-- Stars -->
    <g transform="translate(110, 0)">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill="${secondaryColor}" transform="translate(0, -9) scale(0.85)" />
      <text class="meta-text" x="18" y="0">${formatNumber(repo.stars)}</text>
    </g>

    <!-- Forks -->
    <g transform="translate(180, 0)">
      <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="${secondaryColor}" transform="translate(0, -9) scale(0.85)" />
      <text class="meta-text" x="18" y="0">${formatNumber(repo.forks)}</text>
    </g>
  </g>
</svg>`;
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

    const username = (q.username as string) || (q.user as string) || (q.owner as string) || 'pgwiz';
    const repoName = (q.repo as string) || 'repository';

    const theme = (q.theme as string) || 'github-dark';
    const bgColor = normalizeColor(q.bg_color as string || q.bg as string || q.bgColor as string, THEMES[theme]?.bg || '#0d1117');
    const primaryColor = normalizeColor(q.title_color as string || q.primary as string || q.primaryColor as string, THEMES[theme]?.primary || '#58a6ff');
    const secondaryColor = normalizeColor(q.icon_color as string || q.secondary as string || q.secondaryColor as string, THEMES[theme]?.secondary || '#8b949e');
    const textColor = normalizeColor(q.text_color as string || q.text as string || q.textColor as string, THEMES[theme]?.text || '#c9d1d9');
    const borderColor = normalizeColor(q.border_color as string || q.border as string || q.borderColor as string, THEMES[theme]?.border || '#30363d');

    const pinParams: PinParams = {
      username,
      repo: repoName,
      theme,
      bgColor,
      primaryColor,
      secondaryColor,
      textColor,
      borderColor,
      borderRadius: q.radius ? parseInt(q.radius as string, 10) : (q.borderRadius ? parseInt(q.borderRadius as string, 10) : 12),
      strokeWidth: q.strokeWidth ? parseFloat(q.strokeWidth as string) : (q.stroke_width ? parseFloat(q.stroke_width as string) : (q.stroke ? parseFloat(q.stroke as string) : undefined)),
      showBorder: q.show_border !== 'false' && q.showBorder !== 'false',
      showOwner: q.show_owner === 'true' || q.showOwner === 'true',
      width: q.width ? parseInt(q.width as string, 10) : 400,
      height: q.height ? parseInt(q.height as string, 10) : 120,
      customDescription: (q.description as string) || (q.customDescription as string) || undefined,
      animate: q.animate !== 'false' && q.animation !== 'none',
      animation: (q.animation as string) || 'fadeIn',
      speed: (q.speed as string) || 'normal',
      gradient: q.gradient === 'true',
      gradientType: (q.gradientType as string) || 'linear',
      gradientAngle: q.gradientAngle ? parseInt(q.gradientAngle as string, 10) : 135,
      gradientStart: q.gradientStart ? decodeURIComponent(q.gradientStart as string) : undefined,
      gradientEnd: q.gradientEnd ? decodeURIComponent(q.gradientEnd as string) : undefined,
    };

    // Fetch repository data from GitHub
    let repoData: PinnedRepoData = {
      name: repoName,
      owner: username,
      description: pinParams.customDescription || `${repoName} - Open source repository by @${username}`,
      stars: 0,
      forks: 0,
      language: 'TypeScript',
      languageColor: LANGUAGE_COLORS['TypeScript'],
      isFork: false,
      isArchived: false,
    };

    try {
      const ghHeaders: Record<string, string> = {
        'User-Agent': 'github-canvas-pin-generator',
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
          description: pinParams.customDescription || gh.description || 'No description provided.',
          stars: gh.stargazers_count || 0,
          forks: gh.forks_count || 0,
          language: lang,
          languageColor: LANGUAGE_COLORS[lang] || '#8b949e',
          isFork: gh.fork === true,
          isArchived: gh.archived === true,
        };
      } else {
        // Fallback for private or custom repos (e.g. pgwiz.cloud)
        if (repoName.includes('.')) {
          repoData.language = 'Cloud';
          repoData.languageColor = LANGUAGE_COLORS['Cloud'];
          if (!pinParams.customDescription) {
            repoData.description = `Cloud infrastructure & microservices platform by @${username}`;
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Repo fetch error:', fetchErr);
    }

    pinParams.repoData = repoData;
    const svg = generatePinSVG(pinParams);

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

  } catch (err) {
    console.error('Fatal pin handler error:', err);
    const fallbackSvg = `<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="398" height="118" x="1" y="1" rx="12" fill="#0d1117" stroke="#3b82f6" stroke-width="1.5" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#58a6ff" font-family="sans-serif" font-size="14" font-weight="bold">
        Pinned Repository Card
      </text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    return res.status(200).send(fallbackSvg);
  }
}
