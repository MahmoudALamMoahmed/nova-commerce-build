
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useOrders } from '@/context/OrderContext';
import { format } from 'date-fns';
import { CreditCard, Banknote, Eye, Package, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const Orders = () => {
  const { user } = useUser();
  const { orders, isLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
              <Button asChild>
                <a href="/products">Start Shopping</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const totalItems = order.order_items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
              
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.created_at), 'PPP')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        {order.total_price && (
                          <p className="text-lg font-semibold">${order.total_price.toFixed(2)}</p>
                        )}
                        <p className="text-sm text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Payment Method */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Payment:</span>
                        <div className="text-sm">
                          {getPaymentMethodDisplay(order.payment_method || 'cash')}
                        </div>
                      </div>

                      {/* Delivery Address Preview */}
                      {order.addresses && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">
                            {order.addresses.city}, {order.addresses.postal_code}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                          {order.order_items.slice(0, 3).map((item, index) => (
                            <div key={item.id} className="relative">
                              {item.products?.image ? (
                                <img 
                                  src={item.products.image} 
                                  alt={item.products.title} 
                                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium">
                              +{order.order_items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.order_items.slice(0, 2).map(item => item.products?.title).join(', ')}
                          {order.order_items.length > 2 && ` and ${order.order_items.length - 2} more`}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details #{selectedOrder.id.slice(0, 8)}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{format(new Date(selectedOrder.created_at), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <div className="text-sm">
                      {getPaymentMethodDisplay(selectedOrder.payment_method || 'cash')}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold text-lg">
                      {selectedOrder.total_price ? `$${selectedOrder.total_price.toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.addresses && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p className="font-medium">{selectedOrder.addresses.full_name}</p>
                        <p>{selectedOrder.addresses.street}</p>
                        <p>{selectedOrder.addresses.city}, {selectedOrder.addresses.postal_code}</p>
                        <p className="text-gray-600">Phone: {selectedOrder.addresses.phone_number}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          {item.products?.image && (
                            <img 
                              src={item.products.image} 
                              alt={item.products.title} 
                              className="h-16 w-16 rounded object-cover"
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Orders;
