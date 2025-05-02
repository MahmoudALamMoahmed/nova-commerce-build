
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card group">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <Link 
            to={`/products/${product.id}`}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 py-2 px-4 rounded-md flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye size={18} /> Quick View
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-brand-accent font-semibold">${product.price.toFixed(2)}</span>
          <Link 
            to={`/products/${product.id}`}
            className="text-sm text-gray-600 hover:text-brand-accent transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
