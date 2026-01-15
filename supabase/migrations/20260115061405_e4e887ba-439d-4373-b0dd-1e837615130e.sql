-- Add INSERT policy for prayer_contact_info table
-- Allows anyone to insert contact info when submitting a prayer request
CREATE POLICY "Anyone can submit contact info" 
ON public.prayer_contact_info 
FOR INSERT 
WITH CHECK (true);