-- Drop the old unique constraint that prevents adding same product with different variants
ALTER TABLE cart DROP CONSTRAINT cart_user_id_product_id_key;

-- Add new unique constraint based on user_id and variant_id
ALTER TABLE cart ADD CONSTRAINT cart_user_id_variant_id_key UNIQUE (user_id, variant_id);