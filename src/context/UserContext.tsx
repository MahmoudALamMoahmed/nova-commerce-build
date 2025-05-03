
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, accept any non-empty email and password
        if (email && password) {
          // Generate a random ID for the user (in a real app, this would come from the backend)
          const newUser = { id: `user_${Date.now()}`, name: email.split('@')[0], email };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve({ success: true, message: 'Login successful!' });
        } else {
          resolve({ success: false, message: 'Email and password are required.' });
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would check if the user already exists
        if (name && email && password) {
          const newUser = { id: `user_${Date.now()}`, name, email };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve({ success: true, message: 'Registration successful!' });
        } else {
          resolve({ success: false, message: 'All fields are required.' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
