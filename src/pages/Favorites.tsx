
import { useFavorites } from '@/context/FavoritesContext';
import { useUser } from '@/context/UserContext';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const { favorites, isLoading } = useFavorites();
  const { user } = useUser();
  
  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-medium mb-4">Please log in to view your favorites</h2>
          <p className="text-muted-foreground mb-8">You need to be logged in to access your favorite products.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-2 text-center">My Favorites</h1>
      <p className="text-gray-600 mb-8 text-center">Products you've saved for later.</p>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">
            Start adding products you love to your favorites list
          </p>
          <Link to="/products" className="inline-block bg-brand-accent text-white font-medium px-6 py-3 rounded-md hover:bg-brand-accent/90 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
