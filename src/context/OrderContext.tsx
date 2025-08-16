
import { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  quantity: number;
  price: number;
  created_at: string;
  products?: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
  product_variants?: {
    id: string;
    color: string;
    size: string;
    image?: string;
    products?: {
      id: string;
      title: string;
      price: number;
      image?: string;
    };
  };
}

export interface Order {
  id: string;
  user_id: string;
  address_id?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  total_price?: number;
  payment_method?: string;
  created_at: string;
  order_items?: OrderItem[];
  addresses?: {
    id: string;
    full_name: string;
    street: string;
    city: string;
    postal_code: string;
    phone_number: string;
  };
}

interface OrderContextType {
  orders: Order[];
  createOrder: (addressId: string, paymentMethod?: string) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();

  // Fetch orders when user logs in
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          address_id,
          status,
          total_price,
          payment_method,
          created_at,
          addresses (
            id,
            full_name,
            street,
            city,
            postal_code,
            phone_number
          ),
          order_items (
            id,
            order_id,
            product_id,
            variant_id,
            quantity,
            price,
            created_at,
            products (
              id,
              title,
              price,
              image
            ),
            product_variants (
              id,
              color,
              size,
              image,
              products (
                id,
                title,
                price,
                image
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        return;
      }

      // Type assertion to ensure status is properly typed
      const typedOrders = (data || []).map(order => ({
        ...order,
        status: order.status as 'pending' | 'confirmed' | 'shipped' | 'cancelled'
      }));

      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (addressId: string, paymentMethod: string = 'cash'): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to place an order');
      return false;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    try {
      setIsLoading(true);

      // Calculate total price
      const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          address_id: addressId,
          status: 'pending',
          total_price: totalPrice,
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('Failed to place order');
        return false;
      }

      // Create order items with correct product_id and variant_id mapping
      // Note: cart items have id = variant_id, we need to get product_id from the cart database
      const orderItems = await Promise.all(cartItems.map(async (item) => {
        // Get the product_id from cart table since cart item.id is variant_id
        const { data: cartData } = await supabase
          .from('cart')
          .select('product_id')
          .eq('user_id', user.id)
          .eq('variant_id', item.variant_id)
          .single();

        return {
          order_id: orderData.id,
          product_id: cartData?.product_id || null,
          variant_id: item.variant_id || null,
          quantity: item.quantity,
          price: item.price
        };
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast.error('Failed to place order');
        return false;
      }

      // Update stock quantities for each item
      for (const item of cartItems) {
        if (item.variant_id) {
          // Update variant stock
          const { data: updateResult, error: updateError } = await supabase
            .rpc('update_product_variant_stock', {
              variant_id_param: item.variant_id,
              quantity_to_reduce: item.quantity
            });

          if (updateError) {
            console.error('Error updating variant stock:', updateError);
          } else if (!updateResult) {
            console.error('Failed to update stock for variant:', item.variant_id);
          }
        } else {
          // Update product stock for items without variants
          const { data: updateResult, error: updateError } = await supabase
            .rpc('update_product_stock', {
              product_id_param: item.id,
              quantity_to_reduce: item.quantity
            });

          if (updateError) {
            console.error('Error updating product stock:', updateError);
          } else if (!updateResult) {
            console.error('Failed to update stock for product:', item.id);
          }
        }
      }

      // Clear cart after successful order
      await clearCart();
      
      // Refresh orders
      await fetchOrders();
      
      toast.success('Order placed successfully!');
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, fetchOrders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
