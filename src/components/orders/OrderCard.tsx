import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Package, CreditCard, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/context/OrderContext';
import { OrderStatus } from './OrderStatus';
import { PaymentMethod } from './PaymentMethod';

interface OrderCardProps {
  order: Order;
  onShowDetails: (order: Order) => void;
}

export const OrderCard = ({ order, onShowDetails }: OrderCardProps) => {
  const totalItems = order.order_items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(order.created_at), 'MMM d, yyyy')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              ${order.total_price?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <OrderStatus status={order.status} />
        </div>

        {/* Order Preview */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
              <Package className="h-4 w-4" />
              Items ({order.order_items.length})
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {order.order_items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted border overflow-hidden">
                  {item.products?.image ? (
                    <img 
                      src={item.products.image} 
                      alt={item.products.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {order.order_items.length > 3 && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted border flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    +{order.order_items.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Payment
            </div>
            <PaymentMethod method={order.payment_method || 'cash'} compact />
          </div>
          
          {order.addresses && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Delivery
              </div>
              <div className="text-sm text-foreground">
                {order.addresses.city}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowDetails(order)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Show Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};