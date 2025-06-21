
import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './UserContext';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Fetch favorites from Supabase when user logs in
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      // Clear favorites when user logs out
      setFavorites([]);
    }
  }, [user]);

  // Update total when favorites change
  useEffect(() => {
    setTotalFavorites(favorites.length);
  }, [favorites]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          products (
            id,
            title,
            price,
            description,
            image
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
        return;
      }

      const formattedFavorites: Product[] = data?.map(item => ({
        id: item.products.id,
        name: item.products.title,
        price: item.products.price,
        description: item.products.description || '',
        image: item.products.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500'
      })) || [];

      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const addToFavorites = async (product: Product) => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    // Check if already favorite
    if (isFavorite(product.id)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: product.id
        });

      if (error) {
        console.error('Error adding to favorites:', error);
        toast.error('Failed to add to favorites');
        return;
      }

      // Update local state
      setFavorites(currentFavorites => [...currentFavorites, product]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (productId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to manage favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from favorites:', error);
        toast.error('Failed to remove from favorites');
        return false;
      }

      // Update local state
      setFavorites(currentFavorites => 
        currentFavorites.filter(item => item.id !== productId)
      );
      
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
      return false;
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      totalFavorites,
      isLoading
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
