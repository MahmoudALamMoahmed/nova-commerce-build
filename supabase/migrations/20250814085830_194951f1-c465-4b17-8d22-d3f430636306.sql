-- Add variant support to cart table
ALTER TABLE public.cart ADD COLUMN variant_id UUID;
ALTER TABLE public.cart ADD COLUMN color TEXT;
ALTER TABLE public.cart ADD COLUMN size TEXT;

-- Update cart unique constraint to include variant
DROP INDEX IF EXISTS cart_user_product_unique;
CREATE UNIQUE INDEX cart_user_product_variant_unique ON public.cart(user_id, product_id, variant_id) 
WHERE variant_id IS NOT NULL;

CREATE UNIQUE INDEX cart_user_product_unique ON public.cart(user_id, product_id) 
WHERE variant_id IS NULL;