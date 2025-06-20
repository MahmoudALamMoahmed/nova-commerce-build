
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

const AdminOrders = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Orders Management</h3>
            <p className="text-gray-500">Order management functionality coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
