-- Fix overly permissive INSERT policy on prayer_contact_info
-- The policy currently uses WITH CHECK (true) which is flagged as a security risk
-- We should restrict inserts to be tied to an existing prayer request

DROP POLICY IF EXISTS "Anyone can submit contact info" ON public.prayer_contact_info;

-- New policy: Allow insert only if the prayer_request_id references an existing prayer request
-- Since the edge function inserts using service role, this policy allows the function to work
-- while preventing arbitrary inserts from unauthorized clients
CREATE POLICY "Anyone can submit contact info"
ON public.prayer_contact_info
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.prayer_requests pr 
    WHERE pr.id = prayer_request_id
  )
);