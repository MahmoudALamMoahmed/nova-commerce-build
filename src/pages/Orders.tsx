
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useOrders } from '@/context/OrderContext';
import { format } from 'date-fns';
import { CreditCard, Banknote, Eye, Package, MapPin, Calendar, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
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
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Calendar className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'cancelled':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            </div>
            <p className="text-gray-600">Track and manage your order history</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {orders.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No Orders Yet</h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                  You haven't placed any orders yet. Start exploring our products and make your first purchase!
                </p>
                <Button size="lg" asChild className="px-8">
                  <a href="/products">Start Shopping</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const totalItems = order.order_items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
                
                return (
                  <Card key={order.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0">
                      {/* Order Header */}
                      <div className="p-6 border-b bg-gradient-to-r from-white to-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </h3>
                              <Badge className={`${getStatusColor(order.status)} flex items-center gap-1.5 px-3 py-1`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ${order.total_price?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Content */}
                      <div className="p-6">
                        {/* Order Items Preview - Enhanced */}
                        {order.order_items && order.order_items.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Items Ordered
                              </h4>
                              <span className="text-sm text-gray-500">{order.order_items.length} items</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {order.order_items.slice(0, 6).map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                                  {item.products?.image ? (
                                    <img 
                                      src={item.products.image} 
                                      alt={item.products.title} 
                                      className="h-12 w-12 rounded-lg object-cover border"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center border">
                                      <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">
                                      {item.products?.title || 'Unknown Product'}
                                    </p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {order.order_items.length > 6 && (
                                <div className="flex items-center justify-center p-3 rounded-lg bg-gray-100 border border-dashed">
                                  <span className="text-sm text-gray-600 font-medium">
                                    +{order.order_items.length - 6} more items
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Payment Method */}
                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Payment Method
                            </h5>
                            <div className="p-3 rounded-lg bg-gray-50 border">
                              {getPaymentMethodDisplay(order.payment_method || 'cash')}
                            </div>
                          </div>

                          {/* Delivery Address */}
                          {order.addresses && (
                            <div className="space-y-2">
                              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Delivery Address
                              </h5>
                              <div className="p-3 rounded-lg bg-gray-50 border">
                                <p className="font-medium text-sm">{order.addresses.full_name}</p>
                                <p className="text-sm text-gray-600">{order.addresses.street}</p>
                                <p className="text-sm text-gray-600">
                                  {order.addresses.city}, {order.addresses.postal_code}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Order Details #{selectedOrder.id.slice(0, 8).toUpperCase()}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-semibold">{format(new Date(selectedOrder.created_at), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1.5 w-fit`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <div className="font-medium">
                    {getPaymentMethodDisplay(selectedOrder.payment_method || 'cash')}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="font-bold text-xl text-primary">
                    ${selectedOrder.total_price?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.addresses && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="font-semibold text-gray-900">{selectedOrder.addresses.full_name}</p>
                      <p className="text-gray-700 mt-1">{selectedOrder.addresses.street}</p>
                      <p className="text-gray-700">{selectedOrder.addresses.city}, {selectedOrder.addresses.postal_code}</p>
                      <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <span className="font-medium">Phone:</span> {selectedOrder.addresses.phone_number}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-primary" />
                    Order Items ({selectedOrder.order_items?.length || 0} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                        {item.products?.image ? (
                          <img 
                            src={item.products.image} 
                            alt={item.products.title} 
                            className="h-16 w-16 rounded-lg object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.products?.title || 'Unknown Product'}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            ${item.price.toFixed(2)} × {item.quantity} {item.quantity > 1 ? 'items' : 'item'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
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
  );
};

export default Orders;
