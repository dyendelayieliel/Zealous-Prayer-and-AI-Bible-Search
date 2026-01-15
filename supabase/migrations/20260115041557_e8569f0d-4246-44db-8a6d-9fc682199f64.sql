-- Add user_id column to prayer_requests for tracking user submissions
ALTER TABLE public.prayer_requests 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies to allow authenticated users to see their own requests

-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "No public read access to prayer requests" ON public.prayer_requests;

-- Create new SELECT policy: users can view their own prayer requests
CREATE POLICY "Users can view their own prayer requests"
  ON public.prayer_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Update INSERT policy to allow setting user_id
DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON public.prayer_requests;

CREATE POLICY "Anyone can submit prayer requests"
  ON public.prayer_requests
  FOR INSERT
  WITH CHECK (
    -- Allow anonymous submissions (user_id is null)
    -- OR authenticated user submitting with their own user_id
    (user_id IS NULL) OR (auth.uid() = user_id)
  );