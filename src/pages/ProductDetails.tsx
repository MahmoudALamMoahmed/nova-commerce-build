
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { products } from '../data/products';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { Layout } from '@/components/Layout';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  
  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">
            Return to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6">
        <Link to="/products" className="inline-flex items-center text-brand-accent hover:underline mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back to products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-brand-accent font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>
            <div className="border-t border-gray-200 my-4 pt-4">
              <p className="text-gray-700 mb-6">{product.description}</p>
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
    </Layout>
  );
};

export default ProductDetails;
