
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useUser } from '@/context/UserContext';
import { Product } from '@/data/products';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useUser();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }
    
    // Navigate to product details to select variant instead of adding directly
    toast.info('Please select product options on the product page');
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to manage favorites');
      return;
    }
    
    if (isFavorite(product.id)) {
      const removed = await removeFromFavorites(product.id);
      if (removed) {
        toast.info(`${product.name} removed from favorites`);
      }
    } else {
      await addToFavorites(product);
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
              user && isFavorite(product.id) 
                ? 'bg-red-50 text-red-500' 
                : 'bg-gray-50 text-gray-400 hover:text-red-500'
            }`}
            aria-label={user && isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              fill={user && isFavorite(product.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-brand-accent font-semibold">ج.م</span>
        </div>
        <div className="mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock_quantity === 0 
              ? 'bg-red-100 text-red-800' 
              : product.stock_quantity <= 5 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {product.stock_quantity === 0 ? 'Out of Stock' : `${product.stock_quantity} in stock`}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center gap-1 text-sm py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={16} className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('products.viewDetails')}
          </Link>

          <Link
            to={`/products/${product.id}`}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center py-2 rounded-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock_quantity === 0) {
                e.preventDefault();
              }
            }}
          >
            <ShoppingCart size={16} className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> 
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Select Options'}
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
