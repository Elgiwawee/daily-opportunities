-- Fix 1: Enable RLS on push_subscriptions table
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Add policy for users to manage only their own push subscriptions
CREATE POLICY "Users manage own push subscriptions"
ON public.push_subscriptions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add policy for service role to manage all subscriptions (for edge functions)
CREATE POLICY "Service role can manage all subscriptions"
ON public.push_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 2: Create user roles system for admin authorization
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only service role can manage user roles (prevents privilege escalation)
CREATE POLICY "Service role manages user roles"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix 3: Update RLS policies on opportunities table to require admin role
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete own opportunities" ON public.opportunities;

CREATE POLICY "Only admins can insert opportunities"
ON public.opportunities
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update opportunities"
ON public.opportunities
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete opportunities"
ON public.opportunities
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 4: Update RLS policies on news_items table to require admin role
DROP POLICY IF EXISTS "Authenticated users can create news items" ON public.news_items;
DROP POLICY IF EXISTS "Authenticated users can update news items" ON public.news_items;
DROP POLICY IF EXISTS "Authenticated users can delete news items" ON public.news_items;

CREATE POLICY "Only admins can create news items"
ON public.news_items
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update news items"
ON public.news_items
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete news items"
ON public.news_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));