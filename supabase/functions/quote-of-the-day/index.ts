import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get today's date in UTC
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a quote for today
    const { data: existingQotd, error: qotdError } = await supabase
      .from('quote_of_the_day')
      .select('quote, author')
      .eq('date', today)
      .single();
    
    if (existingQotd) {
      console.log('Returning existing quote of the day');
      return new Response(JSON.stringify(existingQotd), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // No quote for today, select a random one from cache
    const { count } = await supabase
      .from('quotes_cache')
      .select('*', { count: 'exact', head: true });
    
    if (!count || count === 0) {
      // Fallback if no quotes in cache
      const fallback = { quote: "Every day is a new opportunity to code something amazing.", author: "Daily Dev" };
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get a random quote
    const randomOffset = Math.floor(Math.random() * count);
    const { data: randomQuote } = await supabase
      .from('quotes_cache')
      .select('id, quote, author')
      .range(randomOffset, randomOffset)
      .single();
    
    if (randomQuote) {
      // Save as today's quote of the day
      const { error: insertError } = await supabase
        .from('quote_of_the_day')
        .insert({
          quote_id: randomQuote.id,
          quote: randomQuote.quote,
          author: randomQuote.author,
          date: today
        });
      
      if (insertError) {
        console.log('Failed to save quote of the day:', insertError);
      } else {
        console.log('Set new quote of the day');
      }
      
      return new Response(JSON.stringify({ quote: randomQuote.quote, author: randomQuote.author }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Fallback
    const fallback = { quote: "Every day is a new opportunity to code something amazing.", author: "Daily Dev" };
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error getting quote of the day:', error);
    const fallback = { quote: "Every day is a new opportunity to code something amazing.", author: "Daily Dev" };
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});