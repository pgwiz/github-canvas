import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CardParams {
  type: string;
  username?: string;
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
  animate?: boolean;
  animation?: string;
  speed?: string;
  gradient?: boolean;
  gradientType?: string;
  gradientAngle?: number;
  gradientStart?: string;
  gradientEnd?: string;
  // Banner card fields
  bannerName?: string;
  bannerDescription?: string;
  waveStyle?: string;
  stats?: {
    totalStars: number;
    publicRepos: number;
    followers: number;
    totalForks: number;
  };
  languages?: Array<{ name: string; percentage: number; color: string }>;
  streak?: {
    current: number;
    longest: number;
    total: number;
    startDate?: string;
    longestStreakStart?: string;
    longestStreakEnd?: string;
  };
  activity?: number[];
  quote?: { quote: string; author: string };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let params: CardParams;

    let format = 'svg';

    if (req.method === 'GET') {
      const url = new URL(req.url);
      format = url.searchParams.get('format') || 'svg';
      params = {
        type: url.searchParams.get('type') || 'stats',
        username: url.searchParams.get('username') || '',
        theme: url.searchParams.get('theme') || 'neon',
        bgColor: decodeURIComponent(url.searchParams.get('bg') || '#0d1117'),
        primaryColor: decodeURIComponent(url.searchParams.get('primary') || '#0CF709'),
        secondaryColor: decodeURIComponent(url.searchParams.get('secondary') || '#00e1ff'),
        textColor: decodeURIComponent(url.searchParams.get('text') || '#c9d1d9'),
        borderColor: decodeURIComponent(url.searchParams.get('border') || '#0CF709'),
        borderRadius: parseInt(url.searchParams.get('radius') || '12'),
        showBorder: url.searchParams.get('showBorder') !== 'false',
        paddingTop: parseInt(url.searchParams.get('paddingTop') || '25'),
        paddingRight: parseInt(url.searchParams.get('paddingRight') || '25'),
        paddingBottom: parseInt(url.searchParams.get('paddingBottom') || '25'),
        paddingLeft: parseInt(url.searchParams.get('paddingLeft') || '25'),
        width: url.searchParams.get('width') ? parseInt(url.searchParams.get('width')!) : undefined,
        height: url.searchParams.get('height') ? parseInt(url.searchParams.get('height')!) : undefined,
        customText: url.searchParams.get('customText') || '',
        animate: url.searchParams.get('animate') !== 'false',
        animation: url.searchParams.get('animation') || 'fadeIn',
        speed: url.searchParams.get('speed') || 'normal',
        gradient: url.searchParams.get('gradient') === 'true',
        gradientType: url.searchParams.get('gradientType') || 'linear',
        gradientAngle: parseInt(url.searchParams.get('gradientAngle') || '135'),
        gradientStart: decodeURIComponent(url.searchParams.get('gradientStart') || '#667eea'),
        gradientEnd: decodeURIComponent(url.searchParams.get('gradientEnd') || '#764ba2'),
        bannerName: decodeURIComponent(url.searchParams.get('bannerName') || ''),
        bannerDescription: decodeURIComponent(url.searchParams.get('bannerDescription') || ''),
        waveStyle: url.searchParams.get('waveStyle') || 'wave',
      };

      if (params.username && params.type !== 'quote' && params.type !== 'custom') {
        try {
          const statsResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/github-stats`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: params.username }),
            }
          );

          if (statsResponse.ok) {
            const data = await statsResponse.json();
            params.stats = data.stats;
            params.languages = data.languages;
            params.streak = data.streak;
            params.activity = data.activity;
          }
        } catch (e) {
          console.log('Could not fetch GitHub stats for SVG:', e);
        }
      }

      if (params.type === 'quote') {
        try {
          const quoteResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-quote`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
            }
          );

          if (quoteResponse.ok) {
            params.quote = await quoteResponse.json();
          }
        } catch (e) {
          console.log('Could not fetch quote:', e);
          params.quote = { quote: "Code is poetry.", author: "Anonymous" };
        }
      }
    } else {
      params = await req.json();
    }

    console.log('Generating card:', params.type, params.username, 'format:', format);

    const svg = generateSVG(params);

    // Return based on format
    if (format === 'base64') {
      // Return base64 data URL for img src usage
      const encoder = new TextEncoder();
      const data = encoder.encode(svg);
      const base64 = btoa(String.fromCharCode(...data));
      const dataUrl = `data:image/svg+xml;base64,${base64}`;
      return new Response(dataUrl, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating card:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSVG(params: CardParams): string {
  const {
    type,
    username = 'developer',
    bgColor = '#0d1117',
    primaryColor = '#0CF709',
    secondaryColor = '#00e1ff',
    textColor = '#c9d1d9',
    borderColor = '#0CF709',
    borderRadius = 12,
    showBorder = true,
    paddingTop = 25,
    paddingRight = 25,
    paddingBottom = 25,
    paddingLeft = 25,
    customText = '',
    animate = true,
    animation = 'fadeIn',
    speed = 'normal',
    gradient = false,
    gradientType = 'linear',
    gradientAngle = 135,
    gradientStart = '#667eea',
    gradientEnd = '#764ba2',
    bannerName = '',
    bannerDescription = '',
    waveStyle = 'wave',
    stats,
    languages,
    streak,
    activity,
    quote,
  } = params;

  // Type-specific default dimensions
  const defaultDimensions: Record<string, { width: number; height: number }> = {
    languages: { width: 300, height: 300 },
    contribution: { width: 620, height: 300 },
  };
  const defaults = defaultDimensions[type] || { width: 495, height: 195 };
  const width = params.width || defaults.width;
  const height = params.height || defaults.height;

  const borderStyle = showBorder
    ? `stroke="${borderColor}" stroke-width="2"`
    : '';

  // Gradient helper functions
  const getGradientDefs = (): string => {
    if (!gradient) return '';

    const id = 'bgGradient';
    if (gradientType === 'radial') {
      return `
        <defs>
          <radialGradient id="${id}" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="${gradientStart}"/>
            <stop offset="100%" stop-color="${gradientEnd}"/>
          </radialGradient>
        </defs>`;
    }

    const angleRad = (gradientAngle - 90) * Math.PI / 180;
    const x1 = 50 - Math.cos(angleRad) * 50;
    const y1 = 50 - Math.sin(angleRad) * 50;
    const x2 = 50 + Math.cos(angleRad) * 50;
    const y2 = 50 + Math.sin(angleRad) * 50;

    return `
      <defs>
        <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          <stop offset="0%" stop-color="${gradientStart}"/>
          <stop offset="100%" stop-color="${gradientEnd}"/>
        </linearGradient>
      </defs>`;
  };

  const getBgFill = (): string => gradient ? 'url(#bgGradient)' : bgColor;

  // Speed multiplier
  const getSpeedMultiplier = (s: string): number => {
    const multipliers: Record<string, number> = { slow: 2, normal: 1, fast: 0.5 };
    return multipliers[s] || 1;
  };

  const m = getSpeedMultiplier(speed);

  // Animation styles based on animation type
  const getAnimationStyles = (animType: string) => {
    const animations: Record<string, string> = {
      fadeIn: `
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .anim { animation: fadeIn ${0.8 * m}s ease-out forwards; opacity: 0; }
        .d1 { animation-delay: ${0.1 * m}s; } .d2 { animation-delay: ${0.2 * m}s; } .d3 { animation-delay: ${0.3 * m}s; } .d4 { animation-delay: ${0.4 * m}s; } .d5 { animation-delay: ${0.5 * m}s; }
      `,
      wave: `
        @keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .anim { animation: wave ${1.5 * m}s ease-in-out infinite; }
        .d1 { animation-delay: ${0.1 * m}s; } .d2 { animation-delay: ${0.2 * m}s; } .d3 { animation-delay: ${0.3 * m}s; } .d4 { animation-delay: ${0.4 * m}s; } .d5 { animation-delay: ${0.5 * m}s; }
      `,
      scaleIn: `
        @keyframes scaleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .anim { animation: scaleIn ${0.5 * m}s ease-out forwards; transform-origin: center; opacity: 0; }
        .d1 { animation-delay: ${0.15 * m}s; } .d2 { animation-delay: ${0.3 * m}s; } .d3 { animation-delay: ${0.45 * m}s; } .d4 { animation-delay: ${0.6 * m}s; } .d5 { animation-delay: ${0.75 * m}s; }
      `,
      glow: `
        @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 3px ${primaryColor}40); } 50% { filter: drop-shadow(0 0 12px ${primaryColor}80); } }
        .anim { animation: glow ${2 * m}s ease-in-out infinite; }
      `,
      blink: `
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .anim { animation: blink ${1.5 * m}s ease-in-out infinite; }
      `,
      typing: `
        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .anim { overflow: hidden; white-space: nowrap; animation: typing ${2 * m}s steps(30) forwards; width: 0; }
        .cursor { animation: cursor ${0.8 * m}s infinite; }
        .d1 { animation-delay: ${0.3 * m}s; } .d2 { animation-delay: ${0.6 * m}s; } .d3 { animation-delay: ${0.9 * m}s; } .d4 { animation-delay: ${1.2 * m}s; } .d5 { animation-delay: ${1.5 * m}s; }
      `,
      slideInLeft: `
        @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
        .anim { animation: slideInLeft ${0.6 * m}s ease-out forwards; opacity: 0; }
        .d1 { animation-delay: ${0.1 * m}s; } .d2 { animation-delay: ${0.2 * m}s; } .d3 { animation-delay: ${0.3 * m}s; } .d4 { animation-delay: ${0.4 * m}s; } .d5 { animation-delay: ${0.5 * m}s; }
      `,
      slideInRight: `
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(30px); } 100% { opacity: 1; transform: translateX(0); } }
        .anim { animation: slideInRight ${0.6 * m}s ease-out forwards; opacity: 0; }
        .d1 { animation-delay: ${0.1 * m}s; } .d2 { animation-delay: ${0.2 * m}s; } .d3 { animation-delay: ${0.3 * m}s; } .d4 { animation-delay: ${0.4 * m}s; } .d5 { animation-delay: ${0.5 * m}s; }
      `,
      slideInUp: `
        @keyframes slideInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        .anim { animation: slideInUp ${0.6 * m}s ease-out forwards; opacity: 0; }
        .d1 { animation-delay: ${0.1 * m}s; } .d2 { animation-delay: ${0.2 * m}s; } .d3 { animation-delay: ${0.3 * m}s; } .d4 { animation-delay: ${0.4 * m}s; } .d5 { animation-delay: ${0.5 * m}s; }
      `,
      bounce: `
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-8px); } 50% { transform: translateY(0); } 75% { transform: translateY(-4px); } }
        .anim { animation: bounce ${1 * m}s ease-in-out infinite; }
        .d1 { animation-delay: ${0.1 * m}s; } .d2 { animation-delay: ${0.2 * m}s; } .d3 { animation-delay: ${0.3 * m}s; } .d4 { animation-delay: ${0.4 * m}s; } .d5 { animation-delay: ${0.5 * m}s; }
      `,
    };
    return animations[animType] || animations.fadeIn;
  };

  const animStyles = animate ? getAnimationStyles(animation) : '';

  const commonStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      .title { font: 600 18px 'Inter', sans-serif; fill: ${primaryColor}; }
      .stat-value { font: 700 24px 'Inter', sans-serif; }
      .stat-label { font: 400 11px 'Inter', sans-serif; fill: ${textColor}; opacity: 0.7; }
      .text { font: 400 14px 'Inter', sans-serif; fill: ${textColor}; }
      .small { font: 400 10px 'Inter', sans-serif; fill: ${textColor}; opacity: 0.5; }
      .quote { font: italic 400 16px 'Inter', sans-serif; fill: ${textColor}; }
      .author { font: 400 13px 'Inter', sans-serif; fill: ${secondaryColor}; }
      ${animStyles}
    </style>
  `;

  const gradientDefs = getGradientDefs();
  const bgFill = getBgFill();

  switch (type) {
    case 'stats':
      return generateStatsSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, username, animate,
        stats: stats || { totalStars: 0, publicRepos: 0, followers: 0, totalForks: 0 },
        commonStyles, gradientDefs,
      });

    case 'languages':
      return generateLanguagesSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, secondaryColor, textColor, animate,
        languages: languages || [],
        commonStyles, gradientDefs,
      });

    case 'streak':
      return generateStreakSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, secondaryColor, textColor, animate,
        streak: streak || { current: 0, longest: 0, total: 0 },
        commonStyles, gradientDefs,
      });

    case 'contribution':
      return generateContributionSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, animate,
        contributionDays: streak?.days || [],
        streak: streak || { current: 0, total: 0 },
        username,
        commonStyles, gradientDefs,
      });

    case 'activity':
      return generateActivitySVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, secondaryColor, textColor, animate,
        activity: activity || Array(30).fill(0),
        commonStyles, gradientDefs,
      });

    case 'quote':
      return generateQuoteSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, secondaryColor, textColor, animate,
        quote: quote || { quote: "Code is poetry.", author: "Anonymous" },
        commonStyles, gradientDefs,
      });

    case 'custom':
      return generateCustomSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, textColor, customText, animate,
        commonStyles, gradientDefs,
      });

    case 'banner':
      return generateBannerSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, secondaryColor, textColor, animate, speed,
        bannerName: bannerName || 'Your Name',
        bannerDescription: bannerDescription || 'Developer | Creator | Builder',
        waveStyle,
        gradientStart, gradientEnd,
        commonStyles, gradientDefs,
      });

    default:
      return generateStatsSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        primaryColor, secondaryColor, textColor, username, animate,
        stats: stats || { totalStars: 0, publicRepos: 0, followers: 0, totalForks: 0 },
        commonStyles, gradientDefs,
      });
  }
}

function generateStatsSVG(p: any): string {
  const { stats } = p;

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.gradientDefs || ''}
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <g transform="translate(25, 25)">
    <text class="title">${p.username}'s GitHub Stats</text>
    
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
  const { languages, animate } = p;
  const langs = languages.slice(0, 6);

  // Card dimensions (language card uses taller resolution)
  const cardWidth = p.width || 300;
  const cardHeight = p.height || 300;
  const rowHeight = 28;
  const rowGap = 6;
  const maxBarWidth = 145;

  // Get max percentage for scaling
  const maxPercentage = Math.max(...langs.map((l: any) => l.percentage), 35);

  // Language-specific gradient colors
  const langGradients: Record<string, { start: string; end: string; pct: string }> = {
    'JavaScript': { start: '#FDE047', end: '#F59E0B', pct: '#F59E0B' },
    'TypeScript': { start: '#22D3EE', end: '#0284C7', pct: '#0284C7' },
    'Python': { start: '#38BDF8', end: '#2563EB', pct: '#2563EB' },
    'Go': { start: '#67E8F9', end: '#0EA5E9', pct: '#0EA5E9' },
    'C++': { start: '#C084FC', end: '#6D28D9', pct: '#7C3AED' },
    'C': { start: '#A3A3A3', end: '#525252', pct: '#525252' },
    'Ruby': { start: '#FB7185', end: '#E11D48', pct: '#E11D48' },
    'Rust': { start: '#FB923C', end: '#EA580C', pct: '#EA580C' },
    'Java': { start: '#F87171', end: '#DC2626', pct: '#DC2626' },
    'PHP': { start: '#A78BFA', end: '#7C3AED', pct: '#7C3AED' },
    'HTML': { start: '#FB923C', end: '#EA580C', pct: '#EA580C' },
    'CSS': { start: '#60A5FA', end: '#2563EB', pct: '#2563EB' },
    'Shell': { start: '#4ADE80', end: '#16A34A', pct: '#16A34A' },
    'Swift': { start: '#FB923C', end: '#F97316', pct: '#F97316' },
    'Kotlin': { start: '#A78BFA', end: '#7C3AED', pct: '#7C3AED' },
    'Dart': { start: '#22D3EE', end: '#0891B2', pct: '#0891B2' },
    'Vue': { start: '#4ADE80', end: '#059669', pct: '#059669' },
    'default': { start: '#94A3B8', end: '#475569', pct: '#475569' },
  };

  // Get short name for badge
  const getBadge = (name: string): string => {
    const badges: Record<string, string> = {
      'JavaScript': 'JS', 'TypeScript': 'TS', 'Python': 'Py', 'C++': 'C+',
      'C#': 'C#', 'Go': 'Go', 'Ruby': '💎', 'Rust': 'Rs', 'Java': 'Jv',
      'PHP': 'PH', 'HTML': 'HT', 'CSS': 'CS', 'Shell': 'SH', 'Swift': 'Sw',
      'Kotlin': 'Kt', 'Dart': 'Dt', 'Vue': 'Vu', 'C': 'C',
    };
    return badges[name] || name.substring(0, 2).toUpperCase();
  };

  // Generate gradient definitions
  let gradientDefs = '';
  langs.forEach((lang: any, i: number) => {
    const grad = langGradients[lang.name] || langGradients['default'];
    gradientDefs += `
    <linearGradient id="gLang${i}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${grad.start}"/>
      <stop offset="1" stop-color="${grad.end}"/>
    </linearGradient>`;
  });

  // Generate rows
  let rows = '';
  langs.forEach((lang: any, i: number) => {
    const y = 62 + i * (rowHeight + rowGap);
    const barWidth = Math.max((lang.percentage / maxPercentage) * maxBarWidth, 20);
    const grad = langGradients[lang.name] || langGradients['default'];
    const badge = getBadge(lang.name);
    const delayClass = animate ? `class="delay-${i + 1}"` : '';

    rows += `
    <!-- Row ${i + 1}: ${lang.name} -->
    <g ${delayClass}>
      <g filter="url(#rowShadow)">
        <rect x="24" y="${y}" width="232" height="${rowHeight}" rx="14" fill="url(#rowBg)"/>
        <rect x="24" y="${y}" width="232" height="${rowHeight}" rx="14" fill="none" stroke="#DDE6FF" stroke-opacity="0.8"/>
        <path d="M28 ${y + 4} H252" stroke="#FFFFFF" stroke-width="2" opacity="0.65" stroke-linecap="round"/>
      </g>
      
      <!-- Subtle glow -->
      <circle cx="40" cy="${y + 14}" r="14" fill="${grad.start}" opacity="0.2" filter="url(#bokeh)"/>
      
      <!-- Badge -->
      <rect x="32" y="${y + 5}" width="18" height="18" rx="6" fill="${grad.start}" opacity="0.95"/>
      <text x="41" y="${y + 18}" text-anchor="middle" class="mini" fill="#111827">${badge}</text>
      
      <!-- Label & Percentage -->
      <text x="58" y="${y + 18}" class="label">${lang.name}</text>
      <text x="244" y="${y + 18}" text-anchor="end" class="pct" fill="${grad.pct}">${Math.round(lang.percentage)}%</text>
      
      <!-- Progress Bar -->
      <rect x="58" y="${y + 20}" width="${barWidth}" height="6" rx="3" fill="url(#gLang${i})" filter="url(#barGlow)"/>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <!-- Card background gradient -->
    <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#EAF5FF"/>
      <stop offset="0.55" stop-color="#F2F0FF"/>
      <stop offset="1" stop-color="#FFF1F7"/>
    </linearGradient>

    <!-- Row background -->
    <linearGradient id="rowBg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#F6F8FF"/>
    </linearGradient>

    ${gradientDefs}

    <!-- Shadows -->
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#2B3A67" flood-opacity="0.18"/>
    </filter>
    <filter id="rowShadow" x="-20%" y="-50%" width="140%" height="200%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#2B3A67" flood-opacity="0.12"/>
    </filter>
    <filter id="barGlow" x="-30%" y="-200%" width="160%" height="500%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="bokeh" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>

    <style>
      .title { font: 700 18px/1.2 Inter, system-ui, sans-serif; fill: #1F3B7A; }
      .label { font: 700 13px/1.2 Inter, system-ui, sans-serif; fill: #2B3A67; }
      .pct   { font: 800 13px/1.2 Inter, system-ui, sans-serif; }
      .mini  { font: 800 9px/1.0 Inter, system-ui, sans-serif; }
      ${animate ? `
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
      .card { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
      .delay-1 { animation: fadeIn 0.4s ease-out 0.1s forwards; opacity: 0; }
      .delay-2 { animation: fadeIn 0.4s ease-out 0.15s forwards; opacity: 0; }
      .delay-3 { animation: fadeIn 0.4s ease-out 0.2s forwards; opacity: 0; }
      .delay-4 { animation: fadeIn 0.4s ease-out 0.25s forwards; opacity: 0; }
      .delay-5 { animation: fadeIn 0.4s ease-out 0.3s forwards; opacity: 0; }
      .delay-6 { animation: fadeIn 0.4s ease-out 0.35s forwards; opacity: 0; }
      ` : ''}
    </style>
  </defs>

  <!-- Card -->
  <g filter="url(#cardShadow)" ${animate ? 'class="card"' : ''}>
    <rect x="10" y="10" width="${cardWidth - 20}" height="${cardHeight - 20}" rx="22" fill="url(#cardBg)"/>

    <!-- Soft bokeh dots -->
    <g filter="url(#bokeh)" opacity="0.55">
      <circle cx="${cardWidth - 55}" cy="34" r="12" fill="#FDE68A"/>
      <circle cx="${cardWidth - 34}" cy="44" r="10" fill="#C7D2FE"/>
      <circle cx="${cardWidth - 45}" cy="56" r="9" fill="#FDA4AF"/>
    </g>

    <!-- Header icon + title -->
    <g transform="translate(26 28)">
      <path d="M10 3 L4 9 L10 15" fill="none" stroke="#7C3AED" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 3 L28 9 L22 15" fill="none" stroke="#38BDF8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 2 L13 9 L17 9 L14 16" fill="none" stroke="#F59E0B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="58" y="42" class="title">Top Languages</text>

    <!-- Language Rows -->
    ${rows}
  </g>
</svg>`;
}

function generateStreakSVG(p: any): string {
  const { streak, animate } = p;

  // Format dates
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const today = new Date();
  const todayStr = `${today.toLocaleString('default', { month: 'short' })} ${today.getDate()}`;

  // Date ranges
  const totalRange = `${formatDate(streak.startDate)} - ${formatDate(streak.endDate) || 'Present'}`;
  const longestRange = `${formatDate(streak.longestStreakStart)} - ${formatDate(streak.longestStreakEnd)}`;

  const ringAnim = animate ? `
    <style>
      .ring-bg { opacity: 0.2; }
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
  ` : '';

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  ${ringAnim}
  <defs>
      <mask id="mask_out_ring_behind_fire">
          <rect width="${p.width}" height="${p.height}" fill="white"/>
          <ellipse id="mask-ellipse" cx="${p.width / 2}" cy="32" rx="13" ry="18" fill="black"/>
      </mask>
  </defs>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <g style="isolation: isolate">
      <line x1="${p.width / 3}" y1="28" x2="${p.width / 3}" y2="170" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${p.borderColor}" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3" opacity="0.5"/>
      <line x1="${(p.width / 3) * 2}" y1="28" x2="${(p.width / 3) * 2}" y2="170" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${p.borderColor}" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3" opacity="0.5"/>
  </g>

  <!-- Left Section: Total Contributions -->
  <g transform="translate(${p.width / 6}, 48)">
    <text text-anchor="middle" class="stat-value" fill="${p.primaryColor}" y="32">${formatNumber(streak.total)}</text>
    <text text-anchor="middle" class="stat-label" y="64">Total Contributions</text>
    <text text-anchor="middle" class="small" y="94">${totalRange}</text>
  </g>
  
  <!-- Center Section: Current Streak -->
  <g transform="translate(${p.width / 2}, 48)">
    <text text-anchor="middle" class="stat-value" fill="${p.secondaryColor}" y="32" style="animation: currstreak 0.6s linear forwards">${formatNumber(streak.current)}</text>
    <text text-anchor="middle" class="stat-label" y="90">Current Streak</text>
    <text text-anchor="middle" class="small" y="125">${todayStr}</text>

    <!-- Ring -->
    <g mask="url(#mask_out_ring_behind_fire)">
        <circle cx="0" cy="23" r="40" fill="none" stroke="${p.primaryColor}" stroke-width="5" style="opacity: 0; animation: fadein 0.5s linear forwards 0.4s"/>
    </g>
    <!-- Fire -->
    <g transform="translate(0, -28)" stroke-opacity="0" style="opacity: 0; animation: fadein 0.5s linear forwards 0.6s">
        <path d="M -12 -0.5 L 15 -0.5 L 15 23.5 L -12 23.5 L -12 -0.5 Z" fill="none"/>
        <path d="M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z" fill="${p.primaryColor}" stroke-opacity="0"/>
    </g>
  </g>
  
  <!-- Right Section: Longest Streak -->
  <g transform="translate(${(p.width / 6) * 5}, 48)">
    <text text-anchor="middle" class="stat-value" fill="${p.primaryColor}" y="32">${formatNumber(streak.longest)}</text>
    <text text-anchor="middle" class="stat-label" y="64">Longest Streak</text>
    <text text-anchor="middle" class="small" y="94">${longestRange}</text>
  </g>
</svg>`;
}

function generateContributionSVG(p: any): string {
  const { contributionDays = [], animate, streak = {} } = p;

  // Card dimensions optimized for this layout
  const cardWidth = p.width || 620;
  const cardHeight = p.height || 300;

  // Grid settings
  const cols = 53;
  const rows = 7;
  const cellSize = 8;
  const gap = 3;
  const pitch = cellSize + gap;
  const gridWidth = cols * pitch - gap;
  const gridHeight = rows * pitch - gap;
  const gridX = (cardWidth - gridWidth) / 2;
  const gridY = 100;

  // Use real data if available, otherwise fallback to sample
  const displayDays = contributionDays.length > 0
    ? contributionDays.slice(-(cols * rows))
    : Array(cols * rows).fill(0).map(() => ({ contributionCount: Math.random() > 0.6 ? Math.floor(Math.random() * 6) : 0 }));

  // Count total contributions
  const totalContributions = displayDays.reduce((sum: number, d: any) => sum + (d.contributionCount || 0), 0);
  const currentStreak = streak.current || 0;
  const username = p.username || 'C';
  const initial = username.substring(0, 1).toUpperCase();

  // Color levels for contribution intensity
  const getLevelColor = (count: number) => {
    if (count === 0) return '#1e1e1e';
    if (count <= 1) return '#0e4429';
    if (count <= 3) return '#006d32';
    if (count <= 6) return '#26a641';
    return '#39d353';
  };

  // Generate grid cells
  let cells = '';
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = c * rows + r;
      const dayData = displayDays[idx] || { contributionCount: 0 };
      const x = gridX + c * pitch;
      const y = gridY + r * pitch;
      const delay = animate ? `style="animation-delay: ${(c * 0.015)}s"` : '';
      const animClass = animate ? 'class="cell-anim"' : '';
      cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${getLevelColor(dayData.contributionCount)}" ${animClass} ${delay}/>`;
    }
  }

  const animStyles = animate ? `
    @keyframes fadeCell {
      0% { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    }
    .cell-anim { animation: fadeCell 0.3s ease-out forwards; opacity: 0; }
  ` : '';

  return `
<svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .title { font: 600 20px 'Inter', sans-serif; fill: #ffffff; }
    .streak { font: 600 16px 'Inter', sans-serif; fill: #9ca3af; }
    .streak-value { font: 700 16px 'Inter', sans-serif; fill: #22c55e; }
    .total { font: 400 18px 'Inter', sans-serif; fill: #6b7280; }
    .total-value { font: 700 24px 'Inter', sans-serif; fill: #ffffff; }
    ${animStyles}
  </style>
  
  <!-- Card background -->
  <rect x="1" y="1" width="${cardWidth - 2}" height="${cardHeight - 2}" rx="${p.borderRadius || 16}" fill="${p.bgColor || '#0d1117'}" stroke="${p.primaryColor || '#22c55e'}" stroke-width="2"/>
  
  <!-- Header -->
  <g transform="translate(30, 30)">
    <!-- Avatar circle -->
    <circle cx="24" cy="24" r="24" fill="#6366f1"/>
    <text x="24" y="32" text-anchor="middle" font-size="22" font-weight="bold" fill="#ffffff">${initial}</text>
    
    <!-- Title -->
    <text x="60" y="32" class="title">My contributions</text>
    
    <!-- Streak badge on right -->
    <g transform="translate(${cardWidth - 190}, 0)">
      <text x="0" y="28" class="streak">Streak</text>
      <text x="55" y="28" class="streak-value">${currentStreak} days</text>
      <text x="${currentStreak >= 10 ? 130 : 115}" y="28" font-size="18">🔥</text>
    </g>
  </g>
  
  <!-- Contribution Grid -->
  <g>
    ${cells}
  </g>
  
  <!-- Footer: Total contributions -->
  <g transform="translate(${cardWidth - 200}, ${cardHeight - 40})">
    <text x="0" y="0" class="total-value">${formatNumber(totalContributions)}</text>
    <text x="${totalContributions >= 1000 ? 45 : 35}" y="0" class="total"> contributions</text>
  </g>
</svg>`;
}

function generateActivitySVG(p: any): string {
  const { activity, animate } = p;
  const barWidth = (p.width - 80) / 30;
  const maxActivity = Math.max(...activity, 1);

  let bars = '';
  for (let i = 0; i < activity.length; i++) {
    const height = (activity[i] / maxActivity) * 80;
    const color = activity[i] > maxActivity * 0.6
      ? p.primaryColor
      : activity[i] > maxActivity * 0.3
        ? p.secondaryColor
        : `${p.primaryColor}66`;

    const delay = animate ? `style="animation-delay: ${i * 0.03}s"` : '';
    const animClass = animate ? 'class="animate-fade"' : '';
    bars += `<rect x="${40 + i * barWidth}" y="${130 - height}" width="${barWidth - 2}" height="${height}" rx="2" fill="${color}" ${animClass} ${delay}/>`;
  }

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <text class="title" x="25" y="35">Activity Graph (Last 30 Days)</text>
  ${bars}
  <text class="small" x="40" y="${p.height - 15}">30 days ago</text>
  <text class="small" x="${p.width - 60}" y="${p.height - 15}">Today</text>
</svg>`;
}

function generateQuoteSVG(p: any): string {
  const { quote, animate } = p;
  const centerX = p.width / 2;

  // Word wrap the quote text - max ~38 chars per line for better display with margins
  const words = quote.quote.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).length > 38) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  // Limit to max 4 lines to prevent overflow
  if (lines.length > 4) {
    lines = lines.slice(0, 4);
    lines[3] = lines[3].substring(0, lines[3].length - 3) + '...';
  }

  // Calculate vertical positioning
  const headerHeight = 55; // Icon + title
  const authorHeight = 30; // Author at bottom
  const quoteMarkSize = 30; // Space for quote marks
  const lineHeight = 22;
  const totalTextHeight = lines.length * lineHeight;

  // Center the quote vertically in the available space
  const availableSpace = p.height - headerHeight - authorHeight - quoteMarkSize;
  const startY = headerHeight + (availableSpace - totalTextHeight) / 2 + 20;

  const quoteLines = lines.map((line, i) =>
    `<tspan x="${centerX}" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`
  ).join('');

  const animClass1 = animate ? 'class="anim d1"' : '';

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.gradientDefs || ''}
  ${p.commonStyles}
  <style>
    .quote-mark { font: 700 36px 'Inter', sans-serif; fill: ${p.secondaryColor}; opacity: 0.6; }
    .quote-text { font: italic 400 15px 'Inter', sans-serif; fill: ${p.textColor}; }
    .quote-author { font: 400 13px 'Inter', sans-serif; fill: ${p.secondaryColor}; }
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <!-- Header with icon -->
  <g transform="translate(${centerX}, 28)" ${animClass1}>
    <text text-anchor="middle" font-size="18" y="0">🤙</text>
    <text text-anchor="middle" class="title" y="22">Random Dev Quote</text>
  </g>
  
  <!-- Opening quote mark -->
  <text class="quote-mark${animate ? ' anim d2' : ''}" x="50" y="${startY}">"</text>
  
  <!-- Quote text - centered with padding -->
  <text class="quote-text${animate ? ' anim d2' : ''}" x="${centerX}" y="${startY + 10}" text-anchor="middle">${quoteLines}</text>
  
  <!-- Closing quote mark -->
  <text class="quote-mark${animate ? ' anim d2' : ''}" x="${p.width - 70}" y="${startY + totalTextHeight}">"</text>
  
  <!-- Author - fixed at bottom with proper spacing -->
  <text class="quote-author${animate ? ' anim d3' : ''}" x="${centerX}" y="${p.height - 18}" text-anchor="middle">— ${quote.author}</text>
</svg>`;
}

function generateCustomSVG(p: any): string {
  const centerX = p.width / 2;
  const centerY = p.height / 2;
  const scaleClass = p.animate ? 'class="animate-scale"' : '';

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <text class="title" x="${centerX}" y="${centerY}" text-anchor="middle" font-size="20" ${scaleClass}>${p.customText || 'Your custom text here'}</text>
</svg>`;
}

function generateBannerSVG(p: any): string {
  const { bannerName, bannerDescription, waveStyle, animate, speed, gradientStart, gradientEnd } = p;
  const centerX = p.width / 2;

  // Get speed multiplier for animations
  const getSpeedMultiplier = (s: string): number => {
    const multipliers: Record<string, number> = { slow: 2, normal: 1, fast: 0.5 };
    return multipliers[s] || 1;
  };
  const m = getSpeedMultiplier(speed);
  const waveDuration = 20 * m;

  // Generate wave paths based on style
  const getWavePaths = (style: string): string => {
    const h = p.height;
    const w = p.width;

    const waveStyles: Record<string, { path1: string; path2: string }> = {
      wave: {
        path1: `M0 0L 0 ${h * 0.6}Q ${w * 0.25} ${h * 0.8} ${w * 0.5} ${h * 0.65}T ${w} ${h * 0.78}L ${w} 0 Z;M0 0L 0 ${h * 0.73}Q ${w * 0.25} ${h * 0.8} ${w * 0.5} ${h * 0.7}T ${w} ${h * 0.65}L ${w} 0 Z;M0 0L 0 ${h * 0.83}Q ${w * 0.25} ${h * 0.68} ${w * 0.5} ${h * 0.83}T ${w} ${h * 0.65}L ${w} 0 Z;M0 0L 0 ${h * 0.6}Q ${w * 0.25} ${h * 0.8} ${w * 0.5} ${h * 0.65}T ${w} ${h * 0.78}L ${w} 0 Z`,
        path2: `M0 0L 0 ${h * 0.68}Q ${w * 0.25} ${h * 0.9} ${w * 0.5} ${h * 0.75}T ${w} ${h * 0.8}L ${w} 0 Z;M0 0L 0 ${h * 0.75}Q ${w * 0.25} ${h * 0.6} ${w * 0.5} ${h * 0.6}T ${w} ${h * 0.7}L ${w} 0 Z;M0 0L 0 ${h * 0.73}Q ${w * 0.25} ${h * 0.63} ${w * 0.5} ${h * 0.75}T ${w} ${h * 0.83}L ${w} 0 Z;M0 0L 0 ${h * 0.68}Q ${w * 0.25} ${h * 0.9} ${w * 0.5} ${h * 0.75}T ${w} ${h * 0.8}L ${w} 0 Z`,
      },
      pulse: {
        path1: `M0 0L 0 ${h * 0.5}Q ${w * 0.25} ${h * 0.7} ${w * 0.5} ${h * 0.5}T ${w} ${h * 0.6}L ${w} 0 Z;M0 0L 0 ${h * 0.7}Q ${w * 0.25} ${h * 0.5} ${w * 0.5} ${h * 0.7}T ${w} ${h * 0.5}L ${w} 0 Z;M0 0L 0 ${h * 0.5}Q ${w * 0.25} ${h * 0.7} ${w * 0.5} ${h * 0.5}T ${w} ${h * 0.6}L ${w} 0 Z`,
        path2: `M0 0L 0 ${h * 0.6}Q ${w * 0.25} ${h * 0.4} ${w * 0.5} ${h * 0.6}T ${w} ${h * 0.5}L ${w} 0 Z;M0 0L 0 ${h * 0.4}Q ${w * 0.25} ${h * 0.6} ${w * 0.5} ${h * 0.4}T ${w} ${h * 0.6}L ${w} 0 Z;M0 0L 0 ${h * 0.6}Q ${w * 0.25} ${h * 0.4} ${w * 0.5} ${h * 0.6}T ${w} ${h * 0.5}L ${w} 0 Z`,
      },
      flow: {
        path1: `M0 0L 0 ${h * 0.55}C ${w * 0.33} ${h * 0.75} ${w * 0.66} ${h * 0.45} ${w} ${h * 0.65}L ${w} 0 Z;M0 0L 0 ${h * 0.65}C ${w * 0.33} ${h * 0.45} ${w * 0.66} ${h * 0.75} ${w} ${h * 0.55}L ${w} 0 Z;M0 0L 0 ${h * 0.55}C ${w * 0.33} ${h * 0.75} ${w * 0.66} ${h * 0.45} ${w} ${h * 0.65}L ${w} 0 Z`,
        path2: `M0 0L 0 ${h * 0.45}C ${w * 0.33} ${h * 0.65} ${w * 0.66} ${h * 0.35} ${w} ${h * 0.55}L ${w} 0 Z;M0 0L 0 ${h * 0.55}C ${w * 0.33} ${h * 0.35} ${w * 0.66} ${h * 0.65} ${w} ${h * 0.45}L ${w} 0 Z;M0 0L 0 ${h * 0.45}C ${w * 0.33} ${h * 0.65} ${w * 0.66} ${h * 0.35} ${w} ${h * 0.55}L ${w} 0 Z`,
      },
      glitch: {
        path1: `M0 0L 0 ${h * 0.6}L ${w * 0.2} ${h * 0.55}L ${w * 0.4} ${h * 0.7}L ${w * 0.6} ${h * 0.5}L ${w * 0.8} ${h * 0.65}L ${w} ${h * 0.6}L ${w} 0 Z;M0 0L 0 ${h * 0.55}L ${w * 0.2} ${h * 0.7}L ${w * 0.4} ${h * 0.5}L ${w * 0.6} ${h * 0.65}L ${w * 0.8} ${h * 0.55}L ${w} ${h * 0.7}L ${w} 0 Z;M0 0L 0 ${h * 0.65}L ${w * 0.2} ${h * 0.5}L ${w * 0.4} ${h * 0.6}L ${w * 0.6} ${h * 0.55}L ${w * 0.8} ${h * 0.7}L ${w} ${h * 0.5}L ${w} 0 Z;M0 0L 0 ${h * 0.6}L ${w * 0.2} ${h * 0.55}L ${w * 0.4} ${h * 0.7}L ${w * 0.6} ${h * 0.5}L ${w * 0.8} ${h * 0.65}L ${w} ${h * 0.6}L ${w} 0 Z`,
        path2: `M0 0L 0 ${h * 0.5}L ${w * 0.3} ${h * 0.65}L ${w * 0.5} ${h * 0.45}L ${w * 0.7} ${h * 0.6}L ${w} ${h * 0.5}L ${w} 0 Z;M0 0L 0 ${h * 0.65}L ${w * 0.3} ${h * 0.45}L ${w * 0.5} ${h * 0.6}L ${w * 0.7} ${h * 0.5}L ${w} ${h * 0.65}L ${w} 0 Z;M0 0L 0 ${h * 0.45}L ${w * 0.3} ${h * 0.6}L ${w * 0.5} ${h * 0.5}L ${w * 0.7} ${h * 0.65}L ${w} ${h * 0.45}L ${w} 0 Z;M0 0L 0 ${h * 0.5}L ${w * 0.3} ${h * 0.65}L ${w * 0.5} ${h * 0.45}L ${w * 0.7} ${h * 0.6}L ${w} ${h * 0.5}L ${w} 0 Z`,
      },
    };

    return waveStyles[style] ? JSON.stringify(waveStyles[style]) : JSON.stringify(waveStyles.wave);
  };

  const wavePaths = JSON.parse(getWavePaths(waveStyle));
  const keyTimes = waveStyle === 'pulse' || waveStyle === 'flow' ? '0;0.5;1' : '0;0.333;0.667;1';
  const keySplines = waveStyle === 'pulse' || waveStyle === 'flow'
    ? '0.4 0 0.6 1;0.4 0 0.6 1'
    : '0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1';

  const waveAnimation = animate ? `
    <animate 
      attributeName="d" 
      dur="${waveDuration}s" 
      repeatCount="indefinite" 
      keyTimes="${keyTimes}" 
      calcMode="spline" 
      keySplines="${keySplines}"
      values="${wavePaths.path1}"/>
  ` : '';

  const waveAnimation2 = animate ? `
    <animate 
      attributeName="d" 
      dur="${waveDuration}s" 
      repeatCount="indefinite" 
      keyTimes="${keyTimes}" 
      calcMode="spline" 
      keySplines="${keySplines}"
      begin="-${waveDuration / 2}s"
      values="${wavePaths.path2}"/>
  ` : '';

  // Calculate font sizes based on width
  const nameFontSize = Math.min(50, p.width / 12);
  const descFontSize = Math.min(20, p.width / 30);

  return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}">
  <style>
    .banner-name { 
      font-size: ${nameFontSize}px; 
      font-weight: 700; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; 
      fill: ${p.primaryColor};
    }
    .banner-desc { 
      font-size: ${descFontSize}px; 
      font-weight: 500; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; 
      fill: ${p.primaryColor};
    }
    ${animate ? `
    .banner-name, .banner-desc {
      animation: fadeIn 1.2s ease-in-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    ` : ''}
  </style>
  
  <defs>
    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${gradientStart}"/>
      <stop offset="100%" stop-color="${gradientEnd}"/>
    </linearGradient>
    <clipPath id="roundedClip">
      <rect x="0" y="0" width="${p.width}" height="${p.height}" rx="${p.borderRadius}"/>
    </clipPath>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="${p.width}" height="${p.height}" rx="${p.borderRadius}" fill="${p.bgColor}"/>
  
  <!-- Animated Waves -->
  <g clip-path="url(#roundedClip)">
    <g transform="translate(${centerX}, ${p.height / 2}) scale(1, 1) translate(-${centerX}, -${p.height / 2})">
      <path d="" fill="url(#waveGradient)" opacity="0.4">
        ${waveAnimation}
      </path>
      <path d="" fill="url(#waveGradient)" opacity="0.4">
        ${waveAnimation2}
      </path>
    </g>
  </g>
  
  <!-- Border -->
  ${p.borderStyle ? `<rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="none" ${p.borderStyle}/>` : ''}
  
  <!-- Text Content -->
  <text text-anchor="middle" alignment-baseline="middle" x="50%" y="40%" class="banner-name">${bannerName}</text>
  <text text-anchor="middle" alignment-baseline="middle" x="50%" y="60%" class="banner-desc">${bannerDescription}</text>
</svg>`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
