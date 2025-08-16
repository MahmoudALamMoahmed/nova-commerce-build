-- Fix order_items table to allow nullable product_id and variant_id
-- This allows orders to work with both regular products and product variants

ALTER TABLE order_items 
ALTER COLUMN product_id DROP NOT NULL,
ALTER COLUMN variant_id DROP NOT NULL;