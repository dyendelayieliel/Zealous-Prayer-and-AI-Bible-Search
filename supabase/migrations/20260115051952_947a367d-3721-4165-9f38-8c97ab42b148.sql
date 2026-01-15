-- Drop and recreate the SELECT policy with explicit anonymous protection
DROP POLICY IF EXISTS "Users can view own prayers, admins can view all" ON public.prayer_requests;

-- New policy: users see only their own (non-null user_id match), admins see all
CREATE POLICY "Users can view own prayers, admins can view all"
ON public.prayer_requests
FOR SELECT
USING (
  -- Users can only see their own prayers (explicit non-null check)
  (user_id IS NOT NULL AND auth.uid() = user_id)
  -- Admins can see everything including anonymous
  OR public.has_role(auth.uid(), 'admin')
);