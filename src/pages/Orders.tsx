
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import { useOrders } from '@/context/OrderContext';
import { ShoppingBag } from 'lucide-react';
import { Loader2 } from "lucide-react";
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { EmptyOrders } from '@/components/orders/EmptyOrders';
import { Order } from '@/context/OrderContext';

const Orders = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { orders, isLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{t('orders.title')}</h1>
            </div>
            <p className="text-muted-foreground">{t('orders.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onShowDetails={setSelectedOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default Orders;
