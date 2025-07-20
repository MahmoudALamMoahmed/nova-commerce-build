
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { UserProvider } from '@/context/UserContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AddressProvider } from '@/context/AddressContext';
import { OrderProvider } from '@/context/OrderContext';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Cart from '@/pages/Cart';
import Favorites from '@/pages/Favorites';
import Orders from '@/pages/Orders';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import Dashboard from '@/pages/admin/Dashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  document.dir = isAdminRoute ? 'ltr' : (i18n.language === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.lang = i18n.language;
}, [i18n.language]);

 useEffect(() => {
  const handleLanguageChange = () => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    document.dir = isAdminRoute ? 'ltr' : (i18n.language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.lang = i18n.language;
  };

     i18n.on('languageChanged', handleLanguageChange);
  return () => i18n.off('languageChanged', handleLanguageChange);
}, [i18n]);

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CartProvider>
            <FavoritesProvider>
              <AddressProvider>
                <OrderProvider>
                    <Routes>
                      {/* Public routes with main layout */}
                      <Route path="/" element={<Layout><Index /></Layout>} />
                      <Route path="/products" element={<Layout><Products /></Layout>} />
                      <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
                      <Route path="/about" element={<Layout><About /></Layout>} />
                      <Route path="/contact" element={<Layout><Contact /></Layout>} />
                      <Route path="/login" element={<Layout><Login /></Layout>} />
                      <Route path="/register" element={<Layout><Register /></Layout>} />
                      <Route path="/profile" element={<Layout><Profile /></Layout>} />
                      <Route path="/cart" element={<Layout><Cart /></Layout>} />
                      <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
                      <Route path="/orders" element={<Layout><Orders /></Layout>} />
                      
                      {/* Admin routes with admin layout */}
                      <Route path="/admin" element={<Layout><AdminLayout><Admin /></AdminLayout></Layout>} />
                      <Route path="/admin/dashboard" element={<Layout><AdminLayout><Dashboard /></AdminLayout></Layout>} />
                      <Route path="/admin/products" element={<Layout><AdminLayout><AdminProducts /></AdminLayout></Layout>} />
                      <Route path="/admin/categories" element={<Layout><AdminLayout><AdminCategories /></AdminLayout></Layout>} />
                      <Route path="/admin/orders" element={<Layout><AdminLayout><AdminOrders /></AdminLayout></Layout>} />
                      <Route path="/admin/users" element={<Layout><AdminLayout><AdminUsers /></AdminLayout></Layout>} />
                      <Route path="/admin/messages" element={<Layout><AdminLayout><AdminMessages /></AdminLayout></Layout>} />
                      <Route path="/admin/analytics" element={<Layout><AdminLayout><AdminAnalytics /></AdminLayout></Layout>} />
                      <Route path="/admin/settings" element={<Layout><AdminLayout><AdminSettings /></AdminLayout></Layout>} />
                      
                      {/* 404 page */}
                      <Route path="*" element={<Layout><NotFound /></Layout>} />
                    </Routes>
                  <Toaster />
                </OrderProvider>
              </AddressProvider>
            </FavoritesProvider>
          </CartProvider>
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
