
import { useState } from 'react';
import { Menu, ShoppingCart, X, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Cart, Favorites, and Mobile Menu Button */}
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
            <Link to="/" className="text-xl font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/products" className="text-xl font-medium" onClick={toggleMenu}>Products</Link>
            <Link to="/about" className="text-xl font-medium" onClick={toggleMenu}>About</Link>
            <Link to="/contact" className="text-xl font-medium" onClick={toggleMenu}>Contact</Link>
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
