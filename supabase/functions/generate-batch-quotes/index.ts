import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Topics for variety
const topics = [
  "debugging",
  "coffee and coding",
  "deadlines",
  "code reviews",
  "testing",
  "refactoring",
  "documentation",
  "git commits",
  "stack overflow",
  "legacy code",
  "production bugs",
  "code optimization",
  "pair programming",
  "rubber duck debugging",
  "technical debt",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY');

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Parse request body for count (default 250)
    const { count = 250, clearOld = false } = await req.json().catch(() => ({}));

    console.log(`Starting batch quote generation: ${count} quotes`);

    // Optionally clear old quotes (keep last 50 as buffer)
    if (clearOld) {
      const { data: existingQuotes } = await supabase
        .from('quotes_cache')
        .select('id')
        .order('created_at', { ascending: false })
        .range(50, 10000);

      if (existingQuotes && existingQuotes.length > 0) {
        const idsToDelete = existingQuotes.map(q => q.id);
        await supabase.from('quotes_cache').delete().in('id', idsToDelete);
        console.log(`Cleared ${idsToDelete.length} old quotes`);
      }
    }

    // Generate quotes in batches of 10 for efficiency
    const batchSize = 10;
    const totalBatches = Math.ceil(count / batchSize);
    let successCount = 0;
    let failCount = 0;

    for (let batch = 0; batch < totalBatches; batch++) {
      const currentBatchSize = Math.min(batchSize, count - (batch * batchSize));
      const topic = topics[batch % topics.length];

      console.log(`Generating batch ${batch + 1}/${totalBatches} (${currentBatchSize} quotes about ${topic})`);

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a wise developer philosopher. Generate ${currentBatchSize} unique, inspiring quotes for developers about ${topic}.\n\nRules for each quote:\n- Keep quotes under 150 characters\n- Make them motivational, witty, or insightful\n- Focus on programming, coding, software development themes\n- Include a fictional or real author attribution\n- Each quote must be different and creative\n\nReturn ONLY a valid JSON array with objects containing "quote" and "author" fields.\nExample format: [{\\"quote\\": \\"...\\", \\"author\\": \\"...\\"}, {\\"quote\\": \\"...\\", \\"author\\": \\"...\\"}]`
              }]
            }],
            generationConfig: {
              temperature: 1.0,
              maxOutputTokens: 2048,
            }
          }),
        });

        if (!response.ok) {
          console.error(`Batch ${batch + 1} failed:`, response.status);
          failCount += currentBatchSize;
          continue;
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse quotes array from response
        let quotes = [];
        try {
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            quotes = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.log(`Could not parse batch ${batch + 1}:`, e);
          failCount += currentBatchSize;
          continue;
        }

        // Insert valid quotes
        for (const quote of quotes) {
          if (quote.quote && quote.author && quote.quote.length < 200) {
            const { error } = await supabase
              .from('quotes_cache')
              .insert({ quote: quote.quote, author: quote.author });

            if (!error) {
              successCount++;
            } else {
              failCount++;
            }
          }
        }

        // Small delay between batches to avoid rate limiting
        if (batch < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (batchError) {
        console.error(`Batch ${batch + 1} error:`, batchError);
        failCount += currentBatchSize;
      }
    }

    // Get final count
    const { count: totalQuotes } = await supabase
      .from('quotes_cache')
      .select('*', { count: 'exact', head: true });

    console.log(`Batch generation complete: ${successCount} success, ${failCount} failed, ${totalQuotes} total in cache`);

    return new Response(
      JSON.stringify({
        success: true,
        generated: successCount,
        failed: failCount,
        totalInCache: totalQuotes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
