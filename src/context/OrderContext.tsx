
import { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { toast } from 'sonner';

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
}

interface OrderContextType {
  orders: Order[];
  createOrder: () => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { cartItems, totalPrice, clearCart } = useCart();

  // Load orders from localStorage on initial mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (): Promise<Order | null> => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    // Generate a random order ID
    const orderId = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'pending',
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: totalPrice
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    toast.success('Order placed successfully!');
    
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder }}>
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
