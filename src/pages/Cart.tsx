
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout!');
    // In a real app, we would navigate to checkout page or process
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-brand-accent hover:bg-brand-accent/90">
                Browse Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Takes 2/3 of space on large screens */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-32 h-32">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="flex justify-between mb-2">
                          <Link to={`/products/${item.id}`} className="text-lg font-medium hover:text-brand-accent transition-colors">
                            {item.name}
                          </Link>
                          <span className="text-brand-accent font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 px-2"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-8 px-2"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary - Takes 1/3 of space on large screens */}
          <div>
            <Card className="sticky top-24 shadow-md border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({totalItems}):</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mb-6">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-brand-accent">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-brand-accent hover:bg-brand-accent/90"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
