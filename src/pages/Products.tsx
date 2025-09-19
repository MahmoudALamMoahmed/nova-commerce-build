
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import CategoryCarousel from '../components/CategoryCarousel';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

const PRODUCTS_PER_PAGE = 10;

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Build query with filters
      let query = supabase.from('products').select('*', { count: 'exact' });

      // Apply search filter
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      // Get total count with filters
      const { count } = await query;
      setTotalProducts(count || 0);

      // Get paginated products with filters
      let productsQuery = supabase.from('products').select('*');

      if (searchTerm) {
        productsQuery = productsQuery.ilike('title', `%${searchTerm}%`);
      }

      if (selectedCategory) {
        productsQuery = productsQuery.eq('category_id', selectedCategory);
      }

      const { data, error } = await productsQuery
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? '' : value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 text-center">{t('products.title')}</h1>
        <p className="text-gray-600 mb-8 text-center">
          Discover our curated collection of premium products.
        </p>
        
        {/* Category Carousel */}
        <CategoryCarousel
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Search Filter */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder={t('products.search')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Products Section with Loading */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">{t('products.noProducts')}</h2>
              <p className="text-gray-500">{t('products.noProductsMessage')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    description: product.description || '',
                    image: product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
                    
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
    </div>
  );
};

export default Products;
