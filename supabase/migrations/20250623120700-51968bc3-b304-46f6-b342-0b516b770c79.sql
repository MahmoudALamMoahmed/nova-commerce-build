
-- Add name field to users table to store user display names
ALTER TABLE public.users ADD COLUMN name text;

-- Create RLS policies for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile and admins to view all profiles
CREATE POLICY "Users can view own profile, admins can view all" 
ON public.users 
FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Allow users to update their own profile and admins to update any profile
CREATE POLICY "Users can update own profile, admins can update any" 
ON public.users 
FOR UPDATE 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Allow only admins to insert new users
CREATE POLICY "Only admins can insert users" 
ON public.users 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Allow only admins to delete users (except themselves)
CREATE POLICY "Only admins can delete users" 
ON public.users 
FOR DELETE 
USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  AND id != auth.uid()
);
