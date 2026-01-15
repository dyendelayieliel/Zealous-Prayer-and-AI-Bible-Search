-- Fix the SELECT policy to ensure only admins can view anonymous prayers
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can view own prayers, admins can view all" ON public.prayer_requests;

-- Create a cleaner, more secure policy
-- Users can only see their own prayers (where user_id matches auth.uid())
-- Admins can see all prayers (including anonymous ones)
CREATE POLICY "Users can view own prayers, admins can view all"
ON public.prayer_requests
FOR SELECT
USING (
  -- Authenticated users can only see their own prayers (user_id must match)
  (user_id IS NOT NULL AND auth.uid() = user_id)
  -- Admins can see everything (including anonymous prayers)
  OR has_role(auth.uid(), 'admin'::app_role)
);