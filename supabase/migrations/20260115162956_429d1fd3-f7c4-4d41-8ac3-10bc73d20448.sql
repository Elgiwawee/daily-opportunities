-- Add external_links column to store multiple position links as JSON array
-- Format: [{"position": "Software Engineer", "url": "https://..."}, ...]
ALTER TABLE public.opportunities 
ADD COLUMN external_links jsonb DEFAULT '[]'::jsonb;