import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Package } from 'lucide-react';
import { Order } from '@/context/OrderContext';
import { OrderStatus } from './OrderStatus';
import { PaymentMethod } from './PaymentMethod';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react'; // ✅ أضف دي

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  const { t } = useTranslation();

   // ✅ أضف الكود ده هنا
  useEffect(() => {
    if (order) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [order]);
  
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('orders.orderDetails')} #{order.id.slice(0, 8).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-r from-muted/50 to-muted rounded-lg border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('orders.orderDate')}</p>
              <p className="font-semibold">{format(new Date(order.created_at), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('orders.status')}</p>
              <OrderStatus status={order.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('orders.paymentMethod')}</p>
              <div className="font-medium">
                <PaymentMethod method={order.payment_method || 'cash'} />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('orders.totalAmount')}</p>
              <p className="font-bold text-xl text-primary">
                ${order.total_price?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          {order.addresses && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('orders.deliveryAddress')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-muted p-4 rounded-lg border">
                  <p className="font-semibold text-foreground">{order.addresses.full_name}</p>
                  <p className="text-muted-foreground mt-1">{order.addresses.street}</p>
                  <p className="text-muted-foreground">{order.addresses.city}, {order.addresses.postal_code}</p>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2">
                    <span className="font-medium">{t('orders.phone')}:</span> {order.addresses.phone_number}
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
                {t('orders.orderItems')} ({order.order_items?.length || 0} {t('orders.items')})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {order.order_items?.map((item: any) => {
                  // Get product info from either direct product or variant's product
                  const product = item.products || item.product_variants?.products;
                  const productImage = item.product_variants?.image || product?.image;
                  const productTitle = product?.title || 'Unknown Product';
                  
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-muted">
                      {productImage ? (
                        <img 
                          src={productImage} 
                          alt={productTitle} 
                          className="h-16 w-16 rounded-lg object-cover border-2 border-background shadow-sm"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-background flex items-center justify-center border-2 border-background shadow-sm">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{productTitle}</h4>
                        {item.product_variants && (
                          <p className="text-xs text-muted-foreground">
                            {t('orders.color')}: {item.product_variants.color} • {t('orders.size')}: {item.product_variants.size}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          ${item.price.toFixed(2)} × {item.quantity} {item.quantity > 1 ? t('orders.items') : t('orders.item')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};