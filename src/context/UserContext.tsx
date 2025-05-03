
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
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user with matching email
    const foundUser = registeredUsers.find((user: any) => user.email === email);
    
    // Check if user exists and password matches
    if (foundUser && foundUser.password === password) {
      const userToLogin = { 
        id: foundUser.id, 
        name: foundUser.name, 
        email: foundUser.email 
      };
      
      setUser(userToLogin);
      localStorage.setItem('user', JSON.stringify(userToLogin));
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if user with this email already exists
    if (existingUsers.some((user: any) => user.email === email)) {
      return { success: false, message: 'Email already in use.' };
    }
    
    // Create new user
    const newUser = { 
      id: `user_${Date.now()}`, 
      name, 
      email, 
      password 
    };
    
    // Add to registered users
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Log user in
    const userToLogin = { id: newUser.id, name, email };
    setUser(userToLogin);
    localStorage.setItem('user', JSON.stringify(userToLogin));
    
    return { success: true, message: 'Registration successful!' };
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
