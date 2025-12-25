import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Forward the request to generate-card with the same query params
    const url = new URL(req.url);
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const targetUrl = `${supabaseUrl}/functions/v1/generate-card${url.search}`;
    
    const response = await fetch(targetUrl);
    const svgContent = await response.text();
    
    return new Response(svgContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Error generating card', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
