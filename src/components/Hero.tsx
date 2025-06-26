
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-24 pb-12 md:py-32 hero-gradient">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Elevate Your Style With Our 
            <span className="text-brand-accent"> Collection</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
            Discover the latest trends and timeless classics from our curated selection of premium products.
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center">
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="md:w-1/2 md:pl-12">
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
    </section>
  );
};

export default Hero;
