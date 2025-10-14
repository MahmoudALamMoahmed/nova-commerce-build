import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';
const BottomNavbar = () => {
  const location = useLocation();
  const {
    t
  } = useTranslation();
  const {
    cartItems
  } = useCart();
  const {
    favorites
  } = useFavorites();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = [{
    label: t('Home'),
    href: '/',
    icon: Home
  }, {
    label: t('Products'),
    href: '/products',
    icon: ShoppingBag
  }, {
    label: t('Cart'),
    href: '/cart',
    icon: ShoppingCart,
    badge: totalItems > 0 ? totalItems : null
  }, {
    label: t('Favorites'),
    href: '/favorites',
    icon: Heart,
    badge: favorites.length > 0 ? favorites.length : null
  }];
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map(item => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return <Link key={item.href} to={item.href} className={cn("flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
              <div className="relative">
                <Icon className={cn("h-5 w-5 mb-1", active && "text-primary")} />
                {item.badge && <span className="absolute -top-2 -right-2 bg-brand-accent text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[1rem]">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>}
              </div>
              <span className={cn("text-xs font-medium text-center leading-tight", active ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </Link>;
      })}
      </div>
    </nav>;
};
export default BottomNavbar;