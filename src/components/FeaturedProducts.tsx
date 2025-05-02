
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/data/products';

const FeaturedProducts = () => {
  const [products] = useState<Product[]>([
    {
      id: "featured1",
      name: "Minimalist Watch",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
      description: "A sleek minimalist watch with a leather band and modern design. Perfect for everyday wear and special occasions."
    },
    {
      id: "featured2",
      name: "Leather Handbag",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80",
      description: "Handcrafted premium leather handbag with ample storage and elegant design. Features a comfortable shoulder strap and secure closure."
    },
    {
      id: "featured3",
      name: "Wireless Headphones",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80",
      description: "High-quality wireless headphones with noise cancellation technology. Enjoy crystal clear sound and extended battery life."
    },
    {
      id: "featured4",
      name: "Designer Sunglasses",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80",
      description: "UV-protected stylish sunglasses with durable frames. Modern design suitable for all face shapes."
    }
  ]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most popular products based on sales and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
