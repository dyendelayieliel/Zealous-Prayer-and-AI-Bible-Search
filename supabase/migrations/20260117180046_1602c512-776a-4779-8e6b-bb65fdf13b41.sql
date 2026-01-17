-- Strengthen the INSERT policy to prevent authenticated users from submitting anonymously
-- and prevent any possibility of user_id impersonation

-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON public.prayer_requests;

-- Create a stronger policy that enforces:
-- 1. Anonymous users (no auth) can ONLY submit with user_id = NULL
-- 2. Authenticated users MUST submit with user_id = their own auth.uid()
CREATE POLICY "Anyone can submit prayer requests"
ON public.prayer_requests
FOR INSERT
WITH CHECK (
  -- If no authenticated user (anonymous), user_id must be NULL
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  -- If authenticated, user_id must match auth.uid()
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);