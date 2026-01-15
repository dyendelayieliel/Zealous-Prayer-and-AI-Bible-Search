-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view own prayers, admins can view all" ON public.prayer_requests;

-- Create updated SELECT policy that protects anonymous prayers
CREATE POLICY "Users can view own prayers, admins can view all" 
ON public.prayer_requests 
FOR SELECT 
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id) OR 
  (user_id IS NULL AND has_role(auth.uid(), 'admin'::app_role)) OR 
  has_role(auth.uid(), 'admin'::app_role)
);