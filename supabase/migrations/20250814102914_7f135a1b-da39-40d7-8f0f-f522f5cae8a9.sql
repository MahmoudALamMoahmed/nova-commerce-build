-- Add missing foreign key relationship for product_variants to products
ALTER TABLE public.product_variants 
ADD CONSTRAINT product_variants_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);