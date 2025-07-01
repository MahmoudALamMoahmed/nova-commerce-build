
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image: string | null;
  category_id: string | null;
}

const PRODUCTS_PER_PAGE = 10;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      setTotalProducts(count || 0);

      // Get paginated products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      console.log('Products fetched:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Our Products</h1>
        <p className="text-gray-600 mb-8 text-center">
          Discover our curated collection of premium products. 
          {totalProducts > 0 && ` Showing ${products.length} of ${totalProducts} products.`}
        </p>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products available</h2>
            <p className="text-gray-500">Check back later for new products!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  description: product.description || '',
                  image: product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'
                }} />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
