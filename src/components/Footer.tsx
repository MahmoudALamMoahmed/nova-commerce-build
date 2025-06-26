
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-DEFAULT text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">NOVA<span className="text-brand-accent">SHOP</span></h3>
            <p className="text-gray-300 mb-4">
              Elevating your shopping experience with premium products and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-brand-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-brand-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-brand-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-brand-accent transition-colors">Home</a></li>
              <li><a href="/shop" className="text-gray-300 hover:text-brand-accent transition-colors">Shop</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-brand-accent transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-brand-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-300 hover:text-brand-accent transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="text-gray-300 hover:text-brand-accent transition-colors">Shipping Policy</a></li>
              <li><a href="/returns" className="text-gray-300 hover:text-brand-accent transition-colors">Returns & Exchanges</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-brand-accent transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-brand-accent flex-shrink-0" />
                <span className="text-gray-300">123 Commerce St, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-brand-accent flex-shrink-0" />
                <a href="tel:+11234567890" className="text-gray-300 hover:text-brand-accent transition-colors">+1 (123) 456-7890</a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-brand-accent flex-shrink-0" />
                <a href="mailto:info@novashop.com" className="text-gray-300 hover:text-brand-accent transition-colors">info@novashop.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NOVASHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
