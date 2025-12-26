import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback quotes to use when API fails
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
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // First, try to get cached quotes (we want at least 3)
    const { data: cachedQuotes, error: cacheError } = await supabase
      .from('quotes_cache')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    console.log('Cached quotes:', cachedQuotes?.length || 0);
    
    // If we have cached quotes and no API key, return a random cached one
    if (!GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY configured, using fallback/cached quotes');
      
      if (cachedQuotes && cachedQuotes.length > 0) {
        const randomQuote = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
        return new Response(JSON.stringify({ quote: randomQuote.quote, author: randomQuote.author }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Use fallback
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      return new Response(JSON.stringify(randomFallback), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { topic } = await req.json().catch(() => ({}));
    
    console.log('Generating dev quote with topic:', topic || 'general programming');

    // Try to generate a new quote with Gemini
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a wise developer philosopher. Generate a short, inspiring quote for developers.

Rules:
- Keep quotes under 150 characters
- Make them motivational, witty, or insightful
- Focus on programming, coding, software development themes
- Include a fictional or real author attribution
- Return ONLY valid JSON with "quote" and "author" fields

Generate a unique developer quote${topic ? ` about ${topic}` : ''}. Return as JSON: {"quote": "...", "author": "..."}`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 256,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        throw new Error('Gemini API failed');
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      console.log('Gemini response:', content);
      
      // Parse the JSON response
      let quote = null;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*"quote"[\s\S]*"author"[\s\S]*\}/);
        if (jsonMatch) {
          quote = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('Could not parse quote JSON:', e);
      }
      
      if (quote && quote.quote && quote.author) {
        // Cache the new quote
        const { error: insertError } = await supabase
          .from('quotes_cache')
          .insert({ quote: quote.quote, author: quote.author });
        
        if (insertError) {
          console.log('Failed to cache quote:', insertError);
        } else {
          console.log('Cached new quote successfully');
        }
        
        return new Response(JSON.stringify(quote), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('Could not parse quote from AI response');
      
    } catch (aiError) {
      console.error('AI generation failed:', aiError);
      
      // Fall back to cached quotes
      if (cachedQuotes && cachedQuotes.length > 0) {
        const randomQuote = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
        return new Response(JSON.stringify({ quote: randomQuote.quote, author: randomQuote.author }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Use fallback quotes
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      
      // Also cache this fallback for future use
      try {
        await supabase.from('quotes_cache').insert({ 
          quote: randomFallback.quote, 
          author: randomFallback.author 
        });
      } catch (e) {
        console.log('Failed to cache fallback quote:', e);
      }
      
      return new Response(JSON.stringify(randomFallback), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
  } catch (error) {
    console.error('Error generating quote:', error);
    
    // Always return a quote, never fail
    const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return new Response(JSON.stringify(randomFallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
