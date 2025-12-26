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
        primaryColor, secondaryColor, textColor, animate,
        languages: languages || [],
        commonStyles, gradientDefs,
      });
    
    case 'streak':
      return generateStreakSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, animate,
        streak: streak || { current: 0, longest: 0, total: 0 },
        commonStyles, gradientDefs,
      });
    
    case 'activity':
      return generateActivitySVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, animate,
        activity: activity || Array(30).fill(0),
        commonStyles, gradientDefs,
      });
    
    case 'quote':
      return generateQuoteSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, animate,
        quote: quote || { quote: "Code is poetry.", author: "Anonymous" },
        commonStyles, gradientDefs,
      });
    
    case 'custom':
      return generateCustomSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
        primaryColor, textColor, customText, animate,
        commonStyles, gradientDefs,
      });
    
    default:
      return generateStatsSVG({
        width, height, bgColor: bgFill, borderRadius, borderStyle,
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
  const langs = languages.slice(0, 5);
  const barWidth = p.width - 50;
  const barHeight = 8;
  const barY = 35;
  
  // Generate the stacked progress bar
  let barSegments = '';
  let currentX = 0;
  
  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const segmentWidth = barWidth * (lang.percentage / 100);
    const animClass = animate ? `class="animate delay-${i + 1}"` : '';
    barSegments += `<rect x="${currentX}" y="0" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" rx="2" ${animClass}/>`;
    currentX += segmentWidth;
  }
  
  // Generate the legend - 2 items per row with proper spacing
  let legendItems = '';
  const legendY = barY + 20;
  const colWidth = Math.floor((p.width - 50) / 2);
  
  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = col * colWidth;
    const y = row * 22;
    const animClass = animate ? `class="animate delay-${i + 1}"` : '';
    
    legendItems += `
    <g transform="translate(${x}, ${y})" ${animClass}>
      <circle r="5" cx="5" cy="5" fill="${lang.color}"/>
      <text x="15" y="9" class="lang-label">${lang.name} ${lang.percentage}%</text>
    </g>`;
  }
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.gradientDefs || ''}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
    .title { font: 600 18px 'Inter', sans-serif; fill: ${p.primaryColor}; }
    .lang-label { font: 400 11px 'Inter', sans-serif; fill: ${p.textColor}; }
    ${animate ? `
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
      .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; } .delay-5 { animation-delay: 0.5s; }
    ` : ''}
  </style>
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <g transform="translate(25, 25)">
    <text class="title">Most Used Languages</text>
    <g transform="translate(0, ${barY})">${barSegments}</g>
    <g transform="translate(0, ${legendY})">${legendItems}</g>
  </g>
</svg>`;
}

function generateStreakSVG(p: any): string {
  const { streak, animate } = p;
  const centerX = p.width / 2;
  const sectionWidth = p.width / 3;
  
  // Format dates
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // Calculate ring progress (max 100 days for full circle)
  const maxStreak = 100;
  const progress = Math.min(streak.current / maxStreak, 1);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - progress);
  
  const ringAnim = animate ? `
    <style>
      .ring-bg { opacity: 0.2; }
      .ring-progress { 
        stroke-dasharray: ${circumference}; 
        stroke-dashoffset: ${circumference};
        animation: dash 1.5s ease-out forwards;
      }
      @keyframes dash {
        to { stroke-dashoffset: ${dashOffset}; }
      }
    </style>
  ` : '';
  
  const fadeClass = animate ? 'class="animate-fade stagger-1"' : '';
  const scaleClass = animate ? 'class="animate-scale"' : '';
  const fadeClass2 = animate ? 'class="animate-fade stagger-3"' : '';

  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  ${ringAnim}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <!-- Left Section: Total Contributions -->
  <g transform="translate(${sectionWidth / 2}, ${p.height / 2})" ${fadeClass}>
    <text text-anchor="middle" class="stat-value" fill="${p.secondaryColor}" y="-15">${formatNumber(streak.total)}</text>
    <text text-anchor="middle" class="stat-label" y="8">Total Contributions</text>
    <text text-anchor="middle" class="small" y="24">${formatDate(streak.startDate)} - Present</text>
  </g>
  
  <!-- Center Section: Current Streak with Ring -->
  <g transform="translate(${centerX}, ${p.height / 2})" ${scaleClass}>
    <!-- Ring Background -->
    <circle cx="0" cy="0" r="40" fill="none" stroke="${p.primaryColor}" stroke-width="6" class="ring-bg"/>
    <!-- Ring Progress -->
    <circle cx="0" cy="0" r="40" fill="none" stroke="${p.primaryColor}" stroke-width="6" 
            stroke-linecap="round" transform="rotate(-90)" class="ring-progress"/>
    <!-- Flame Icon -->
    <text text-anchor="middle" font-size="20" y="-25" fill="${p.primaryColor}">🔥</text>
    <!-- Current Streak Number -->
    <text text-anchor="middle" class="stat-value" fill="${p.primaryColor}" y="5" font-size="28">${streak.current}</text>
    <text text-anchor="middle" class="stat-label" y="55">Current Streak</text>
    <text text-anchor="middle" class="small" y="70">${todayStr}</text>
  </g>
  
  <!-- Right Section: Longest Streak -->
  <g transform="translate(${p.width - sectionWidth / 2}, ${p.height / 2})" ${fadeClass2}>
    <text text-anchor="middle" class="stat-value" fill="${p.secondaryColor}" y="-15">${streak.longest}</text>
    <text text-anchor="middle" class="stat-label" y="8">Longest Streak</text>
    <text text-anchor="middle" class="small" y="24">${formatDate(streak.longestStreakStart)} - ${formatDate(streak.longestStreakEnd)}</text>
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

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
