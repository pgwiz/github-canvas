import type { VercelRequest, VercelResponse } from '@vercel/node';

// Theme configurations
const themes: Record<string, any> = {
  neon: { bg: '#0d1117', primary: '#0CF709', secondary: '#00e1ff', text: '#c9d1d9', border: '#0CF709' },
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
  if (!str) return '';
  return str
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split("'").join('&apos;')
    .split('"').join('&quot;');
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
}

function formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (s.getFullYear() === e.getFullYear()) {
        return `${months[s.getMonth()]} ${s.getDate()} - ${months[e.getMonth()]} ${e.getDate()}`;
    }
    return `${months[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} - ${months[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
}

async function fetchContributionStats(username: string) {
    if (!process.env.GITHUB_TOKEN) return null;

    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    try {
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables: { login: username } }),
        });

        if (!res.ok) return null;
        const json = await res.json();

        if (json.errors || !json.data?.user?.contributionsCollection?.contributionCalendar) return null;

        const calendar = json.data.user.contributionsCollection.contributionCalendar;
        const days = calendar.weeks.flatMap((w: any) => w.contributionDays);

        // Calculate Streak
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        // Dates for ranges
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Iterate days to find streaks
        // Note: GitHub returns days sorted by date ascending
        for (const day of days) {
            if (day.contributionCount > 0) {
                tempStreak++;
                if (tempStreak > longestStreak) longestStreak = tempStreak;
            } else {
                tempStreak = 0;
            }
        }

        // Current Streak (checking from end backwards)
        // Check if today has contribution or if yesterday was the end of streak
        const todayStr = today.toISOString().split('T')[0];
        const lastDay = days[days.length - 1];

        // If last day in calendar is today
        let checkingIndex = days.length - 1;

        // If today has 0 contributions, we might still have a streak from yesterday?
        // Usually "Current Streak" includes today if contributions > 0, or yesterday if today is 0 but yesterday was > 0 (and today isn't over).
        // For simplicity: Count consecutive days ending at last available data point with > 0.

        let cStreak = 0;
        for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].contributionCount > 0) {
                cStreak++;
            } else {
                // If it's today and 0, we don't break yet if we haven't started counting?
                // Actually GitHub streaks logic is complex.
                // Simple version:
                if (days[i].date === todayStr && cStreak === 0) continue; // Skip today if 0
                break;
            }
        }
        currentStreak = cStreak;

        // Longest Streak Date Range logic is complex to extract, keeping it simple for now
        // Assuming we just want the numbers.

        // Total Contributions Date Range
        const startDate = days[0].date;
        const endDate = days[days.length - 1].date;

        return {
            totalContributions: calendar.totalContributions,
            currentStreak,
            longestStreak,
            startDate,
            endDate,
            days // Return days for heatmap
        };

    } catch (e) {
        console.error(e);
        return null;
    }
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
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0, // Keep precision for now
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6); // Take top 6

    // Fetch Contribution Data
    const contributionData = await fetchContributionStats(username);

    // Use fallback activity if no real data (though we want real data now)
    // Note: 'activity' in previous version was random bars.

    return {
      user: { login: user.login, name: user.name, avatar_url: user.avatar_url, created_at: user.created_at },
      stats: { totalStars, totalForks, publicRepos: user.public_repos, followers: user.followers, following: user.following },
      languages: languages.map(l => ({...l, percentage: parseFloat(l.percentage.toFixed(2))})),
      streak: contributionData ? {
          current: contributionData.currentStreak,
          longest: contributionData.longestStreak,
          total: contributionData.totalContributions,
          startDate: contributionData.startDate,
          endDate: contributionData.endDate
      } : { current: 0, longest: 0, total: 0 },
      contributionDays: contributionData?.days || [],
      activity: Array(7).fill(Math.floor(Math.random() * 10)), // Keep legacy random activity for 'activity' card type unless updated
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
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .title { font: 600 18px 'Inter', sans-serif; fill: ${p.primaryColor}; }
    .stat-value { font: 700 24px 'Inter', sans-serif; }
    .stat-label { font: 400 11px 'Inter', sans-serif; fill: ${p.textColor}; opacity: 0.7; }
    ${animStyles}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>
  
  <g transform="translate(25, 25)">
    <text class="title">${escapeXml(p.username)}'s GitHub Stats</text>
    
    <g transform="translate(0, 45)">
      <text class="stat-value" fill="${p.primaryColor}">⭐ ${formatNumber(stats.totalStars)}</text>
      <text class="stat-label" y="22">Total Stars</text>
    </g>
    
    <g transform="translate(115, 45)">
      <text class="stat-value" fill="${p.secondaryColor}">📦 ${stats.publicRepos}</text>
      <text class="stat-label" y="22">Repositories</text>
    </g>
    
    <g transform="translate(230, 45)">
      <text class="stat-value" fill="${p.primaryColor}">👥 ${formatNumber(stats.followers)}</text>
      <text class="stat-label" y="22">Followers</text>
    </g>
    
    <g transform="translate(345, 45)">
      <text class="stat-value" fill="${p.secondaryColor}">🔀 ${formatNumber(stats.totalForks)}</text>
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
  const barHeight = 10;

  // Calculate segments
  let offset = 0;
  const segments = languages.map((lang: any, i: number) => {
    const width = (lang.percentage / 100) * barWidth;
    // ensure minimum visible width if percentage > 0
    const w = Math.max(width, width > 0 ? 2 : 0);
    const rect = `<rect x="${offset}" y="0" width="${w}" height="${barHeight}" fill="${lang.color}"/>`;
    offset += w;
    return rect;
  }).join('');

  // Prepare legend items
  const mid = Math.ceil(languages.length / 2);
  const leftCol = languages.slice(0, mid);
  const rightCol = languages.slice(mid);

  const renderItem = (lang: any, y: number) => `
    <g transform="translate(0, ${y})">
      <circle cx="5" cy="5" r="5" fill="${lang.color}"/>
      <text x="20" y="5" class="lang-label" font-weight="700" dominant-baseline="middle">${lang.name} <tspan font-weight="400">${lang.percentage}%</tspan></text>
    </g>
  `;

  const leftItems = leftCol.map((l: any, i: number) => renderItem(l, i * 25)).join('');
  const rightItems = rightCol.map((l: any, i: number) => renderItem(l, i * 25)).join('');

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .title { font: 600 18px 'Inter', sans-serif; fill: ${p.primaryColor}; }
    .lang-label { font: 400 12px 'Inter', sans-serif; fill: ${p.textColor}; }
    ${animStyles}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>

  <g transform="translate(25, 25)" class="animate">
    <text class="title">Most Used Languages</text>

    <!-- Progress Bar -->
    <g transform="translate(0, 30)">
      <defs>
        <clipPath id="barClip">
          <rect width="${barWidth}" height="${barHeight}" rx="${barHeight/2}"/>
        </clipPath>
      </defs>
      <g clip-path="url(#barClip)">
        ${segments}
      </g>
    </g>

    <!-- Legend -->
    <g transform="translate(0, 60)">
      <g>${leftItems}</g>
      <g transform="translate(${barWidth / 2}, 0)">${rightItems}</g>
    </g>
  </g>
</svg>`;
}

