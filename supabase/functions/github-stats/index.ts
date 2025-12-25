import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Stats-Visualizer',
    },
  });
  
  if (!response.ok) {
    throw new Error(`User not found: ${username}`);
  }
  
  return response.json();
}

async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  
  while (page <= 3) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Stats-Visualizer',
        },
      }
    );
    
    if (!response.ok) break;
    
    const data = await response.json();
    if (data.length === 0) break;
    
    repos.push(...data);
    if (data.length < perPage) break;
    page++;
  }
  
  return repos;
}

async function fetchContributions(username: string): Promise<{
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  startDate: string;
  longestStreakStart: string;
  longestStreakEnd: string;
}> {
  try {
    // Try multiple contribution APIs
    const apis = [
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      `https://github-contributions.vercel.app/api/v1/${username}`,
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Handle jogruber API format
        if (data.contributions) {
          let contributions: { date: string; count: number }[] = [];
          
          if (Array.isArray(data.contributions)) {
            contributions = data.contributions;
          } else if (typeof data.contributions === 'object') {
            // Convert object format to array
            contributions = Object.entries(data.contributions).map(([date, count]) => ({
              date,
              count: count as number
            }));
          }

          // Sort by date descending (most recent first)
          contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          let totalContributions = data.total?.lastYear || contributions.reduce((sum, d) => sum + d.count, 0);
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;
          let streakActive = true;
          let longestStreakStart = '';
          let longestStreakEnd = '';
          let tempStreakStart = '';
          
          const today = new Date().toISOString().split('T')[0];
          const startDate = contributions.length > 0 ? contributions[contributions.length - 1].date : today;
          
          for (const day of contributions) {
            if (day.count > 0) {
              if (tempStreak === 0) tempStreakStart = day.date;
              tempStreak++;
              if (streakActive) currentStreak = tempStreak;
              if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
                longestStreakEnd = tempStreakStart;
                longestStreakStart = day.date;
              }
            } else {
              streakActive = false;
              tempStreak = 0;
            }
          }
          
          return { 
            totalContributions, 
            currentStreak, 
            longestStreak,
            startDate,
            longestStreakStart: longestStreakStart || today,
            longestStreakEnd: longestStreakEnd || today
          };
        }
      } catch (e) {
        console.log(`API ${apiUrl} failed:`, e);
        continue;
      }
    }
  } catch (e) {
    console.log('Could not fetch contributions:', e);
  }
  
  const today = new Date().toISOString().split('T')[0];
  return { 
    totalContributions: 0, 
    currentStreak: 0, 
    longestStreak: 0,
    startDate: today,
    longestStreakStart: today,
    longestStreakEnd: today
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching GitHub stats for: ${username}`);

    // Check cache first
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: cached } = await supabase
      .from('github_stats_cache')
      .select('stats_data, expires_at')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (cached && new Date(cached.expires_at) > new Date()) {
      console.log(`Returning cached stats for ${username}`);
      return new Response(JSON.stringify(cached.stats_data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch fresh data
    const user = await fetchGitHubUser(username);
    const repos = await fetchUserRepos(username);
    
    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
    
    const languageCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    }
    
    const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangRepos) * 100),
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
    
    const contributions = await fetchContributions(username);
    
    const result = {
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
      stats: {
        totalStars,
        totalForks,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
      },
      languages,
      streak: {
        current: contributions.currentStreak,
        longest: contributions.longestStreak,
        total: contributions.totalContributions,
        startDate: contributions.startDate,
        longestStreakStart: contributions.longestStreakStart,
        longestStreakEnd: contributions.longestStreakEnd,
      },
      activity: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15)),
    };

    // Cache the result (upsert)
    await supabase
      .from('github_stats_cache')
      .upsert({
        username: username.toLowerCase(),
        stats_data: result,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      }, { onConflict: 'username' });

    console.log(`Successfully fetched and cached stats for ${username}`);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    Python: '#3776AB',
    Rust: '#DEA584',
    Go: '#00ADD8',
    Java: '#B07219',
    'C++': '#F34B7D',
    C: '#555555',
    Ruby: '#CC342D',
    PHP: '#4F5D95',
    Swift: '#FA7343',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Vue: '#41B883',
    CSS: '#563D7C',
    HTML: '#E34C26',
    Shell: '#89E051',
    Scala: '#C22D40',
  };
  return colors[language] || '#8B8B8B';
}
