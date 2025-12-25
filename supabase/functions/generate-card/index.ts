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
  // Stats data
  stats?: {
    totalStars: number;
    publicRepos: number;
    followers: number;
    totalForks: number;
  };
  languages?: Array<{ name: string; percentage: number; color: string }>;
  streak?: { current: number; longest: number; total: number };
  activity?: number[];
  quote?: { quote: string; author: string };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let params: CardParams;
    
    // Support both GET (for image embedding) and POST (for API calls)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      params = {
        type: url.searchParams.get('type') || 'stats',
        username: url.searchParams.get('username') || '',
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
      };
      
      // Fetch real data for GET requests (image embedding)
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
      
      // Fetch quote for quote type
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

    console.log('Generating card:', params.type, params.username);

    const svg = generateSVG(params);

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
    stats,
    languages,
    streak,
    activity,
    quote,
  } = params;

  const borderStyle = showBorder 
    ? `stroke="${borderColor}" stroke-width="2"` 
    : '';

  const commonStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      .title { font: 600 18px 'Inter', sans-serif; fill: ${primaryColor}; }
      .stat-value { font: 700 20px 'Inter', sans-serif; }
      .stat-label { font: 400 12px 'Inter', sans-serif; fill: ${textColor}; opacity: 0.7; }
      .text { font: 400 14px 'Inter', sans-serif; fill: ${textColor}; }
      .small { font: 400 11px 'Inter', sans-serif; fill: ${textColor}; opacity: 0.7; }
      .quote { font: italic 400 16px 'Inter', sans-serif; fill: ${textColor}; }
      .author { font: 400 13px 'Inter', sans-serif; fill: ${secondaryColor}; }
    </style>
  `;

  switch (type) {
    case 'stats':
      return generateStatsSVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, username,
        stats: stats || { totalStars: 0, publicRepos: 0, followers: 0, totalForks: 0 },
        commonStyles,
      });
    
    case 'languages':
      return generateLanguagesSVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor,
        languages: languages || [],
        commonStyles,
      });
    
    case 'streak':
      return generateStreakSVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor,
        streak: streak || { current: 0, longest: 0, total: 0 },
        commonStyles,
      });
    
    case 'activity':
      return generateActivitySVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor,
        activity: activity || Array(30).fill(0),
        commonStyles,
      });
    
    case 'quote':
      return generateQuoteSVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor,
        quote: quote || { quote: "Code is poetry.", author: "Anonymous" },
        commonStyles,
      });
    
    case 'custom':
      return generateCustomSVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, textColor, customText,
        commonStyles,
      });
    
    default:
      return generateStatsSVG({
        width, height, bgColor, borderRadius, borderStyle,
        primaryColor, secondaryColor, textColor, username,
        stats: stats || { totalStars: 0, publicRepos: 0, followers: 0, totalForks: 0 },
        commonStyles,
      });
  }
}

function generateStatsSVG(p: any): string {
  const { stats } = p;
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <g transform="translate(25, 25)">
    <text class="title">${p.username}'s GitHub Stats</text>
    
    <g transform="translate(0, 40)">
      <text class="stat-value" fill="${p.primaryColor}">⭐ ${formatNumber(stats.totalStars)}</text>
      <text class="stat-label" y="18">Total Stars</text>
    </g>
    
    <g transform="translate(120, 40)">
      <text class="stat-value" fill="${p.secondaryColor}">📦 ${stats.publicRepos}</text>
      <text class="stat-label" y="18">Repositories</text>
    </g>
    
    <g transform="translate(240, 40)">
      <text class="stat-value" fill="${p.primaryColor}">👥 ${formatNumber(stats.followers)}</text>
      <text class="stat-label" y="18">Followers</text>
    </g>
    
    <g transform="translate(360, 40)">
      <text class="stat-value" fill="${p.secondaryColor}">🔀 ${formatNumber(stats.totalForks)}</text>
      <text class="stat-label" y="18">Total Forks</text>
    </g>
  </g>
</svg>`;
}

function generateLanguagesSVG(p: any): string {
  const { languages } = p;
  let langBars = '';
  let yOffset = 50;
  
  for (const lang of languages.slice(0, 5)) {
    langBars += `
      <g transform="translate(25, ${yOffset})">
        <text class="text">${lang.name}</text>
        <text class="text" x="${p.width - 70}" fill="${p.secondaryColor}">${lang.percentage}%</text>
        <rect y="18" width="${p.width - 50}" height="6" rx="3" fill="${p.primaryColor}" opacity="0.2"/>
        <rect y="18" width="${(p.width - 50) * (lang.percentage / 100)}" height="6" rx="3" fill="${lang.color}"/>
      </g>
    `;
    yOffset += 35;
  }
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <text class="title" x="25" y="35">Most Used Languages</text>
  ${langBars}
</svg>`;
}

function generateStreakSVG(p: any): string {
  const { streak } = p;
  const centerX = p.width / 2;
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  
  <text class="title" x="${centerX}" y="35" text-anchor="middle">🔥 Contribution Streak</text>
  
  <g transform="translate(${centerX - 180}, 70)">
    <text class="stat-value" x="0" y="0" fill="${p.secondaryColor}" font-size="32">${streak.current}</text>
    <text class="stat-label" x="0" y="25">Current Streak</text>
  </g>
  
  <g transform="translate(${centerX - 30}, 70)">
    <text class="stat-value" x="0" y="0" fill="${p.primaryColor}" font-size="32">${streak.longest}</text>
    <text class="stat-label" x="0" y="25">Longest Streak</text>
  </g>
  
  <g transform="translate(${centerX + 120}, 70)">
    <text class="stat-value" x="0" y="0" fill="${p.secondaryColor}" font-size="32">${formatNumber(streak.total)}</text>
    <text class="stat-label" x="0" y="25">Total Commits</text>
  </g>
</svg>`;
}

function generateActivitySVG(p: any): string {
  const { activity } = p;
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
    
    bars += `<rect x="${40 + i * barWidth}" y="${130 - height}" width="${barWidth - 2}" height="${height}" rx="2" fill="${color}"/>`;
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
  const { quote } = p;
  const centerX = p.width / 2;
  const centerY = p.height / 2;
  
  // Wrap long quotes
  const words = quote.quote.split(' ');
  let lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).length > 45) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  const quoteLines = lines.map((line, i) => 
    `<tspan x="${centerX}" dy="${i === 0 ? 0 : 22}">"${i === 0 ? '' : ''}${line}${i === lines.length - 1 ? '"' : ''}</tspan>`
  ).join('');
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <text x="${centerX}" y="40" text-anchor="middle" font-size="32" fill="${p.primaryColor}">💬</text>
  <text class="quote" x="${centerX}" y="${centerY}" text-anchor="middle">${quoteLines}</text>
  <text class="author" x="${centerX}" y="${p.height - 25}" text-anchor="middle">— ${quote.author}</text>
</svg>`;
}

function generateCustomSVG(p: any): string {
  const centerX = p.width / 2;
  const centerY = p.height / 2;
  
  return `
<svg width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}" xmlns="http://www.w3.org/2000/svg">
  ${p.commonStyles}
  <rect x="1" y="1" width="${p.width - 2}" height="${p.height - 2}" rx="${p.borderRadius}" fill="${p.bgColor}" ${p.borderStyle}/>
  <text class="title" x="${centerX}" y="${centerY}" text-anchor="middle" font-size="20">${p.customText || 'Your custom text here'}</text>
</svg>`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