function generateStreakSVG(p: any): string {
    const { animation = 'fadeIn', speed = 'normal' } = p;
    const gradientDefs = getGradientDefs(p);
    const bgFill = getBgFill(p);
    const streak = p.streak || { current: 0, longest: 0, total: 0 };

    // Dates
    const currentDate = new Date();
    const currentMonthDay = `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getDate()}`;
    const rangeText = streak.startDate && streak.endDate
        ? formatDateRange(streak.startDate, streak.endDate)
        : `${currentMonthDay}, ${currentDate.getFullYear()} - Present`;

    return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 ${p.width} ${p.height}" width="${p.width}px" height="${p.height}px" direction="ltr">
        ${gradientDefs}
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&amp;display=swap');
            @keyframes currstreak {
                0% { font-size: 3px; opacity: 0.2; }
                80% { font-size: 34px; opacity: 1; }
                100% { font-size: 28px; opacity: 1; }
            }
            @keyframes fadein {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
        </style>
        <defs>
            <clipPath id="outer_rectangle">
                <rect width="${p.width}" height="${p.height}" rx="${p.borderRadius}"/>
            </clipPath>
            <mask id="mask_out_ring_behind_fire">
                <rect width="${p.width}" height="${p.height}" fill="white"/>
                <ellipse id="mask-ellipse" cx="${p.width / 2}" cy="32" rx="13" ry="18" fill="black"/>
            </mask>
        </defs>
        <g clip-path="url(#outer_rectangle)">
            <g style="isolation: isolate">
                <rect stroke="${p.showBorder ? p.borderColor : 'none'}" fill="${bgFill}" rx="${p.borderRadius}" x="0.5" y="0.5" width="${p.width - 1}" height="${p.height - 1}" stroke-width="${p.showBorder ? 1 : 0}"/>
            </g>
            <g style="isolation: isolate">
                <line x1="${p.width / 3}" y1="28" x2="${p.width / 3}" y2="170" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${p.borderColor}" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3" opacity="0.5"/>
                <line x1="${(p.width / 3) * 2}" y1="28" x2="${(p.width / 3) * 2}" y2="170" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${p.borderColor}" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3" opacity="0.5"/>
            </g>
            <g style="isolation: isolate">
                <!-- Total Contributions big number -->
                <g transform="translate(${p.width / 6}, 48)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.primaryColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="28px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.6s">
                        ${formatNumber(streak.total)}
                    </text>
                </g>

                <!-- Total Contributions label -->
                <g transform="translate(${p.width / 6}, 84)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.primaryColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.7s">
                        Total Contributions
                    </text>
                </g>

                <!-- Total Contributions range -->
                <g transform="translate(${p.width / 6}, 114)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.textColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="12px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.8s">
                        ${rangeText}
                    </text>
                </g>
            </g>
            <g style="isolation: isolate">
                <!-- Current Streak big number -->
                <g transform="translate(${p.width / 2}, 48)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.secondaryColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="28px" font-style="normal" style="animation: currstreak 0.6s linear forwards">
                        ${formatNumber(streak.current)}
                    </text>
                </g>

                <!-- Current Streak label -->
                <g transform="translate(${p.width / 2}, 108)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.secondaryColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="14px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.9s">
                        Current Streak
                    </text>
                </g>

                <!-- Current Streak range -->
                <g transform="translate(${p.width / 2}, 145)">
                    <text x="0" y="21" stroke-width="0" text-anchor="middle" fill="${p.textColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="12px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.9s">
                        ${currentMonthDay}
                    </text>
                </g>

                <!-- Ring around number -->
                <g mask="url(#mask_out_ring_behind_fire)">
                    <circle cx="${p.width / 2}" cy="71" r="40" fill="none" stroke="${p.primaryColor}" stroke-width="5" style="opacity: 0; animation: fadein 0.5s linear forwards 0.4s"/>
                </g>
                <!-- Fire icon -->
                <g transform="translate(${p.width / 2}, 19.5)" stroke-opacity="0" style="opacity: 0; animation: fadein 0.5s linear forwards 0.6s">
                    <path d="M -12 -0.5 L 15 -0.5 L 15 23.5 L -12 23.5 L -12 -0.5 Z" fill="none"/>
                    <path d="M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z" fill="${p.primaryColor}" stroke-opacity="0"/>
                </g>

            </g>
            <g style="isolation: isolate">
                <!-- Longest Streak big number -->
                <g transform="translate(${(p.width / 6) * 5}, 48)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.primaryColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="28px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 1.2s">
                        ${formatNumber(streak.longest)}
                    </text>
                </g>

                <!-- Longest Streak label -->
                <g transform="translate(${(p.width / 6) * 5}, 84)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.primaryColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 1.3s">
                        Longest Streak
                    </text>
                </g>

                <!-- Longest Streak range -->
                <g transform="translate(${(p.width / 6) * 5}, 114)">
                    <text x="0" y="32" stroke-width="0" text-anchor="middle" fill="${p.textColor}" stroke="none" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="12px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 1.4s">
                         <!-- Range not fully calculated yet, placeholder -->
                         May 7 - Jul 13
                    </text>
                </g>
            </g>
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
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .quote { font: italic 400 16px 'Inter', sans-serif; fill: ${p.textColor}; }
    .author { font: 400 13px 'Inter', sans-serif; fill: ${p.secondaryColor}; }
    ${animStyles}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>
  <text x="25" y="35" fill="${p.secondaryColor}" font-size="24">"</text>
  <text x="45" y="50" class="quote">${escapeXml(quote.text)}</text>
  <text x="${p.width - 25}" y="${p.height - 25}" class="author" text-anchor="end">- ${escapeXml(quote.author)}</text>
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

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .title { font: 600 14px 'Inter', sans-serif; fill: ${p.textColor}; }
    .day-label { font: 400 9px 'Inter', sans-serif; fill: ${p.textColor}; opacity: 0.7; }
    ${animStyles}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>
  <text x="25" y="20" class="title">📊 Weekly Activity</text>
  ${bars}
</svg>`;
}

function generateCustomSVG(p: any): string {
  const { animation = 'fadeIn', speed = 'normal' } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .custom-text { font: 600 16px 'Inter', sans-serif; fill: ${p.textColor}; }
    ${animStyles}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="custom-text">${escapeXml(p.customText || 'Custom Card')}</text>
</svg>`;
}

function generateBannerSVG(p: any): string {
  const { bannerName, bannerDescription, animation = 'fadeIn', speed = 'normal' } = p;
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);

  const waveGradientId = 'waveGradient';
  let waveGradientDef = '';

  if (p.gradient) {
     waveGradientDef = `
      <linearGradient id="${waveGradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${p.gradientStart}"/>
        <stop offset="100%" stop-color="${p.gradientEnd}"/>
      </linearGradient>`;
  } else {
     waveGradientDef = `
      <linearGradient id="${waveGradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${p.primaryColor}"/>
        <stop offset="100%" stop-color="${p.secondaryColor}"/>
      </linearGradient>`;
  }

  const m = getSpeedMultiplier(speed);
  const dur = 20 * m;

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <defs>
    ${waveGradientDef}
  </defs>
  <style>
    .banner-text { font-size: 50px; font-weight: 700; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; fill: ${p.primaryColor}; }
    .banner-desc { font-size: 20px; font-weight: 500; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; fill: ${p.secondaryColor}; }
    .banner-text, .banner-desc { animation: fadeIn ${1.2 * m}s ease-in-out forwards; opacity: 0; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  </style>

  <rect x="0" y="0" width="${p.width}" height="${p.height}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>

  <g transform="translate(0, ${p.height - 200}) scale(${p.width / 854}, 1)">
    <g transform="translate(427, 100) scale(1, 1) translate(-427, -100)">
        <path d="" fill="url(#${waveGradientId})" opacity="0.4">
          <animate attributeName="d" dur="${dur}s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="0s" values="M0 0L 0 120Q 213.5 160 427 130T 854 155L 854 0 Z;M0 0L 0 145Q 213.5 160 427 140T 854 130L 854 0 Z;M0 0L 0 165Q 213.5 135 427 165T 854 130L 854 0 Z;M0 0L 0 120Q 213.5 160 427 130T 854 155L 854 0 Z">
          </animate>
        </path>
        <path d="" fill="url(#${waveGradientId})" opacity="0.4">
          <animate attributeName="d" dur="${dur}s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="${-10 * m}s" values="M0 0L 0 135Q 213.5 180 427 150T 854 160L 854 0 Z;M0 0L 0 150Q 213.5 120 427 120T 854 140L 854 0 Z;M0 0L 0 145Q 213.5 125 427 150T 854 165L 854 0 Z;M0 0L 0 135Q 213.5 180 427 150T 854 160L 854 0 Z">
          </animate>
        </path>
      </g>
  </g>

  <text text-anchor="middle" alignment-baseline="middle" x="50%" y="40%" class="banner-text">${escapeXml(bannerName)}</text>
  <text text-anchor="middle" alignment-baseline="middle" x="50%" y="60%" class="banner-desc">${escapeXml(bannerDescription)}</text>
</svg>`;
}

function generateContributionSVG(p: any): string {
  const { animation = 'fadeIn', speed = 'normal', contributionDays } = p;
  const animStyles = getAnimationStyles(animation, p.primaryColor, speed);
  const gradientDefs = getGradientDefs(p);
  const bgFill = getBgFill(p);

  // Use real data if available, otherwise fallback
  const days = contributionDays || [];

  const cols = 53;
  const rows = 7;
  const cellS = 10;
  const gap = 3;

  // Prepare data: last 365 days approximately
  // If we have less data, pad it.
  const displayDays = days.slice(- (cols * rows));

  const getLevelColor = (count: number) => {
    if (count === 0) return `${p.textColor}10`;
    if (count <= 1) return `${p.primaryColor}4D`; // 30%
    if (count <= 3) return `${p.primaryColor}80`; // 50%
    if (count <= 6) return `${p.primaryColor}B3`; // 70%
    return p.primaryColor;
  };

  let cells = '';
  // Render grid column by column
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = c * rows + r;
      // We need to map linear index to the day in the past?
      // Actually standard GitHub graph goes Column 0 (Week 1), Row 0 (Sun)...
      // If we have a flat array of days sorted by date...
      // The array usually starts from ~1 year ago.
      // We should map days to grid.
      const dayData = displayDays[idx] || { contributionCount: 0 };

      const x = c * (cellS + gap);
      const y = r * (cellS + gap) + 20; // +20 for month labels

      cells += `<rect x="${x}" y="${y}" width="${cellS}" height="${cellS}" rx="2" fill="${getLevelColor(dayData.contributionCount)}" />`;
    }
  }

  // Month Labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let currentMonth = -1;
  let monthsSVG = '';

  for (let c = 0; c < cols; c++) {
      const idx = c * rows; // Start of week
      const dayData = displayDays[idx];
      if (dayData) {
          const date = new Date(dayData.date);
          const month = date.getMonth();
          if (month !== currentMonth) {
              const x = c * (cellS + gap);
              monthsSVG += `<text x="${x}" y="10" font-size="10" fill="${p.textColor}">${monthLabels[month]}</text>`;
              currentMonth = month;
          }
      }
  }

  // Calculate required width/height for graph
  const graphW = cols * (cellS + gap) - gap;
  const graphH = rows * (cellS + gap) - gap + 20;

  // Center the graph
  const paddingX = (p.width - graphW) / 2;
  const paddingY = (p.height - graphH) / 2;

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .title { font: 600 14px 'Inter', sans-serif; fill: ${p.textColor}; }
    ${animStyles}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${bgFill}" ${p.showBorder ? `stroke="${p.borderColor}" stroke-width="2"` : ''}/>

  <g transform="translate(${Math.max(10, paddingX)}, ${Math.max(20, paddingY)})" class="animate">
    ${monthsSVG}
    ${cells}
  </g>
</svg>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type = 'stats', username = '', theme = 'neon', format = 'svg' } = req.query;
  const themeColors = themes[theme as string] || themes.neon;

  const params = {
    type,
    username: username as string,
    theme,
    bgColor: (req.query.bg as string) || themeColors.bg,
    primaryColor: (req.query.primary as string) || themeColors.primary,
    secondaryColor: (req.query.secondary as string) || themeColors.secondary,
    textColor: (req.query.text as string) || themeColors.text,
    borderColor: (req.query.border as string) || themeColors.border,
    borderRadius: parseInt(req.query.radius as string) || 12,
    showBorder: req.query.showBorder !== 'false',
    width: parseInt(req.query.width as string) || 495,
    height: parseInt(req.query.height as string) || 195,
    customText: req.query.customText as string,
    animation: (req.query.animation as string) || 'fadeIn',
    speed: (req.query.speed as string) || 'normal',
    gradient: req.query.gradient === 'true',
    gradientType: (req.query.gradientType as string) || 'linear',
    gradientAngle: parseInt(req.query.gradientAngle as string) || 135,
    gradientStart: decodeURIComponent((req.query.gradientStart as string) || '#667eea'),
    gradientEnd: decodeURIComponent((req.query.gradientEnd as string) || '#764ba2'),
    bannerName: (req.query.bannerName as string) || 'Your Name',
    bannerDescription: (req.query.bannerDescription as string) || 'Developer | Creator | Builder',
    waveStyle: (req.query.waveStyle as string) || 'wave',
    stats: null as any,
    languages: [] as any[],
    streak: null as any,
    contributionDays: [] as any[],
    activity: [] as number[],
  };

  // Fetch GitHub data if needed
  if (username && ['stats', 'languages', 'streak', 'activity', 'contribution'].includes(type as string)) {
    const data = await fetchGitHubStats(username as string);
    if (data) {
      params.stats = data.stats;
      params.languages = data.languages;
      params.streak = data.streak;
      params.contributionDays = data.contributionDays;
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
    case 'banner': svg = generateBannerSVG(params); break;
    case 'contribution': svg = generateContributionSVG(params); break;
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

  // Add XML declaration and trim
  if (!svg.trim().startsWith('<?xml')) {
    svg = `<?xml version="1.0" encoding="UTF-8"?>\n${svg.trim()}`;
  }

  return res.status(200).send(svg);
}
