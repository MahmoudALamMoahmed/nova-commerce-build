
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Text Content (يمين في العربي) */}
          <div className="flex flex-col justify-center h-full text-center md:text-right rtl:text-right ltr:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Find a developer for short or long-term projects
            </h2>
            <p className="text-gray-700 mb-6">
              Connect with skilled developers to bring your ideas to life efficiently and professionally.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
              Get HELP NOW
            </button>
          </div>

          {/* Image Content (يسار في العربي) */}
          <div className="flex justify-center">
            <img
              src="/your-image-path.jpg"
              alt="Developer illustration"
              className="max-w-full h-auto rounded-lg shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
