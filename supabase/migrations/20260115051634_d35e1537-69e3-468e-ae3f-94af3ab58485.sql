-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
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

-- RLS policy for user_roles: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Drop existing restrictive policies on prayer_requests
DROP POLICY IF EXISTS "Users can view their own prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "No public update access to prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "No public delete access to prayer requests" ON public.prayer_requests;

-- New SELECT policy: users see their own, admins see all
CREATE POLICY "Users can view own prayers, admins can view all"
ON public.prayer_requests
FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin')
);

-- New UPDATE policy: admins can update any prayer request
CREATE POLICY "Admins can update prayer requests"
ON public.prayer_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- New DELETE policy: admins can delete any prayer request
CREATE POLICY "Admins can delete prayer requests"
ON public.prayer_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));