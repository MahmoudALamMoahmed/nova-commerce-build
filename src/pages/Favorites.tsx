import { useFavorites } from '@/context/FavoritesContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
const Favorites = () => {
  const {
    favorites
  } = useFavorites();
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2 text-center">My Favorites</h1>
          <p className="text-gray-600 mb-8 text-center">Products you've saved for later.</p>
          
          {favorites.length === 0 ? <div className="text-center py-12">
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">
                Start adding products you love to your favorites list
              </p>
              <Link to="/products" className="inline-block bg-brand-accent text-white font-medium px-6 py-3 rounded-md hover:bg-brand-accent/90 transition-colors">
                Browse Products
              </Link>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map(product => <ProductCard key={product.id} product={product} />)}
            </div>}
        </div>
      </main>
      <Footer />
    </div>;
};
export default Favorites;