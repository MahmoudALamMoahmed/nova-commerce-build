
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Welcome to NOVASHOP, your destination for premium home furnishings and décor. 
              Founded in 2022, we've made it our mission to bring stylish, high-quality products to your home at affordable prices.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
            <p className="mb-4">
              NOVASHOP began with a simple idea: beautiful homes shouldn't require beautiful budgets. Our founders, passionate about interior design, 
              set out to create a curated collection of home goods that balance quality, aesthetics, and value.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Products</h2>
            <p className="mb-4">
              Every item in our collection is carefully selected for its craftsmanship, materials, and design. We work directly with manufacturers 
              to ensure fair pricing and sustainable production practices.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Promise</h2>
            <p className="mb-4">
              Customer satisfaction is our top priority. We stand behind every product we sell with a 30-day satisfaction guarantee. 
              If you're not completely happy with your purchase, we'll make it right.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
