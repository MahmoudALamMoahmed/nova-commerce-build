
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const Products = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Our Products</h1>
        <p className="text-gray-600 mb-8 text-center">Discover our curated collection of premium products.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </div>
  );
};

export default Products;
