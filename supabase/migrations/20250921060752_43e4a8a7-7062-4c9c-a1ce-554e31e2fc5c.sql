-- Create storage policies for product variant images
CREATE POLICY "Allow authenticated users to upload variant images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'product-variants'
);

CREATE POLICY "Allow authenticated users to update variant images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'product-variants'
);

CREATE POLICY "Allow authenticated users to delete variant images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'product-variants'
);