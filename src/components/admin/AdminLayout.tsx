import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Tag,
  BarChart3,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, userProfile, isLoading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t('Logged out successfully'));
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('Failed to logout'));
    }
  };

  const navigation = [
    { name: t('Dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('Products'), href: '/admin/products', icon: Package },
    { name: t('Categories'), href: '/admin/categories', icon: Tag },
    { name: t('Orders'), href: '/admin/orders', icon: ShoppingCart },
    { name: t('Users'), href: '/admin/users', icon: Users },
    { name: t('Messages'), href: '/admin/messages', icon: MessageSquare },
    { name: t('Analytics'), href: '/admin/analytics', icon: BarChart3 },
    { name: t('Settings'), href: '/admin/settings', icon: Settings },
  ];

  const handleNavigationClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">{t('Admin Panel')}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start h-10 px-3",
                isRTL && "flex-row-reverse",
                isActive
                  ? "bg-brand-accent text-white hover:bg-brand-accent/90"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => handleNavigationClick(item.href)}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isRTL ? "ml-3" : "mr-3"
                )}
              />
              {item.name}
            </Button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10 px-3 text-red-600 hover:bg-red-50 hover:text-red-700",
            isRTL && "flex-row-reverse"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
          {t('Logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 flex min-h-[calc(100vh-5rem)]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden xl:block w-64 bg-white shadow-sm border-gray-200 fixed h-[calc(100vh-5rem)] top-20",
          isRTL ? "right-0 border-l" : "left-0 border-r"
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className="w-64 p-0 xl:hidden"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          "xl:ml-64",
          isRTL && "xl:mr-64 xl:ml-0"
        )}
      >
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t('Toggle menu')}</span>
                </Button>
              </SheetTrigger>

              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.href === location.pathname)?.name || t('Dashboard')}
              </h2>
            </div>
            
            <div className="text-sm text-gray-500">
              {t('Welcome')}, {user.email}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
