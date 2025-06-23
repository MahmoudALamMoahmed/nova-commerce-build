
-- Fix the infinite recursion issue in RLS policies
-- First, drop ALL existing policies on the users table
DROP POLICY IF EXISTS "Users can view own profile, admins can view all" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile, admins can update any" ON public.users;
DROP POLICY IF EXISTS "Only admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Only admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

-- Drop the existing problematic function if it exists
DROP FUNCTION IF EXISTS public.is_current_user_admin();

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()),
    false
  );
$$;

-- Create non-recursive RLS policies using the security definer function
-- Allow users to view their own profile and admins to view all profiles
CREATE POLICY "users_select_policy" 
ON public.users 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = id OR public.is_current_user_admin()
);

-- Allow users to update their own profile and admins to update any profile
CREATE POLICY "users_update_policy" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = id OR public.is_current_user_admin()
);

-- Allow only admins to insert new users
CREATE POLICY "users_insert_policy" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_current_user_admin());

-- Allow only admins to delete users (except themselves)
CREATE POLICY "users_delete_policy" 
ON public.users 
FOR DELETE 
TO authenticated
USING (
  public.is_current_user_admin() AND id != auth.uid()
);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
