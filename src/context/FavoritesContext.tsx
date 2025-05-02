import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setTotalFavorites(favorites.length);
  }, [favorites]);

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const addToFavorites = (product: Product) => {
    setFavorites(currentFavorites => {
      // Check if product already exists in favorites
      if (isFavorite(product.id)) {
        // If it exists, return the current array unchanged
        return currentFavorites;
      } else {
        // If not, add the product to favorites
        return [...currentFavorites, product];
      }
    });
  };

  const removeFromFavorites = (productId: string) => {
    let removed = false;
    
    setFavorites(currentFavorites => {
      const newFavorites = currentFavorites.filter(item => {
        if (item.id !== productId) {
          return true;
        } else {
          removed = true;
          return false;
        }
      });
      
      return newFavorites;
    });
    
    return removed;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      totalFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
