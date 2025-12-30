-- GitHub Stats Cache Table
CREATE TABLE IF NOT EXISTS public.github_stats_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  stats_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
);

-- Quotes Cache Table  
CREATE TABLE IF NOT EXISTS public.quotes_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.github_stats_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for caching (Service Role will bypass, but functions might use anon key if not careful, 
-- though functions usually use service role key for DB ops. 
-- However, the user asked for "Allow public access" policies in the prompt)

CREATE POLICY "Allow public access" ON public.github_stats_cache
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access" ON public.quotes_cache
  FOR ALL USING (true) WITH CHECK (true);

-- Cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM public.github_stats_cache WHERE expires_at < now();
END;
$$;
