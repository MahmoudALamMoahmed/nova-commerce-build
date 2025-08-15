-- Apply just the NOT NULL constraints and indexes (skip existing foreign keys)
-- For cart table: Make variant_id NOT NULL
ALTER TABLE public.cart 
ALTER COLUMN variant_id SET NOT NULL;

-- Add foreign key constraint for cart.variant_id (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'cart_variant_id_fkey'
        AND table_name = 'cart'
    ) THEN
        ALTER TABLE public.cart 
        ADD CONSTRAINT cart_variant_id_fkey 
        FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- For order_items table: Make variant_id NOT NULL
ALTER TABLE public.order_items 
ALTER COLUMN variant_id SET NOT NULL;

-- Add indexes for better performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_cart_variant_id ON public.cart(variant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);