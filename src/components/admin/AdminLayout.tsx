// AdminLayout.tsx
import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// ✅ AppSidebar Component
function AppSidebar({ navigation, onNavigate, onLogout, location, isRTL }: any) {
  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item: any) => {
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
              onClick={() => onNavigate(item.href)}
            >
              <Icon className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
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
          onClick={onLogout}
        >
          <LogOut className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
          Logout
        </Button>
      </div>
    </div>
  );
}

// ✅ SiteHeader Component
function SiteHeader({ title, email, isRTL }: any) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-500">Welcome, {email}</div>
      </div>
    </header>
  );
}

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, userProfile, isLoading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [_, setOpen] = useState(false);

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
      toast.success(t("Logged out successfully"));
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("Failed to logout"));
    }
  };

  const navigation = [
    { name: t("Dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("Products"), href: "/admin/products", icon: Package },
    { name: t("Categories"), href: "/admin/categories", icon: Tag },
    { name: t("Orders"), href: "/admin/orders", icon: ShoppingCart },
    { name: t("Users"), href: "/admin/users", icon: Users },
    { name: t("Messages"), href: "/admin/messages", icon: MessageSquare },
    { name: t("Analytics"), href: "/admin/analytics", icon: BarChart3 },
    { name: t("Settings"), href: "/admin/settings", icon: Settings },
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem", // 64 Tailwind = 16rem
          "--header-height": "3.5rem", // تقريبا h-14
        } as React.CSSProperties
      }
    >
      <AppSidebar
        navigation={navigation}
        onNavigate={(href: string) => navigate(href)}
        onLogout={handleLogout}
        location={location}
        isRTL={isRTL}
      />
      <SidebarInset>
        <SiteHeader
          title={
            navigation.find((item) => item.href === location.pathname)?.name ||
            t("Dashboard")
          }
          email={user.email}
          isRTL={isRTL}
        />
        <div className="flex flex-1 flex-col p-4 lg:p-6 overflow-auto">
          {children || <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
