-- Remove the stock_quantity column from products table since we now use variants for stock tracking
ALTER TABLE public.products DROP COLUMN stock_quantity;