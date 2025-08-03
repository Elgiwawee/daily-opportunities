-- Create table for social media settings
CREATE TABLE public.social_media_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  facebook_url TEXT,
  whatsapp_url TEXT,
  twitter_url TEXT,
  tiktok_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_media_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own social media settings" 
ON public.social_media_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social media settings" 
ON public.social_media_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social media settings" 
ON public.social_media_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social media settings" 
ON public.social_media_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_social_media_settings_updated_at
BEFORE UPDATE ON public.social_media_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();