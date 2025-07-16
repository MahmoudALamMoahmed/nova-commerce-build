import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <footer className="bg-brand-DEFAULT text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              NOVA<span className="text-brand-accent">SHOP</span>
            </h3>
            <p className="text-gray-300 mb-4">{t('footer.tagline')}</p>

            <div className={`flex ${isRTL ? 'flex-row-reverse gap-4' : 'gap-4'}`}>
              <a
                href="https://facebook.com"
                className="text-gray-300 hover:text-brand-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-300 hover:text-brand-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-brand-accent transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-brand-accent transition-colors">
                  {t('footer.home')}
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  {t('footer.shop')}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  {t('footer.about')}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-gray-300 hover:text-brand-accent transition-colors">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <a
                  href="/shipping"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  {t('footer.shipping')}
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  {t('footer.returns')}
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="ms-2 h-5 w-5 text-brand-accent flex-shrink-0" />
                <span className="text-gray-300">123 Commerce St, New York, NY 10001</span>
              </li>
              <li className="flex items-start">
                <Phone className="ms-2 h-5 w-5 text-brand-accent flex-shrink-0" />
                <a
                  href="tel:+11234567890"
                  dir="ltr"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="ms-2 h-5 w-5 text-brand-accent flex-shrink-0" />
                <a
                  href="mailto:info@novashop.com"
                  dir="ltr"
                  className="text-gray-300 hover:text-brand-accent transition-colors"
                >
                  info@novashop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NOVASHOP. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
