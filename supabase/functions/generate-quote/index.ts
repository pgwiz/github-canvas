import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback quotes to use when cache is empty and API fails
const fallbackQuotes = [
  { quote: "The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent of the code accounts for the other 90 percent of the development time.", author: "Tom Cargill" },
  { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get count of cached quotes
    const { count: cacheCount } = await supabase
      .from('quotes_cache')
      .select('*', { count: 'exact', head: true });

    console.log('Quotes in cache:', cacheCount);

    // If we have enough cached quotes (aim for 250+), just serve from cache
    if (cacheCount && cacheCount >= 3) {
      // Get a random quote from cache
      const randomOffset = Math.floor(Math.random() * cacheCount);
      const { data: randomQuotes, error } = await supabase
        .from('quotes_cache')
        .select('quote, author')
        .range(randomOffset, randomOffset);

      if (randomQuotes && randomQuotes.length > 0) {
        console.log('Serving random quote from cache');
        return new Response(JSON.stringify(randomQuotes[0]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // If cache is low, try to generate a new quote with AI
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (GEMINI_API_KEY) {
      const { topic } = await req.json().catch(() => ({}));

      console.log('Cache low, generating new quote with topic:', topic || 'general programming');

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a wise developer philosopher. Generate a short, inspiring quote for developers${topic ? ` about ${topic}` : ''}.

Rules:
- Keep quotes under 150 characters
- Make them motivational, witty, or insightful
- Focus on programming, coding, software development themes
- Include a fictional or real author attribution
- Return ONLY valid JSON with "quote" and "author" fields

Return as JSON: {"quote": "...", "author": "..."}`
              }]
            }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 256,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

          console.log('Gemini response:', content);

          const jsonMatch = content.match(/\{[\s\S]*"quote"[\s\S]*"author"[\s\S]*\}/);
          if (jsonMatch) {
            const quote = JSON.parse(jsonMatch[0]);

            // Cache the new quote
            await supabase.from('quotes_cache').insert({ quote: quote.quote, author: quote.author });

            return new Response(JSON.stringify(quote), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (aiError) {
        console.error('AI generation failed:', aiError);
      }
    }

    // Fallback: try to get any cached quote
    const { data: anyQuote } = await supabase
      .from('quotes_cache')
      .select('quote, author')
      .limit(1)
      .single();

    if (anyQuote) {
      return new Response(JSON.stringify(anyQuote), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Last resort: use hardcoded fallback
    const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return new Response(JSON.stringify(randomFallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error getting quote:', error);

    const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return new Response(JSON.stringify(randomFallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
