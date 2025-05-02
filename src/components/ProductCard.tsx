
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.info(`${product.name} removed from favorites`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} added to favorites!`);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card group block">
      <div className="product-image-container relative">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
            <Link 
              to={`/products/${product.id}`}
              className="bg-white text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={18} /> Quick View
            </Link>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isFavorite(product.id) 
                ? 'bg-red-50 text-red-500' 
                : 'bg-gray-50 text-gray-400 hover:text-red-500'
            }`}
            aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              fill={isFavorite(product.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-brand-accent font-semibold">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/products/${product.id}`}
            className="text-center text-sm py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
          <Button 
            onClick={handleAddToCart}
            variant="default" 
            className="w-full bg-brand-accent hover:bg-brand-accent/90"
          >
            <ShoppingCart size={16} className="mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
