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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { topic } = await req.json();
    
    console.log('Generating dev quote with topic:', topic || 'general programming');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a wise developer philosopher. Generate short, inspiring quotes for developers.
            
Rules:
- Keep quotes under 100 characters
- Make them motivational, witty, or insightful
- Focus on programming, coding, software development themes
- Include a fictional or real author attribution
- Return ONLY valid JSON with "quote" and "author" fields`
          },
          {
            role: 'user',
            content: `Generate a unique developer quote${topic ? ` about ${topic}` : ''}. Return as JSON: {"quote": "...", "author": "..."}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to generate quote');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response:', content);
    
    // Parse the JSON response
    let quote = { quote: "Code is poetry.", author: "Anonymous Developer" };
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*"quote"[\s\S]*"author"[\s\S]*\}/);
      if (jsonMatch) {
        quote = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('Could not parse quote JSON, using fallback');
    }
    
    return new Response(JSON.stringify(quote), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating quote:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: message,
        quote: "First, solve the problem. Then, write the code.",
        author: "John Johnson"
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
