-- Fix function search path security issues by setting search_path
-- Update existing functions to have immutable search paths

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  );
$function$;

-- Fix is_current_user_admin function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()),
    false
  );
$function$;

-- Fix update_product_stock function
CREATE OR REPLACE FUNCTION public.update_product_stock(product_id_param uuid, quantity_to_reduce integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  current_stock INTEGER;
  new_stock INTEGER;
BEGIN
  -- Get current stock quantity
  SELECT stock_quantity INTO current_stock
  FROM products
  WHERE id = product_id_param;
  
  -- Check if product exists
  IF current_stock IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new stock (ensure it doesn't go below 0)
  new_stock := GREATEST(0, current_stock - quantity_to_reduce);
  
  -- Update the stock quantity
  UPDATE products
  SET stock_quantity = new_stock
  WHERE id = product_id_param;
  
  RETURN TRUE;
END;
$function$;

-- Fix update_product_variant_stock function
CREATE OR REPLACE FUNCTION public.update_product_variant_stock(
  variant_id_param UUID,
  quantity_to_reduce INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock INTEGER;
  new_stock INTEGER;
BEGIN
  -- Get current stock quantity
  SELECT stock_quantity INTO current_stock
  FROM product_variants
  WHERE id = variant_id_param;
  
  -- Check if variant exists
  IF current_stock IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new stock (ensure it doesn't go below 0)
  new_stock := GREATEST(0, current_stock - quantity_to_reduce);
  
  -- Update the stock quantity
  UPDATE product_variants
  SET stock_quantity = new_stock
  WHERE id = variant_id_param;
  
  RETURN TRUE;
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, is_admin)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$function$;