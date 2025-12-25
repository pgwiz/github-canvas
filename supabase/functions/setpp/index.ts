import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-setpp-key',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW };
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }
  
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetIn: entry.resetTime - now };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    const rateLimitHeaders = {
      'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(rateLimit.resetIn / 1000).toString(),
    };
    
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds`,
          retry_after: Math.ceil(rateLimit.resetIn / 1000)
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if setpp mode is enabled
    const setppEnabled = Deno.env.get('SETPP') === 'true';
    
    if (!setppEnabled) {
      console.log('SETPP mode is not enabled');
      return new Response(
        JSON.stringify({ 
          error: 'Setup endpoint is not enabled',
          message: 'Set SETPP=true in environment to enable this endpoint'
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the setup key
    const setppKey = Deno.env.get('SETPP_KEY');
    const providedKey = req.headers.get('x-setpp-key');

    if (!setppKey || providedKey !== setppKey) {
      console.log('Invalid or missing SETPP_KEY');
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Invalid or missing setup key'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // GET request - return current configuration status
    if (req.method === 'GET') {
      const config = {
        setpp_enabled: true,
        supabase_url: Deno.env.get('CUSTOM_SUPABASE_URL') ? 'configured' : 'default',
        supabase_key: Deno.env.get('CUSTOM_SUPABASE_ANON_KEY') ? 'configured' : 'default',
        supabase_service_role: Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') ? 'configured' : 'not set',
        github_token: Deno.env.get('GITHUB_TOKEN') ? 'configured' : 'not set',
        cache_ttl: Deno.env.get('CACHE_TTL_MINUTES') || '60',
        rate_limit: {
          max_requests: RATE_LIMIT_MAX,
          window_seconds: RATE_LIMIT_WINDOW / 1000,
          remaining: rateLimit.remaining
        }
      };

      console.log('Returning configuration status');
      return new Response(
        JSON.stringify(config, null, 2),
        { 
          status: 200, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // POST request - handle actions
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      
      if (action === 'validate') {
        const validation = {
          supabase_url: body.supabase_url ? 'valid' : 'missing',
          supabase_key: body.supabase_key ? 'valid' : 'missing',
          supabase_service_role: body.supabase_service_role ? 'valid' : 'optional - not provided',
          github_token: body.github_token ? 'valid' : 'optional - not provided'
        };

        // Test GitHub token if provided
        if (body.github_token) {
          try {
            const ghResponse = await fetch('https://api.github.com/user', {
              headers: { 'Authorization': `token ${body.github_token}` }
            });
            validation.github_token = ghResponse.ok ? 'valid - authenticated' : 'invalid token';
          } catch {
            validation.github_token = 'invalid - connection failed';
          }
        }

        // Test Supabase connection if provided
        if (body.supabase_url && body.supabase_key) {
          try {
            const testResponse = await fetch(`${body.supabase_url}/rest/v1/`, {
              headers: {
                'apikey': body.supabase_key,
                'Authorization': `Bearer ${body.supabase_key}`
              }
            });
            validation.supabase_url = testResponse.ok ? 'valid - connected' : `error: ${testResponse.status}`;
          } catch {
            validation.supabase_url = 'invalid - connection failed';
          }
        }

        console.log('Configuration validation:', validation);
        return new Response(
          JSON.stringify({ validation }),
          { 
            status: 200, 
            headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (action === 'health') {
        const healthStatus: {
          timestamp: string;
          status: string;
          services: {
            github_api: { status: string; latency_ms: number; rate_limit?: { remaining: number; limit: number; resets_at: string | null }; error?: string };
            cloud: { status: string; latency_ms: number; error?: string };
            cache: { status: string; entries: number };
          };
        } = {
          timestamp: new Date().toISOString(),
          status: 'healthy',
          services: {
            github_api: { status: 'unknown', latency_ms: 0 },
            cloud: { status: 'unknown', latency_ms: 0 },
            cache: { status: 'unknown', entries: 0 }
          }
        };

        // Test GitHub API
        try {
          const ghStart = Date.now();
          const ghResponse = await fetch('https://api.github.com/rate_limit', {
            headers: {
              'User-Agent': 'DevCard-Health-Check'
            }
          });
          healthStatus.services.github_api.latency_ms = Date.now() - ghStart;
          
          if (ghResponse.ok) {
            const rateData = await ghResponse.json();
            healthStatus.services.github_api.status = 'healthy';
            healthStatus.services.github_api.rate_limit = {
              remaining: rateData.rate?.remaining || 0,
              limit: rateData.rate?.limit || 60,
              resets_at: rateData.rate?.reset ? new Date(rateData.rate.reset * 1000).toISOString() : null
            };
          } else {
            healthStatus.services.github_api.status = 'degraded';
            healthStatus.status = 'degraded';
          }
        } catch (e: unknown) {
          healthStatus.services.github_api.status = 'unhealthy';
          healthStatus.services.github_api.error = e instanceof Error ? e.message : 'unknown';
          healthStatus.status = 'unhealthy';
        }

        // Test Cloud (database) status
        try {
          const dbStart = Date.now();
          const supabaseUrl = Deno.env.get('CUSTOM_SUPABASE_URL') || Deno.env.get('SUPABASE_URL');
          const supabaseKey = Deno.env.get('CUSTOM_SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
          
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // Check cache table and get entry count
            const { count, error } = await supabase
              .from('github_stats_cache')
              .select('*', { count: 'exact', head: true });
            
            healthStatus.services.cloud.latency_ms = Date.now() - dbStart;
            
            if (!error) {
              healthStatus.services.cloud.status = 'healthy';
              healthStatus.services.cache.status = 'healthy';
              healthStatus.services.cache.entries = count || 0;
            } else {
              healthStatus.services.cloud.status = 'degraded';
              healthStatus.services.cloud.error = error.message;
              healthStatus.status = 'degraded';
            }
          } else {
            healthStatus.services.cloud.status = 'not configured';
            healthStatus.services.cache.status = 'not configured';
          }
        } catch (e: unknown) {
          healthStatus.services.cloud.status = 'unhealthy';
          healthStatus.services.cloud.error = e instanceof Error ? e.message : 'unknown';
          healthStatus.status = 'unhealthy';
        }

        console.log('Health check:', healthStatus);
        return new Response(
          JSON.stringify(healthStatus, null, 2),
          { 
            status: healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503, 
            headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (action === 'test') {
        const testResults = {
          timestamp: new Date().toISOString(),
          github_api: 'unknown',
          database: 'unknown'
        };

        // Test GitHub API
        try {
          const ghResponse = await fetch('https://api.github.com/users/octocat');
          testResults.github_api = ghResponse.ok ? 'working' : `error: ${ghResponse.status}`;
        } catch (e: unknown) {
          testResults.github_api = `error: ${e instanceof Error ? e.message : 'unknown'}`;
        }

        // Test database connection
        try {
          const supabaseUrl = Deno.env.get('CUSTOM_SUPABASE_URL') || Deno.env.get('SUPABASE_URL');
          const supabaseKey = Deno.env.get('CUSTOM_SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
          
          if (supabaseUrl && supabaseKey) {
            const dbResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              }
            });
            testResults.database = dbResponse.ok ? 'connected' : `error: ${dbResponse.status}`;
          } else {
            testResults.database = 'not configured';
          }
        } catch (e: unknown) {
          testResults.database = `error: ${e instanceof Error ? e.message : 'unknown'}`;
        }

        console.log('Test results:', testResults);
        return new Response(
          JSON.stringify(testResults),
          { 
            status: 200, 
            headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (action === 'setup-db') {
        // Initialize database tables using service role key
        const supabaseUrl = body.supabase_url || Deno.env.get('CUSTOM_SUPABASE_URL') || Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = body.supabase_service_role || Deno.env.get('CUSTOM_SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !serviceRoleKey) {
          return new Response(
            JSON.stringify({ 
              error: 'Missing credentials',
              message: 'supabase_url and supabase_service_role are required for database setup'
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const results: { step: string; status: string; error?: string }[] = [];

        // Create github_stats_cache table
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS public.github_stats_cache (
                id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                stats_data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
              );
            `
          });
          
          if (error) {
            // Try direct creation via REST API
            const directResult = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ sql: 'SELECT 1' })
            });
            
            results.push({ 
              step: 'github_stats_cache table', 
              status: 'manual_required',
              error: 'RPC not available. Please run SQL manually in Supabase dashboard.'
            });
          } else {
            results.push({ step: 'github_stats_cache table', status: 'created' });
          }
        } catch (e: unknown) {
          results.push({ 
            step: 'github_stats_cache table', 
            status: 'manual_required',
            error: 'Database direct access not available. Please run SQL manually.'
          });
        }

        // Check if tables exist
        try {
          const { data: cacheCheck } = await supabase.from('github_stats_cache').select('id').limit(1);
          results.push({ step: 'github_stats_cache verification', status: cacheCheck !== null ? 'exists' : 'not_found' });
        } catch {
          results.push({ step: 'github_stats_cache verification', status: 'not_found' });
        }

        try {
          const { data: quotesCheck } = await supabase.from('quotes_cache').select('id').limit(1);
          results.push({ step: 'quotes_cache verification', status: quotesCheck !== null ? 'exists' : 'not_found' });
        } catch {
          results.push({ step: 'quotes_cache verification', status: 'not_found' });
        }

        console.log('Database setup results:', results);
        return new Response(
          JSON.stringify({ 
            message: 'Database setup attempted',
            results,
            note: 'If tables show as manual_required, please run the SQL from the setup page in your Supabase SQL Editor'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Unknown action', available: ['validate', 'test', 'setup-db'] }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    console.error('Setup endpoint error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
