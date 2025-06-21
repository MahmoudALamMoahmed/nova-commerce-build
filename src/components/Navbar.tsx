
import { useState } from 'react';
import { Menu, ShoppingCart, X, Heart, User, LogOut, Package, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useUser } from '@/context/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  currentPath: string;
}

const Navbar = ({ currentPath }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, userProfile, logout } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand-DEFAULT">
            NOVA<span className="text-brand-accent">SHOP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'text-brand-accent font-semibold border-brand-accent' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'text-brand-accent font-semibold border-b-2 border-brand-accent' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'text-brand-accent font-semibold border-b-2 border-brand-accent' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'text-brand-accent font-semibold border-b-2 border-brand-accent' : ''}`}
            >
              Contact
            </Link>
            {/* Admin link for admin users */}
            {userProfile?.is_admin && (
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'text-brand-accent font-semibold border-b-2 border-brand-accent' : ''}`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Cart, Favorites, and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Favorites icon */}
            <Link to="/favorites" className="relative p-2">
              <Heart className="h-6 w-6 text-gray-700 hover:text-brand-accent transition-colors" />
              {totalFavorites > 0 && (
                <span className="absolute top-0 right-0 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Link>
            
            {/* Cart icon */}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-brand-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 relative" aria-label="User menu">
                    <User className="h-6 w-6 text-gray-700 hover:text-brand-accent transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-4 py-2 text-sm">
                    <p className="font-medium">Hello, {user.email}</p>
                    {userProfile?.is_admin && (
                      <p className="text-xs text-brand-accent mt-1">Administrator</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {userProfile?.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
            
            <button
              className="md:hidden p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-2xl font-bold text-brand-DEFAULT">
              NOVA<span className="text-brand-accent">SHOP</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-6">
            <Link 
              to="/" 
              className={`text-xl font-medium ${isActive('/') ? 'text-brand-accent font-semibold' : ''}`} 
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-xl font-medium ${isActive('/products') ? 'text-brand-accent font-semibold' : ''}`} 
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`text-xl font-medium ${isActive('/about') ? 'text-brand-accent font-semibold' : ''}`} 
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-xl font-medium ${isActive('/contact') ? 'text-brand-accent font-semibold' : ''}`} 
              onClick={toggleMenu}
            >
              Contact
            </Link>
            
            {/* User specific links */}
            {user ? (
              <>
                <div className="pt-4 border-t">
                  <div className="flex items-center mb-4">
                    <User className="h-6 w-6 text-gray-700 mr-3" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      {userProfile?.is_admin && (
                        <p className="text-sm text-brand-accent">Administrator</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 pl-2">
                    <Link to="/profile" className="flex items-center text-base" onClick={toggleMenu}>
                      <User className="mr-2 h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/orders" className="flex items-center text-base" onClick={toggleMenu}>
                      <Package className="mr-2 h-5 w-5" />
                      <span>Orders</span>
                    </Link>
                    {userProfile?.is_admin && (
                      <Link to="/admin" className="flex items-center text-base" onClick={toggleMenu}>
                        <Shield className="mr-2 h-5 w-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button onClick={logout} className="flex items-center text-base text-red-600">
                      <LogOut className="mr-2 h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t flex flex-col gap-3">
                <Link to="/login" onClick={toggleMenu}>
                  <Button className="w-full" variant="outline">Log in</Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Link to="/favorites" onClick={toggleMenu}>
              <Button className="w-full bg-brand-DEFAULT hover:bg-brand-DEFAULT/90">
                <Heart className="mr-2 h-5 w-5" /> Favorites ({totalFavorites})
              </Button>
            </Link>
            <Link to="/cart" onClick={toggleMenu}>
              <Button className="w-full bg-brand-accent hover:bg-brand-accent/90">
                <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({totalItems})
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
