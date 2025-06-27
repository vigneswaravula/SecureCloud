import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Mock user data - in real app, verify token with backend
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        storageUsed: 2.5 * 1024 * 1024 * 1024, // 2.5GB
        storageLimit: 15 * 1024 * 1024 * 1024, // 15GB
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString(),
        isActive: true,
        xp: 1250,
        level: 3,
        streak: 7
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: email === 'admin@example.com' ? 'admin' : 'user',
        storageUsed: 2.5 * 1024 * 1024 * 1024,
        storageLimit: 15 * 1024 * 1024 * 1024,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString(),
        isActive: true,
        xp: 1250,
        level: 3,
        streak: 7
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        storageUsed: 0,
        storageLimit: 15 * 1024 * 1024 * 1024,
        createdAt: new Date().toISOString(),
        isActive: true,
        xp: 0,
        level: 1,
        streak: 0
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};