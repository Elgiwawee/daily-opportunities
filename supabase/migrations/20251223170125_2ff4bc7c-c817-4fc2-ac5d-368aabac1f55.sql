-- Fix: Restrict blog_likes SELECT access to prevent user activity tracking exposure
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view blog likes" ON public.blog_likes;

-- Create a more restrictive policy: users can only view their own likes
CREATE POLICY "Users can view their own likes" 
ON public.blog_likes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: Like counts can still be computed using COUNT aggregates in queries
-- The application code should use aggregate functions rather than exposing individual like records