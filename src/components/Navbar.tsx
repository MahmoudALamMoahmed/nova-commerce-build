
import { useState } from 'react';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-brand-DEFAULT">
            NOVA<span className="text-brand-accent">SHOP</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="nav-link">Home</a>
            <a href="/shop" className="nav-link">Shop</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <a href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-brand-accent transition-colors" />
              <span className="absolute top-0 right-0 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </a>
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
            <a href="/" className="text-2xl font-bold text-brand-DEFAULT">
              NOVA<span className="text-brand-accent">SHOP</span>
            </a>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-6">
            <a href="/" className="text-xl font-medium" onClick={toggleMenu}>Home</a>
            <a href="/shop" className="text-xl font-medium" onClick={toggleMenu}>Shop</a>
            <a href="/about" className="text-xl font-medium" onClick={toggleMenu}>About</a>
            <a href="/contact" className="text-xl font-medium" onClick={toggleMenu}>Contact</a>
          </div>
          <div className="mt-auto">
            <Button className="w-full mt-6 bg-brand-accent hover:bg-brand-accent/90">
              <ShoppingCart className="mr-2 h-5 w-5" /> View Cart (0)
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
