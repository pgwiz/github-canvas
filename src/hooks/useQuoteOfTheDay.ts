import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuoteOfTheDay {
  quote: string;
  author: string;
}

export function useQuoteOfTheDay() {
  const [qotd, setQotd] = useState<QuoteOfTheDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQotd = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("quote-of-the-day");
        
        if (error) {
          console.error("Failed to fetch quote of the day:", error);
          return;
        }
        
        if (data?.quote && data?.author) {
          setQotd(data);
        }
      } catch (err) {
        console.error("Error fetching quote of the day:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQotd();
  }, []);

  return { qotd, loading };
}