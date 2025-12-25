import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-setpp-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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
        github_token: Deno.env.get('GITHUB_TOKEN') ? 'configured' : 'not set',
        cache_ttl: Deno.env.get('CACHE_TTL_MINUTES') || '60',
        environment: {
          required: [
            'SETPP=true',
            'SETPP_KEY=your_secure_key'
          ],
          optional: [
            'CUSTOM_SUPABASE_URL=your_supabase_url',
            'CUSTOM_SUPABASE_ANON_KEY=your_anon_key',
            'GITHUB_TOKEN=your_github_pat',
            'CACHE_TTL_MINUTES=60'
          ],
          combined_env_template: `# Required for setup endpoint
SETPP=true
SETPP_KEY=your_secure_random_key_here

# Supabase Configuration (use your own or keep defaults)
CUSTOM_SUPABASE_URL=https://your-project.supabase.co
CUSTOM_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: GitHub Personal Access Token for higher rate limits
GITHUB_TOKEN=ghp_your_token_here

# Optional: Cache TTL in minutes (default: 60)
CACHE_TTL_MINUTES=60

# For Vite frontend (if self-hosting)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id`
        }
      };

      console.log('Returning configuration status');
      return new Response(
        JSON.stringify(config, null, 2),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // POST request - validate configuration
    if (req.method === 'POST') {
      const body = await req.json();
      
      if (action === 'validate') {
        // Validate provided configuration
        const validation = {
          supabase_url: body.supabase_url ? 'valid' : 'missing',
          supabase_key: body.supabase_key ? 'valid' : 'missing',
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

        console.log('Configuration validation:', validation);
        return new Response(
          JSON.stringify({ validation }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (action === 'test') {
        // Test current configuration by making a sample request
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
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Unknown action', available: ['validate', 'test'] }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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
