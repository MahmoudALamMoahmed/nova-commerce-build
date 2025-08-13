
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image: string | null;
  stock_quantity: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch products for everyone - no authentication required
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        console.log('Featured products fetched:', data);
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredProducts.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('featuredProducts.subtitle')}
            </p>
          </div>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredProducts.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('featuredProducts.subtitle')}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  description: product.description || '',
                  image: product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
                  stock_quantity: product.stock_quantity || 0
                }} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/products" 
                className="bg-brand-accent hover:bg-brand-accent/90 text-white py-3 px-8 rounded-md transition-colors inline-block"
              >
                {t('featuredProducts.viewAll')}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
