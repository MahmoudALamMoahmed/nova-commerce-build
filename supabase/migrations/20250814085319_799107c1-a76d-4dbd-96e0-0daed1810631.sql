-- Create product_variants table for color and size options
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, color, size)
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_variants
CREATE POLICY "Anyone can view product variants" 
ON public.product_variants 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert product variants" 
ON public.product_variants 
FOR INSERT 
WITH CHECK (is_current_user_admin());

CREATE POLICY "Only admins can update product variants" 
ON public.product_variants 
FOR UPDATE 
USING (is_current_user_admin());

CREATE POLICY "Only admins can delete product variants" 
ON public.product_variants 
FOR DELETE 
USING (is_current_user_admin());

-- Create function to update product variant stock
CREATE OR REPLACE FUNCTION public.update_product_variant_stock(
  variant_id_param UUID,
  quantity_to_reduce INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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