
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { X, User, Mail, Phone, MapPin, CreditCard, Banknote } from 'lucide-react';

interface OrderDetailsModalProps {
  order: {
    id: string;
    user_id: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
    total_price?: number;
    payment_method?: string;
    created_at: string;
    user_email: string;
    addresses?: {
      full_name: string;
      street: string;
      city: string;
      postal_code: string;
      phone_number: string;
    };
    order_items?: {
      id: string;
      quantity: number;
      price: number;
      products: {
        title: string;
        image?: string;
      } | null;
    }[];
  };
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const OrderDetailsModal = ({ order, onClose, onStatusUpdate }: OrderDetailsModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'online':
        return 'Card';
      default:
        return 'Cash';
    }
  };

  const subtotal = order.order_items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = 5.99;
  const total = subtotal + tax + deliveryFee;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex">
          {/* Left Side - Order Information */}
          <div className="w-1/2 p-6 border-r">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Order Details</h1>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Order Information */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">#{order.id.slice(0, 8).padStart(10, '0')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Select
                    value={order.status}
                    onValueChange={(value) => onStatusUpdate(order.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{format(new Date(order.created_at), 'M/d/yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{getPaymentMethodDisplay(order.payment_method || 'cash')}</span>
              </div>
            </div>

            {/* Customer Information */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{order.addresses?.full_name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.user_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{order.addresses?.phone_number || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.addresses ? (
                  <div className="text-sm">
                    <p className="font-medium">{order.addresses.full_name}</p>
                    <p>{order.addresses.street}</p>
                    <p>{order.addresses.city}</p>
                    <p className="text-gray-600">Phone: {order.addresses.phone_number}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No delivery address provided</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Order Items & Summary */}
          <div className="w-1/2 p-6">
            <h2 className="text-xl font-bold mb-6">Order Items</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-8">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    {item.products?.image && (
                      <img 
                        src={item.products.image} 
                        alt={item.products.title} 
                        className="h-16 w-16 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.products?.title || 'Unknown Product'}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found for this order</p>
              )}
            </div>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-orange-600">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
