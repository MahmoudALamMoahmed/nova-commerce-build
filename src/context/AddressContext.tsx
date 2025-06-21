
import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  phone_number: string;
  created_at: string;
}

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
  updateAddress: (id: string, address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  fetchAddresses: () => Promise<void>;
  isLoading: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: React.ReactNode }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Fetch addresses when user logs in
  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses');
        return;
      }

      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to add an address');
      return false;
    }

    try {
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          ...address
        });

      if (error) {
        console.error('Error adding address:', error);
        toast.error('Failed to add address');
        return false;
      }

      await fetchAddresses();
      toast.success('Address added successfully');
      return true;
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
      return false;
    }
  };

  const updateAddress = async (id: string, address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to update address');
      return false;
    }

    try {
      const { error } = await supabase
        .from('addresses')
        .update(address)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating address:', error);
        toast.error('Failed to update address');
        return false;
      }

      await fetchAddresses();
      toast.success('Address updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
      return false;
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to delete address');
      return false;
    }

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
        return false;
      }

      await fetchAddresses();
      toast.success('Address deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
      return false;
    }
  };

  return (
    <AddressContext.Provider value={{
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      fetchAddresses,
      isLoading
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
};
