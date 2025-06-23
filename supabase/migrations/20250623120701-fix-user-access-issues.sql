
-- Fix RLS policies that are blocking access
-- First, let's drop the problematic policies
DROP POLICY IF EXISTS "Users can view own profile, admins can view all" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile, admins can update any" ON public.users;
DROP POLICY IF EXISTS "Only admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Only admins can delete users" ON public.users;

-- Temporarily disable RLS on users table to restore functionality
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- We'll create simpler, working policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all user data (needed for admin checks)
CREATE POLICY "Allow authenticated users to read users" 
ON public.users 
FOR SELECT 
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Allow admins to update any profile (but first they need to be able to read to check if they're admin)
CREATE POLICY "Admins can update all profiles" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Allow admins to insert new users
CREATE POLICY "Admins can insert users" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Allow admins to delete users (except themselves)
CREATE POLICY "Admins can delete users" 
ON public.users 
FOR DELETE 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  AND id != auth.uid()
);
