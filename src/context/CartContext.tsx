import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './UserContext';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant_id?: string;
  color?: string;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product & { variant_id?: string; color?: string; size?: string }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Fetch cart items from Supabase when user logs in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user]);

  // Calculate totals whenever cart changes
  useEffect(() => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const itemsTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(itemsTotal);
  }, [cartItems]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          variant_id,
          color,
          size,
          product_variants (
            id,
            color,
            size,
            price,
            image,
            products (
              id,
              title,
              price,
              image
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items');
        return;
      }

      const formattedItems: CartItem[] = data?.map(item => ({
        id: item.variant_id,
        name: item.product_variants.products.title,
        price: item.product_variants.price || item.product_variants.products.price,
        image: item.product_variants.image || item.product_variants.products.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
        quantity: item.quantity,
        variant_id: item.variant_id,
        color: item.product_variants.color,
        size: item.product_variants.size
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product & { variant_id?: string; color?: string; size?: string }) => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    if (!product.variant_id) {
      toast.error('Product variant is required');
      return;
    }

    try {
      // Check if item already exists in cart using variant_id
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('variant_id', product.variant_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing cart item:', checkError);
        toast.error('Failed to add item to cart');
        return;
      }

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart item:', updateError);
          toast.error('Failed to update cart');
          return;
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart')
          .insert({
            user_id: user.id,
            product_id: product.id,
            variant_id: product.variant_id,
            color: product.color || null,
            size: product.size || null,
            quantity: 1
          });

        if (insertError) {
          console.error('Error adding to cart:', insertError);
          toast.error('Failed to add item to cart');
          return;
        }
      }

      // Refresh cart items
      await fetchCartItems();
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      // Remove cart item by variant_id (itemId is now variant_id)
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)
        .eq('variant_id', itemId);

      if (error) {
        console.error('Error removing from cart:', error);
        toast.error('Failed to remove item from cart');
        return;
      }

      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      // Update cart item by variant_id (itemId is now variant_id)
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('variant_id', itemId);

      if (error) {
        console.error('Error updating quantity:', error);
        toast.error('Failed to update quantity');
        return;
      }

      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
        return;
      }

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};