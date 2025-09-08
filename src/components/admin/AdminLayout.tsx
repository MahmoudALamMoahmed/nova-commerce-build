import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom"
import { useUser } from "@/context/UserContext"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import {
  SidebarInset,
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface AdminLayoutProps {
  children?: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, userProfile, isLoading } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"
  const isMobile = useIsMobile()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
      </div>
    )
  }

  if (!user || !userProfile?.is_admin) {
    return <Navigate to="/" replace />
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success(t("Logged out successfully"))
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(t("Failed to logout"))
    }
  }

  const navigation = [
    { name: t("Dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("Products"), href: "/admin/products", icon: Package },
    { name: t("Categories"), href: "/admin/categories", icon: Tag },
    { name: t("Orders"), href: "/admin/orders", icon: ShoppingCart },
    { name: t("Users"), href: "/admin/users", icon: Users },
    { name: t("Messages"), href: "/admin/messages", icon: MessageSquare },
    { name: t("Analytics"), href: "/admin/analytics", icon: BarChart3 },
    { name: t("Settings"), href: "/admin/settings", icon: Settings },
  ]

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "260px",
          "--header-height": "56px",
        } as React.CSSProperties
      }
    >
      {/* Sidebar */}
      <Sidebar side={isRTL ? "right" : "left"}>
        <SidebarHeader>
          <h1 className="px-4 py-3 font-bold text-lg">{t("Admin Panel")}</h1>
        </SidebarHeader>
        <SidebarContent>
          <nav className="flex flex-col gap-1 p-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
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
                  onClick={() => navigate(item.href)}
                >
                  <Icon className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 px-3 text-red-600 hover:bg-red-50 hover:text-red-700",
              isRTL && "flex-row-reverse"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
            {t("Logout")}
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Main content with header */}
      <SidebarInset>
        <header className="h-[var(--header-height)] bg-white border-b px-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {navigation.find((item) => item.href === location.pathname)?.name ||
              t("Dashboard")}
          </h2>
          <div className="text-sm text-gray-500">
            {t("Welcome")}, {user.email}
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          {children || <Outlet />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
