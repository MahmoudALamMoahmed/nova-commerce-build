-- Now apply the constraints since we've fixed the null values
-- For cart table: Make variant_id NOT NULL and add foreign key
ALTER TABLE public.cart 
ALTER COLUMN variant_id SET NOT NULL;

-- Add foreign key constraint for cart.variant_id
ALTER TABLE public.cart 
ADD CONSTRAINT cart_variant_id_fkey 
FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;

-- For order_items table: Make variant_id NOT NULL and add foreign key
ALTER TABLE public.order_items 
ALTER COLUMN variant_id SET NOT NULL;

-- Add foreign key constraint for order_items.variant_id
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_variant_id_fkey 
FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE RESTRICT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_variant_id ON public.cart(variant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);