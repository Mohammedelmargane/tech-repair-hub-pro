
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById } from '@/data/mockData';

export type UserRole = 'admin' | 'technician' | 'customer_service' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('repairShop_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const user = getUserById(parsedUser.id);
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('repairShop_user');
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (userId: string) => {
    const user = getUserById(userId);
    if (user) {
      setUser(user);
      localStorage.setItem('repairShop_user', JSON.stringify({ id: user.id }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('repairShop_user');
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // Don't render anything until we've checked for a stored user session
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
