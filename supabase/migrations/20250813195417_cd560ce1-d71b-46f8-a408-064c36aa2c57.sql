-- Create a secure function to update product stock quantities
CREATE OR REPLACE FUNCTION public.update_product_stock(
  product_id_param UUID,
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
$$;