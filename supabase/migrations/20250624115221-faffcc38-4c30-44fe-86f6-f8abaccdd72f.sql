
-- Create messages table to store contact form submissions
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admins to view messages
CREATE POLICY "Only admins can view messages" 
ON public.messages 
FOR SELECT 
TO authenticated
USING (public.is_current_user_admin());

-- Create policy to allow only admins to delete messages
CREATE POLICY "Only admins can delete messages" 
ON public.messages 
FOR DELETE 
TO authenticated
USING (public.is_current_user_admin());

-- Create policy to allow anyone (including anonymous users) to insert messages
-- This is needed for the contact form to work for non-authenticated users
CREATE POLICY "Anyone can submit messages" 
ON public.messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);
