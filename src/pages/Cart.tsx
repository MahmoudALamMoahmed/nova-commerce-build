
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useOrders } from '@/context/OrderContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, isLoading } = useCart();
  const { user } = useUser();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to complete your purchase");
      navigate('/login');
      return;
    }
    
    setIsCreatingOrder(true);
    const success = await createOrder();
    setIsCreatingOrder(false);
    
    if (success) {
      navigate('/orders');
    }
  };

  const confirmRemoveFromCart = (itemId: string) => {
    setItemToRemove(itemId);
  };

  const handleRemoveConfirmed = async () => {
    if (itemToRemove) {
      await removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setItemToRemove(null);
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto py-24 px-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-medium mb-4">Please log in to view your cart</h2>
          <p className="text-muted-foreground mb-8">You need to be logged in to access your shopping cart.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 px-4">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
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
                      onClick={() => confirmRemoveFromCart(item.id)}
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
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Secure checkout with 100% buyer protection
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Removal confirmation dialog */}
      <AlertDialog open={itemToRemove !== null} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from the cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelRemove}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveConfirmed}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cart;
