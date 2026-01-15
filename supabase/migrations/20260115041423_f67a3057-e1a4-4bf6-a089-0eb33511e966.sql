-- Create prayer_requests table for tracking and follow-up
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  prayer_request TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'prayed', 'followed_up')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Add comment for documentation
COMMENT ON TABLE public.prayer_requests IS 'Stores prayer requests submitted through the app for tracking and follow-up';

-- Enable Row Level Security
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert prayer requests (public submission)
CREATE POLICY "Anyone can submit prayer requests"
  ON public.prayer_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Deny all SELECT access by default (privacy protection)
-- Prayer requests contain sensitive personal information and should only be accessed
-- through admin tools or edge functions with service role key
CREATE POLICY "No public read access to prayer requests"
  ON public.prayer_requests
  FOR SELECT
  USING (false);

-- Policy: Deny all UPDATE access by default
CREATE POLICY "No public update access to prayer requests"
  ON public.prayer_requests
  FOR UPDATE
  USING (false);

-- Policy: Deny all DELETE access by default  
CREATE POLICY "No public delete access to prayer requests"
  ON public.prayer_requests
  FOR DELETE
  USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prayer_requests_updated_at
  BEFORE UPDATE ON public.prayer_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();