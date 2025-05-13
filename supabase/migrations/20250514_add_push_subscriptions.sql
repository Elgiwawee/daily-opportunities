
-- Table for push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON push_subscriptions(user_id);

-- Enable RLS on push_subscriptions table
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own subscription
CREATE POLICY "Users can view their own subscriptions" 
  ON push_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy to allow users to insert their own subscription
CREATE POLICY "Users can create their own subscriptions" 
  ON push_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy to allow users to update their own subscription
CREATE POLICY "Users can update their own subscriptions" 
  ON push_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy to allow users to delete their own subscription
CREATE POLICY "Users can delete their own subscriptions" 
  ON push_subscriptions 
  FOR DELETE 
  USING (auth.uid() = user_id OR user_id IS NULL);
