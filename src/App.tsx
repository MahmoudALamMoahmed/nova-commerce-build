
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { UserProvider } from "./context/UserContext";
import { OrderProvider } from "./context/OrderContext";
import Favorites from "./pages/Favorites";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrderProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Main website routes */}
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/products" element={<Layout><Products /></Layout>} />
                  <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
                  <Route path="/cart" element={<Layout><Cart /></Layout>} />
                  <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/contact" element={<Layout><Contact /></Layout>} />
                  <Route path="/login" element={<Layout><Login /></Layout>} />
                  <Route path="/register" element={<Layout><Register /></Layout>} />
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                  <Route path="/orders" element={<Layout><Orders /></Layout>} />
                  
                  {/* Admin routes with separate layout */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </TooltipProvider>
            </OrderProvider>
          </FavoritesProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
