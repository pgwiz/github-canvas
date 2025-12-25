-- Create a table for caching GitHub stats
CREATE TABLE public.github_stats_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  stats_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
);

-- Create unique index on username for fast lookups
CREATE UNIQUE INDEX idx_github_stats_cache_username ON public.github_stats_cache(username);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_github_stats_cache_expires ON public.github_stats_cache(expires_at);

-- Enable RLS
ALTER TABLE public.github_stats_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access for cached stats
CREATE POLICY "Anyone can read cached stats"
ON public.github_stats_cache
FOR SELECT
USING (true);

-- Create a function to clean up expired cache entries
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.github_stats_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create table for caching AI-generated quotes
CREATE TABLE public.quotes_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access for quotes
CREATE POLICY "Anyone can read quotes"
ON public.quotes_cache
FOR SELECT
USING (true);