
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image: string | null;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="bg-brand-accent text-white py-2 px-4 rounded-md hover:bg-brand-accent/90 transition-colors">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Convert to the format expected by the cart context
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: product.price,
      description: product.description || '',
      image: product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'
    };
    
    addToCart(cartProduct);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <Link to="/products" className="inline-flex items-center text-brand-accent hover:underline mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl text-brand-accent font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="border-t border-gray-200 my-4 pt-4">
            <p className="text-gray-700 mb-6">{product.description || 'No description available.'}</p>
          </div>
          <Button 
            onClick={handleAddToCart}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white py-3 px-6 rounded-md font-medium transition-all inline-flex items-center"
          >
            <ShoppingCart className="mr-2" size={18} />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
