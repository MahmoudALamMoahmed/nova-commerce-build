import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  return <div className="container mx-auto px-6 max-w-5xl mt-1 ">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{t('about.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {t('about.storyContent')}
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-brand-accent">{t('about.whyChooseUs')}</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-brand-accent mr-2">✓</span>
              <span>{t('about.feature1')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent mr-2">✓</span>
              <span>{t('about.feature2')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent mr-2">✓</span>
              <span>{t('about.feature3')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent mr-2">✓</span>
              <span>{t('about.feature4')}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <section id="who-we-are" className="mb-16 bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-l-4 border-brand-accent pl-4">{t('about.ourStory')}</h2>
        <div className="text-gray-700 space-y-4">
          <p className="leading-relaxed">
            {t('about.storyContent')}
          </p>
        </div>
      </section>
      
      <section id="our-mission" className="mb-16 bg-gray-50 p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-l-4 border-brand-accent pl-4">{t('about.ourMission')}</h2>
        <div className="text-gray-700 space-y-4">
          <p className="leading-relaxed">
            {t('about.missionContent')}
          </p>
        </div>
      </section>
      
      <section id="why-choose-us" className="mb-16 bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-l-4 border-brand-accent pl-4">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-brand-accent">Curated Selection</h3>
            <p className="text-gray-700">
              Every item in our collection is carefully selected for its craftsmanship, materials, 
              and design. We do the hard work of sourcing so you don't have to.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-brand-accent">Customer Satisfaction</h3>
            <p className="text-gray-700">
              We stand behind every product we sell with a 30-day satisfaction guarantee. 
              If you're not completely happy with your purchase, we'll make it right.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-brand-accent">Ethical Practices</h3>
            <p className="text-gray-700">
              We partner with manufacturers who share our commitment to fair labor practices and 
              sustainable production methods. Your purchase makes a positive impact.
            </p>
          </div>
        </div>
      </section>
    </div>;
};
export default About;