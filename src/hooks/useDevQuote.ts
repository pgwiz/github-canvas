import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DevQuote {
  quote: string;
  author: string;
}

export function useDevQuote() {
  const [quote, setQuote] = useState<DevQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuote = async (topic?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: funcError } = await supabase.functions.invoke(
        "generate-quote",
        {
          body: { topic },
        }
      );

      if (funcError) {
        throw new Error(funcError.message);
      }

      // Even on error, we get a fallback quote
      const quoteData = {
        quote: result.quote,
        author: result.author,
      };

      setQuote(quoteData);
      return quoteData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate quote";
      setError(message);
      // Return fallback quote
      const fallback = {
        quote: "Code is poetry.",
        author: "Anonymous Developer",
      };
      setQuote(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  return { quote, loading, error, generateQuote };
}
