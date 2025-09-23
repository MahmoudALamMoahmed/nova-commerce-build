import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Navigate } from 'react-router-dom';
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
  Menu,
  Search,
  CircleUser,
  Home,
  MoreHorizontal,
  Package2,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, userProfile, isLoading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  const getCurrentPageName = () => {
    const currentNav = navigation.find(item => item.href === location.pathname);
    return currentNav?.name || t('Dashboard');
  };

  const handleToggleSidebar = () => {
    if (isMobile) return; // On mobile, we use sheet instead
    setIsCollapsed(!isCollapsed);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Desktop Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300",
          isCollapsed ? "w-14" : "w-64"
        )}>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Button
              variant="outline"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "overflow-hidden rounded-lg transition-all duration-300",
                isCollapsed ? "w-10 h-10" : "w-full justify-start"
              )}
              onClick={() => navigate('/admin')}
            >
              <Package2 className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">{t('Admin Panel')}</span>}
              <span className="sr-only">{t('Admin Panel')}</span>
            </Button>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size={isCollapsed ? "icon" : "default"}
                  className={cn(
                    "rounded-lg transition-all duration-300",
                    isCollapsed ? "w-10 h-10" : "w-full justify-start"
                  )}
                  onClick={() => navigate('/')}
                >
                  <Home className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2">{t('Home')}</span>}
                  <span className="sr-only">{t('Home')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('Home')}</TooltipContent>
            </Tooltip>
            
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Tooltip key={item.name} delayDuration={isCollapsed ? 0 : 1000}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size={isCollapsed ? "icon" : "default"}
                      className={cn(
                        "rounded-lg transition-all duration-300",
                        isCollapsed ? "w-10 h-10" : "w-full justify-start"
                      )}
                      onClick={() => navigate(item.href)}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2">{item.name}</span>}
                      <span className="sr-only">{item.name}</span>
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                </Tooltip>
              );
            })}
          </nav>
          
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">{t('Settings')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('Settings')}</TooltipContent>
            </Tooltip>
          </nav>
        </aside>

        {/* Mobile Layout */}
        <div className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300",
          isCollapsed ? "sm:pl-14" : "sm:pl-64"
        )}>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {/* Toggle Button - Mobile uses Sheet, Desktop toggles sidebar */}
            <Button 
              size="icon" 
              variant="outline" 
              className="hidden sm:flex"
              onClick={handleToggleSidebar}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">{t('Toggle Sidebar')}</span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="sm:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">{t('Toggle Menu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Button
                    variant="ghost"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    onClick={() => navigate('/admin')}
                  >
                    <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">{t('Admin Panel')}</span>
                  </Button>
                  
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                          "flex items-center gap-4 px-2.5 justify-start",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => navigate(item.href)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Button variant="ghost" onClick={() => navigate('/admin')}>
                      {t('Admin Panel')}
                    </Button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getCurrentPageName()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Search and User Menu */}
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('Search...')}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">{t('Toggle user menu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  {t('Profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  {t('Settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {t('Logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Main Content */}
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;