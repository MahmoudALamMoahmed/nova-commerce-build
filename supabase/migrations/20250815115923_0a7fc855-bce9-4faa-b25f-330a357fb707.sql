-- First, let's handle existing data by creating default variants for products that don't have any
-- We'll create a default variant for each product that doesn't have variants yet

-- For products without variants, create a default variant
INSERT INTO public.product_variants (product_id, color, size, price, stock_quantity, image)
SELECT 
  p.id as product_id,
  'Default' as color,
  'One Size' as size,
  p.price,
  p.stock_quantity,
  p.image
FROM public.products p
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id
);

-- Update cart items that have null variant_id to use the first available variant for their product
UPDATE public.cart 
SET variant_id = (
  SELECT pv.id 
  FROM public.product_variants pv 
  WHERE pv.product_id = cart.product_id 
  LIMIT 1
)
WHERE variant_id IS NULL;

-- Update order_items that have null variant_id to use the first available variant for their product
UPDATE public.order_items 
SET variant_id = (
  SELECT pv.id 
  FROM public.product_variants pv 
  WHERE pv.product_id = order_items.product_id 
  LIMIT 1
)
WHERE variant_id IS NULL;