-- Add restrictive policies on user_roles table
-- Only admins can insert new role assignments
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update role assignments (and cannot update their own)
CREATE POLICY "Only admins can update roles, not their own"
ON public.user_roles
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') 
  AND user_id != auth.uid()
);

-- Only admins can delete role assignments (and cannot delete their own)
CREATE POLICY "Only admins can delete roles, not their own"
ON public.user_roles
FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin') 
  AND user_id != auth.uid()
);