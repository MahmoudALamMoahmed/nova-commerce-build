import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useUser } from '@/context/UserContext';
import { useOrders } from '@/context/OrderContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { user } = useUser();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login if not logged in
      toast.error("Please login to complete your purchase");
      navigate('/login');
      return;
    }
    
    const newOrder = await createOrder();
    if (newOrder) {
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-24 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              {/* Cart items */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b last:border-b-0 last:pb-0 gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="text-brand-accent font-semibold mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center border rounded">
                        <button 
                          className="px-3 py-1 hover:bg-gray-100" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button 
                          className="px-3 py-1 hover:bg-gray-100" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-4">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-28">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-brand-accent hover:bg-brand-accent/90"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Secure checkout with 100% buyer protection
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
