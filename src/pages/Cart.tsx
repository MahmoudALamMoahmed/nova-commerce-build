
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useOrders } from '@/context/OrderContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '@/components/AddressSelector';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { Separator } from '@/components/ui/separator';

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
  const { t } = useTranslation();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, isLoading } = useCart();
  const { user } = useUser();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to complete your purchase");
      navigate('/login');
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    setIsCreatingOrder(true);
    const success = await createOrder(selectedAddressId, selectedPaymentMethod);
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
          <h2 className="text-2xl font-medium mb-4">{t('cart.loginRequired')}</h2>
          <p className="text-muted-foreground mb-8">{t('cart.loginMessage')}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button>{t('nav.login')}</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">{t('nav.signup')}</Button>
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
      <h1 className="text-3xl font-bold mb-8 text-center">{t('cart.title')}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-medium mb-4">{t('cart.empty')}</h2>
          <p className="text-muted-foreground mb-8">{t('cart.emptyMessage')}</p>
          <Link to="/products">
            <Button>{t('cart.browsProducts')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Cart items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">{t('cart.cartItems')}</h2>
              <Separator className="mb-6 mx-4" />
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
                    {(item.color || item.size) && (
                      <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    )}
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
                      {t('cart.remove')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Selection */}
            <AddressSelector 
              selectedAddressId={selectedAddressId}
              onAddressSelect={setSelectedAddressId}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-28 space-y-6">
              {/* Payment Method Selection - moved to top */}
              <PaymentMethodSelector 
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={setSelectedPaymentMethod}
              />
              
              <div>
                <h2 className="text-xl font-bold mb-4">{t('cart.orderSummary')}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                    <span>{t('common.currency')}{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span>{t('cart.free')}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                    <span>{t('cart.total')}</span>
                    <span>{t('common.currency')}{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-brand-accent hover:bg-brand-accent/90"
                  onClick={handleCheckout}
                  disabled={isCreatingOrder || !selectedAddressId || !selectedPaymentMethod}
                >
                  {isCreatingOrder ? 'Processing...' : t('cart.proceedToCheckout')}
                </Button>
                
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {t('cart.secureText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Removal confirmation dialog */}
        <AlertDialog open={itemToRemove !== null} onOpenChange={() => setItemToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('cart.confirmRemove')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('cart.confirmRemoveMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelRemove}>{t('cart.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleRemoveConfirmed}
                className="bg-red-500 hover:bg-red-600"
              >
                {t('cart.continue')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default Cart;
