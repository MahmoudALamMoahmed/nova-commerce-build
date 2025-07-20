
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="pt-24 pb-12 md:py-32 hero-gradient">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-20">
      {/* نستخدم direction عشان نتحكم في ترتيب العناصر حسب اللغة */}
      <div
        className={`flex flex-col md:flex-row items-center w-full ${
          i18n.language === 'ar' ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* النصوص */}
        <div className="md:w-1/2 text-center md:text-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
            {t('hero.subtitle')}
          </p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center justify-center"
          >
            {t('hero.cta')}
            <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 h-5 w-5 rtl:rotate-180" />
          </Link>
        </div>

        {/* الصورة */}
        <div className="md:w-1/2 mt-10 md:mt-0 md:px-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
              alt="Hero Image"
              className="rounded-lg shadow-2xl object-cover w-full max-h-[500px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="font-bold text-brand-accent">NEW ARRIVALS</p>
              <p className="text-sm text-gray-600">30% OFF this week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


  );
};

export default Hero;
