-- Remove the old policy that depends on is_admin column
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;

-- Remove the deprecated is_admin column from users table
ALTER TABLE public.users DROP COLUMN IF EXISTS is_admin;