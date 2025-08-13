import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  topProduct: string;
}

const Admin = () => {
  const { user, userProfile, isLoading } = useUser();
  const [stats, setStats] = useState<Stats>({ 
    totalProducts: 0, 
    totalUsers: 0, 
    totalOrders: 0, 
    totalRevenue: 0, 
    totalProductsSold: 0, 
    topProduct: 'Loading...' 
  });

  // Check if user is admin
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!user || !userProfile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  const fetchStats = async () => {
    try {
      const [productsRes, usersRes, ordersRes, orderItemsRes, revenueRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('order_items').select('quantity, product_id, products(title)'),
        supabase.from('orders').select('total_price')
      ]);

      // Calculate total revenue
      const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + Number(order.total_price || 0), 0) || 0;

      // Calculate total products sold
      const totalProductsSold = orderItemsRes.data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      // Calculate top product
      const productCounts: { [key: string]: { name: string; count: number } } = {};
      orderItemsRes.data?.forEach(item => {
        const productName = item.products?.title || 'Unknown';
        if (productCounts[productName]) {
          productCounts[productName].count += item.quantity || 0;
        } else {
          productCounts[productName] = { name: productName, count: item.quantity || 0 };
        }
      });

      const topProduct = Object.values(productCounts).length > 0 
        ? Object.values(productCounts).reduce((max, current) => max.count > current.count ? max : current).name
        : 'No sales yet';

      setStats({
        totalProducts: productsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue,
        totalProductsSold,
        topProduct
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your store and view statistics</p>
      </div>

      {/* Overview Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Live from database</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Live from database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Live from database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductsSold}</div>
            <p className="text-xs text-muted-foreground">Live from database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Product</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topProduct}</div>
            <p className="text-xs text-muted-foreground">Most ordered product</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;