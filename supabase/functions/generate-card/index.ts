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
        width: parseInt(url.searchParams.get('width') || '495'),
        height: parseInt(url.searchParams.get('height') || '195'),
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
    width = 495,
    height = 195,
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
      // Using activity data as placeholder or if we pass specific contribution data
      // For now, let's assume we might need to fetch it or use what we have.
      // Ideally pass contributionDays if available.
      return generateContributionSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, animate,
        contributionDays: [], // Need to pass this if available
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
  const barWidth = p.width - 50;
  const barHeight = 12;
  const leftPadding = 25;
  const segmentGap = 1;

  // Generate the stacked progress bar segments
  let barSegments = '';
  let currentX = 0;
  const totalGapWidth = Math.max(0, langs.length - 1) * segmentGap;
  const availableWidth = barWidth - totalGapWidth;

  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const segmentWidth = availableWidth * (lang.percentage / 100);
    const animClass = animate ? `class="lang-progress"` : '';
    barSegments += `<rect mask="url(#rect-mask)" data-testid="lang-progress" x="${currentX}" y="0" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" ${animClass}/>`;
    currentX += segmentWidth + segmentGap;
  }

  // Generate the legend - 2 columns
  let leftColumn = '';
  let rightColumn = '';
  const rowSpacing = 28;

  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const delay = animate ? `style="animation-delay: ${450 + (i * 150)}ms"` : '';

    const item = `<g transform="translate(0, ${row * rowSpacing})">
    <g class="${animate ? 'stagger' : ''}" ${delay}>
      <circle cx="6" cy="6" r="6" fill="${lang.color}"/>
      <text data-testid="lang-name" x="22" y="6" class="lang-name" dominant-baseline="middle">${lang.name} ${lang.percentage}%</text>
    </g>
  </g>`;

    if (col === 0) {
      leftColumn += item;
    } else {
      rightColumn += item;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" fill="none" role="img">
  ${p.gradientDefs || ''}
  <style>
    .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${p.primaryColor}; animation: fadeInAnimation 0.8s ease-in-out forwards; }
    @supports(-moz-appearance: auto) { .header { font-size: 15.5px; } }
    .lang-name { font: 700 12px "Segoe UI", Ubuntu, Sans-Serif; fill: ${p.textColor}; }
    ${animate ? `
    @keyframes slideInAnimation { from { width: 0; } to { width: calc(100%-100px); } }
    @keyframes growWidthAnimation { from { width: 0; } to { width: 100%; } }
    @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
    .stagger { opacity: 0; animation: fadeInAnimation 0.3s ease-in-out forwards; }
    #rect-mask rect { animation: slideInAnimation 1s ease-in-out forwards; }
    .lang-progress { animation: growWidthAnimation 0.6s ease-in-out forwards; }
    ` : ''}
  </style>
  
  <rect data-testid="card-bg" x="0.5" y="0.5" rx="${p.borderRadius}" height="99%" width="${p.width - 1}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <g data-testid="card-title" transform="translate(${leftPadding}, 25)">
    <text x="0" y="0" class="header" data-testid="header">Most Used Languages</text>
  </g>
  
  <g data-testid="main-card-body" transform="translate(0, 30)">
    <svg data-testid="lang-items" x="${leftPadding}">
      <mask id="rect-mask">
        <rect x="0" y="0" width="${barWidth}" height="${barHeight}" fill="white" rx="5"/>
      </mask>
      ${barSegments}
      
      <g transform="translate(0, 30)">
        <g transform="translate(0, 0)">${leftColumn}</g>
        <g transform="translate(235, 0)">${rightColumn}</g>
      </g>
    </svg>
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
  const { contributionDays = [], animate } = p;

  const cols = 52;
  const rows = 7;
  const cellS = 7;
  const gap = 2;
  const pitch = cellS + gap;

  // Use real data if available, otherwise fallback
  const displayDays = contributionDays.length > 0
    ? contributionDays.slice(- (cols * rows))
    : Array(cols * rows).fill(0).map(() => ({ contributionCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0 }));

  const getLevelColor = (count: number) => {
    if (count === 0) return `${p.textColor}10`;
    if (count <= 1) return `${p.primaryColor}4D`; // 30%
    if (count <= 3) return `${p.primaryColor}80`; // 50%
    if (count <= 6) return `${p.primaryColor}B3`; // 70%
    return p.primaryColor;
  };

  let cells = '';
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = c * rows + r;
      const dayData = displayDays[idx] || { contributionCount: 0 };
      const x = c * pitch;
      const y = r * pitch + 25;

      // Basic fade in animation
      const delay = animate ? `style="animation-delay: ${(c * 0.02)}s"` : '';
      const animClass = animate ? 'class="animate-fade"' : '';

      cells += `<rect x="${x}" y="${y}" width="${cellS}" height="${cellS}" rx="2" fill="${getLevelColor(dayData.contributionCount)}" ${animClass} ${delay}/>`;
    }
  }

  // Month Labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let currentMonth = -1;
  let monthsSVG = '';

  for (let c = 0; c < cols; c++) {
    const idx = c * rows;
    const dayData = displayDays[idx];
    if (dayData && dayData.date) {
      const date = new Date(dayData.date);
      const month = date.getMonth();
      if (month !== currentMonth) {
        const x = c * pitch;
        monthsSVG += `<text x="${x}" y="15" font-size="9" fill="${p.textColor}">${monthLabels[month]}</text>`;
        currentMonth = month;
      }
    }
  }

  const paddingX = 15;
  const paddingY = (p.height - (rows * pitch + 25)) / 2 + 5;

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <g transform="translate(${paddingX}, ${paddingY})">
    ${monthsSVG}
    ${cells}
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
