
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import Layout from './components/Layout';
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import NotFound from './pages/NotFound';

import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { OrderProvider } from './context/OrderContext';
import { AddressProvider } from './context/AddressContext';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <OrderProvider>
            <AddressProvider>
              <FavoritesProvider>
                <QueryClientProvider client={queryClient}>
                  <Layout>
                    <Toaster />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/profile" element={<Profile />} />

                      {/* Admin Routes */}
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                  <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
              </FavoritesProvider>
            </AddressProvider>
          </OrderProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
