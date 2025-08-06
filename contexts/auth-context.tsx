"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, AuthResponse, getToken, setToken, removeToken, getUser, setUser, removeUser, logout as logoutUtil } from '@/lib/auth';
import { API_URLS } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = () => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUserState(userData);
    } else {
      setUserState(null);
    }
    setIsLoading(false);
  };

  const clearAuth = () => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch(API_URLS.LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          // Clear any stored authentication data
          clearAuth();
          // Redirect to login page
          router.push('/login');
          return false;
        }
        
        // Show the message field as the primary error message for other errors
        const errorMessage = errorData.message || 'Login failed';
        toast.error(errorMessage);
        return false;
      }

      const data: AuthResponse = await response.json();
      
      if (data.data?.access_token) {
        setToken(data.data.access_token);
        setUser(data.data.user);
        setUserState(data.data.user);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('No token returned from server');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network or server error');
      return false;
    }
  };

  const logout = () => {
    logoutUtil();
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 