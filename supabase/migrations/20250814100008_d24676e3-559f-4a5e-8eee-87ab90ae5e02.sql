-- Add variant_id column to order_items table
ALTER TABLE public.order_items 
ADD COLUMN variant_id uuid REFERENCES public.product_variants(id);

-- Create index for better performance
CREATE INDEX idx_order_items_variant_id ON public.order_items(variant_id);