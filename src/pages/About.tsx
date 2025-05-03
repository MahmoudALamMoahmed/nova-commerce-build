import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const About = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">About Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Welcome to NOVASHOP, your destination for premium home furnishings and décor. 
                Founded in 2022, we've made it our mission to bring stylish, high-quality products to your home at affordable prices.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-brand-accent">Our Values</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-brand-accent mr-2">✓</span>
                  <span>Quality products at fair prices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent mr-2">✓</span>
                  <span>Sustainable and ethical manufacturing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent mr-2">✓</span>
                  <span>Outstanding customer service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-accent mr-2">✓</span>
                  <span>Timely shipping and delivery</span>
                </li>
              </ul>
            </div>
          </div>
          
          <section id="who-we-are" className="mb-16 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-l-4 border-brand-accent pl-4">Who We Are</h2>
            <div className="text-gray-700 space-y-4">
              <p className="leading-relaxed">
                NOVASHOP began with a simple idea: beautiful homes shouldn't require beautiful budgets. Our founders, 
                a team of passionate interior design enthusiasts and retail experts, set out to create a curated 
                collection of home goods that balance quality, aesthetics, and value.
              </p>
              <p className="leading-relaxed">
                Today, our team has grown to include designers, product specialists, and customer service experts 
                who work together to bring you an exceptional shopping experience. We believe in the power of 
                beautiful spaces to transform daily living, and we're dedicated to helping you create a home 
                that reflects your personal style.
              </p>
            </div>
          </section>
          
          <section id="our-mission" className="mb-16 bg-gray-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-l-4 border-brand-accent pl-4">Our Mission</h2>
            <div className="text-gray-700 space-y-4">
              <p className="leading-relaxed">
                At NOVASHOP, our mission is to democratize great design. We believe everyone deserves to live 
                in a well-designed space that brings joy and comfort, regardless of budget or location.
              </p>
              <p className="leading-relaxed">
                We're committed to sourcing products that meet our high standards for quality and design, 
                working directly with manufacturers to ensure fair pricing and sustainable production practices. 
                By cutting out middlemen and operating efficiently, we're able to offer premium products 
                at prices that make sense.
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
        </div>
      </main>
      <Footer />
    </div>;
};
export default About;