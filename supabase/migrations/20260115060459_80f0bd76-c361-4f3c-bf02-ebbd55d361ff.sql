-- Create a separate table for contact information with stricter access controls
CREATE TABLE public.prayer_contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on the contact info table
ALTER TABLE public.prayer_contact_info ENABLE ROW LEVEL SECURITY;

-- STRICT RLS: Only admins can view contact info, and only via explicit access
-- No SELECT policy for regular users - they cannot see any contact info
CREATE POLICY "Only admins can view contact info"
  ON public.prayer_contact_info
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only the edge function (using service role) can insert contact info
-- No INSERT policy for authenticated users - this is intentional
-- The edge function uses service role to bypass RLS

-- Admins can delete contact info when deleting prayer requests
CREATE POLICY "Admins can delete contact info"
  ON public.prayer_contact_info
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create an RPC function to get contact info with the prayer request ID
-- This adds a layer of abstraction and could be extended for audit logging
CREATE OR REPLACE FUNCTION public.get_prayer_contact_email(prayer_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact_email text;
BEGIN
  -- Only admins can retrieve contact info
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  SELECT email INTO contact_email
  FROM public.prayer_contact_info
  WHERE prayer_request_id = prayer_id;
  
  RETURN contact_email;
END;
$$;

-- Migrate existing email data from prayer_requests to prayer_contact_info
INSERT INTO public.prayer_contact_info (prayer_request_id, email, created_at)
SELECT id, email, created_at
FROM public.prayer_requests
WHERE email IS NOT NULL AND email != '';

-- Remove the email column from prayer_requests table
ALTER TABLE public.prayer_requests DROP COLUMN email;