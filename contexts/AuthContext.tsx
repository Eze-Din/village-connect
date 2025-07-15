
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { useData } from '../hooks/useData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'approved' | 'role'>) => Promise<boolean>;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useData();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('villageUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Verify user still exists in our 'DB'
        const userExists = state.users.find(u => u.id === parsedUser.id);
        if (userExists) {
            setUser(userExists);
        } else {
            localStorage.removeItem('villageUser');
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('villageUser');
    }
    setLoading(false);
  }, [state.users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = state.users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      if (foundUser.role === Role.Resident && !foundUser.approved) {
        alert("Your account is pending administrator approval.");
        return false;
      }
      setUser(foundUser);
      localStorage.setItem('villageUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('villageUser');
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'approved' | 'role'>): Promise<boolean> => {
    const existingUser = state.users.find(u => u.email === userData.email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      ...userData,
      id: `resident-${Date.now()}`,
      role: Role.Resident,
      createdAt: new Date().toISOString(),
      approved: false, // requires admin approval
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
    return true;
  };
  
  const updateUser = (updatedUserData: User) => {
    dispatch({ type: 'UPDATE_USER', payload: updatedUserData });
    setUser(updatedUserData);
    localStorage.setItem('villageUser', JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
