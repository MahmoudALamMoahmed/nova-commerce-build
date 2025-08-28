
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
  category_id: string | null;
  stock_quantity: number;
}

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  size: string;
  stock_quantity: number;
  image?: string;
  price?: number;
  created_at: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
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

        // Fetch category if product has one
        if (data?.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', data.category_id)
            .single();
          
          setCategory(categoryData);
        }

        // Fetch product variants
        const { data: variantsData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', data.id)
          .order('color');

        if (variantsData && variantsData.length > 0) {
          setVariants(variantsData);
          // Auto-select first variant
          setSelectedColor(variantsData[0].color);
          setSelectedSize(variantsData[0].size);
          setSelectedVariant(variantsData[0]);
        }
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

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const colorVariants = variants.filter(v => v.color === color);
    if (colorVariants.length > 0) {
      setSelectedSize(colorVariants[0].size);
      setSelectedVariant(colorVariants[0]);
    }
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const variant = variants.find(v => v.color === selectedColor && v.size === size);
    setSelectedVariant(variant || null);
  };

  // Get available colors
  const availableColors = Array.from(new Set(variants.map(v => v.color)));
  
  // Get available sizes for selected color
  const availableSizes = variants
    .filter(v => v.color === selectedColor)
    .map(v => v.size);

  // Get current price and stock
  const currentPrice = selectedVariant?.price || product?.price || 0;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : (product?.stock_quantity || 0);
  const currentImage = selectedVariant?.image || product?.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500';

  const handleAddToCart = () => {
    // Convert to the format expected by the cart context
    const cartProduct = {
      id: selectedVariant ? selectedVariant.product_id : product.id,
      name: product.title,
      price: currentPrice,
      description: product.description || '',
      image: currentImage,
      stock_quantity: currentStock,
      variant_id: selectedVariant?.id,
      color: selectedVariant?.color,
      size: selectedVariant?.size
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
            src={currentImage} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Color variant images */}
          {availableColors.length > 0 && (
            <div className="flex gap-2 p-4">
              {availableColors.map((color) => {
                const colorVariant = variants.find(v => v.color === color);
                return (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={colorVariant?.image || product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'} 
                      alt={color}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          {category && (
            <p className="text-sm text-gray-500 mb-2">Category: {category.name}</p>
          )}
          <p className="text-2xl text-brand-accent font-semibold mb-2">
            {currentPrice.toFixed(2)}  ج.م
          </p>
          
          {/* Variant Selection */}
          {variants.length > 0 && (
            <div className="space-y-4 mb-4">
              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-4 py-2 rounded-md border transition-all ${
                          selectedColor === color 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <div className="flex gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 rounded-md border transition-all ${
                          selectedSize === size 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentStock === 0 
                ? 'bg-red-100 text-red-800' 
                : currentStock <= 5 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {currentStock === 0 ? 'Out of Stock' : `${currentStock} in stock`}
            </span>
          </div>
          <div className="border-t border-gray-200 my-4 pt-4">
            <p className="text-gray-700 mb-6">{product.description || 'No description available.'}</p>
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={currentStock === 0 || (variants.length > 0 && !selectedVariant)}
            className="bg-brand-accent hover:bg-brand-accent/90 text-white py-3 px-6 rounded-md font-medium transition-all inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="mr-2" size={18} />
            {currentStock === 0 ? 'Out of Stock' : (variants.length > 0 && !selectedVariant) ? 'Select Options' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
