-- Create gitstats schema
CREATE SCHEMA IF NOT EXISTS gitstats;

-- GitHub Stats Cache Table
CREATE TABLE IF NOT EXISTS gitstats.github_stats_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  stats_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
);

-- Quotes Cache Table  
CREATE TABLE IF NOT EXISTS gitstats.quotes_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE gitstats.github_stats_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE gitstats.quotes_cache ENABLE ROW LEVEL SECURITY;

-- Allow public access for caching
CREATE POLICY "Allow public access" ON gitstats.github_stats_cache
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access" ON gitstats.quotes_cache
  FOR ALL USING (true) WITH CHECK (true);

-- Cleanup function
CREATE OR REPLACE FUNCTION gitstats.cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = gitstats
AS $$
BEGIN
  DELETE FROM gitstats.github_stats_cache WHERE expires_at < now();
END;
$$;
