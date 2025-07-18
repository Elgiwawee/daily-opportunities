-- Enable Row Level Security on news_items table
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to news items
CREATE POLICY "Anyone can view news items" 
ON public.news_items 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert news items
CREATE POLICY "Authenticated users can create news items" 
ON public.news_items 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to update their own news items
CREATE POLICY "Authenticated users can update news items" 
ON public.news_items 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to delete their own news items
CREATE POLICY "Authenticated users can delete news items" 
ON public.news_items 
FOR DELETE 
USING (auth.uid() IS NOT NULL);