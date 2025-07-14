import { useTranslation } from 'react-i18next';

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-6 max-w-5xl mt-1">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
        {t('about.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="prose max-w-none rtl:text-right">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {t('about.storyContent')}
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-brand-accent rtl:text-right">
            {t('about.whyChooseUs')}
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-brand-accent me-2">✓</span>
              <span className="rtl:text-right">{t('about.feature1')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent me-2">✓</span>
              <span className="rtl:text-right">{t('about.feature2')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent me-2">✓</span>
              <span className="rtl:text-right">{t('about.feature3')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent me-2">✓</span>
              <span className="rtl:text-right">{t('about.feature4')}</span>
            </li>
          </ul>
        </div>
      </div>

      <section id="who-we-are" className="mb-16 bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-s-4 border-brand-accent ps-4 rtl:text-right">
          {t('about.ourStory')}
        </h2>
        <div className="text-gray-700 space-y-4 rtl:text-right">
          <p className="leading-relaxed">{t('about.storyContent')}</p>
        </div>
      </section>

      <section id="our-mission" className="mb-16 bg-gray-50 p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-s-4 border-brand-accent ps-4 rtl:text-right">
          {t('about.ourMission')}
        </h2>
        <div className="text-gray-700 space-y-4 rtl:text-right">
          <p className="leading-relaxed">{t('about.missionContent')}</p>
        </div>
      </section>

      <section id="why-choose-us" className="mb-16 bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-s-4 border-brand-accent ps-4 rtl:text-right">
          {t('about.whyChooseUs')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rtl:text-right">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-brand-accent">{t('about.whyFeature1')}</h3>
            <p className="text-gray-700">{t('about.whyFeature1Desc')}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-brand-accent">{t('about.whyFeature2')}</h3>
            <p className="text-gray-700">{t('about.whyFeature2Desc')}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-brand-accent">{t('about.whyFeature3')}</h3>
            <p className="text-gray-700">{t('about.whyFeature3Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
