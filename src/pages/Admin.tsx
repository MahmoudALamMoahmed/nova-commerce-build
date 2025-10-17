import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  topProduct: string;
}

interface SalesData {
  date: string;
  sales: number;
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
  const [salesData, setSalesData] = useState<SalesData[]>([]);

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

  const fetchSalesData = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .not('total_price', 'is', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group orders by day and sum total sales
      const salesByDay = new Map<string, number>();
      
      ordersData?.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        const currentSales = salesByDay.get(date) || 0;
        salesByDay.set(date, currentSales + Number(order.total_price));
      });

      // Convert to array and format for chart
      const chartData: SalesData[] = Array.from(salesByDay.entries())
        .map(([date, sales]) => ({
          date: new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          sales: Math.round(sales * 100) / 100 // Round to 2 decimal places
        }))
        .slice(-30); // Show last 30 days

      setSalesData(chartData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSalesData();
  }, []);

  return (
    <AdminLayout>
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

      {/* Sales Analytics Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
          <CardDescription className="text-muted-foreground">Daily sales performance over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {salesData.length === 0 ? (
              <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No sales data</h3>
                  <p className="text-sm text-muted-foreground">Sales data will appear here when orders are placed.</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-sm text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-sm text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Admin;