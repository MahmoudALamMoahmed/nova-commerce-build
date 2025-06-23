
-- Add RLS policies for other tables to ensure proper data access

-- Products table - allow everyone to read products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_policy" 
ON public.products 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "products_insert_policy" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "products_update_policy" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (public.is_current_user_admin());

CREATE POLICY "products_delete_policy" 
ON public.products 
FOR DELETE 
TO authenticated
USING (public.is_current_user_admin());

-- Cart table - users can only access their own cart items
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_select_policy" 
ON public.cart 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "cart_insert_policy" 
ON public.cart 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_policy" 
ON public.cart 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "cart_delete_policy" 
ON public.cart 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Orders table - users can access their own orders, admins can access all
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_policy" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id OR public.is_current_user_admin());

CREATE POLICY "orders_insert_policy" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_policy" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id OR public.is_current_user_admin());

-- Order items table - access based on order ownership
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_policy" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_current_user_admin())
  )
);

CREATE POLICY "order_items_insert_policy" 
ON public.order_items 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Favorites table - users can access their own favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_policy" 
ON public.favorites 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_policy" 
ON public.favorites 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_policy" 
ON public.favorites 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Addresses table - users can access their own addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_select_policy" 
ON public.addresses 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "addresses_insert_policy" 
ON public.addresses 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "addresses_update_policy" 
ON public.addresses 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "addresses_delete_policy" 
ON public.addresses 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);
