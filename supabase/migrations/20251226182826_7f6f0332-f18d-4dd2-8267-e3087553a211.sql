-- Add quote_of_the_day table to track the daily quote
CREATE TABLE public.quote_of_the_day (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes_cache(id),
  quote text NOT NULL,
  author text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_of_the_day ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read quote of the day
CREATE POLICY "Anyone can read quote of the day" 
ON public.quote_of_the_day 
FOR SELECT 
USING (true);