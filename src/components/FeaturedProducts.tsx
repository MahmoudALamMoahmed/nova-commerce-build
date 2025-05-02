
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const FeaturedProducts = () => {
  const { toast } = useToast();
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Minimalist Watch",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
      category: "Accessories"
    },
    {
      id: 2,
      name: "Leather Handbag",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80",
      category: "Bags"
    },
    {
      id: 3,
      name: "Wireless Headphones",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80",
      category: "Electronics"
    },
    {
      id: 4,
      name: "Designer Sunglasses",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80",
      category: "Accessories"
    }
  ]);

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

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
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                <p className="font-bold text-brand-accent mb-4">${product.price.toFixed(2)}</p>
                <Button 
                  className="w-full bg-brand-DEFAULT hover:bg-brand-DEFAULT/90 text-white"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
