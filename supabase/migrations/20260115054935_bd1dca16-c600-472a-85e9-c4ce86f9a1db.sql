-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create updated SELECT policy that allows admins to view all roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));