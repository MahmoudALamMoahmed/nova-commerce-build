
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Package, MapPin, User, Calendar, DollarSign, CreditCard, Banknote } from 'lucide-react';

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
        return (
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-green-600" />
            <span>Cash on Delivery</span>
          </div>
        );
      case 'online':
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span>Online Payment</span>
          </div>
        );
      default:
        return <span>Not specified</span>;
    }
  };

  const totalItems = order.order_items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details #{order.id.slice(0, 8)}</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{format(new Date(order.created_at), 'PPP')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{order.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">
                      {order.total_price ? `$${order.total_price.toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-gray-500">💳</div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <div className="font-medium">
                      {getPaymentMethodDisplay(order.payment_method || 'cash')}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center gap-4">
                <span className="font-medium">Update Status:</span>
                <Select
                  value={order.status}
                  onValueChange={(value) => onStatusUpdate(order.id, value)}
                >
                  <SelectTrigger className="w-40">
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
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.addresses ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{order.addresses.full_name}</p>
                  <p className="text-gray-600">{order.addresses.street}</p>
                  <p className="text-gray-600">{order.addresses.city}, {order.addresses.postal_code}</p>
                  <p className="text-gray-600">{order.addresses.phone_number}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({totalItems} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {item.products?.image && (
                        <img 
                          src={item.products.image} 
                          alt={item.products.title} 
                          className="h-16 w-16 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {item.products?.title || 'Unknown Product'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items found for this order</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
