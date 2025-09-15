"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, RegisterCredentials, RegisterResponse, AuthResponse, getToken, setToken, removeToken, getUser, setUser, removeUser, logout as logoutUtil, authenticatedFetch } from '@/lib/auth';
import { API_URLS } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  plan?: string | null;
  monthlyCreditsLimit?: number | null;
  monthlyCreditsUsed?: number | null;
  monthlyCreditsResetAt?: string | null;
  setCreditsFromServer?: (credits: { limit: number; used: number; reset_at: string }) => void;
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
  const [plan, setPlan] = useState<string | null>(null);
  const [monthlyCreditsLimit, setMonthlyCreditsLimit] = useState<number | null>(null);
  const [monthlyCreditsUsed, setMonthlyCreditsUsed] = useState<number | null>(null);
  const [monthlyCreditsResetAt, setMonthlyCreditsResetAt] = useState<string | null>(null);
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
        // Fetch /auth/me for plan and credits
        try {
          const meRes = await authenticatedFetch(API_URLS.ME_URL, { method: 'GET' });
          if (meRes.ok) {
            const me = await meRes.json();
            const planName = me?.data?.plan ?? null;
            const limit = me?.data?.monthly_credits_limit ?? null;
            const used = me?.data?.monthly_credits_used ?? null;
            const resetAt = me?.data?.monthly_credits_reset_at ?? null;
            setPlan(planName);
            setMonthlyCreditsLimit(limit);
            setMonthlyCreditsUsed(used);
            setMonthlyCreditsResetAt(resetAt);
          }
        } catch {}
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

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await fetch(API_URLS.REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Registration failed';
        toast.error(errorMessage);
        return false;
      }

      const data: RegisterResponse = await response.json();
      
      // Don't store user data or set authentication state after registration
      // The user needs to log in separately to get an access token
      
      toast.success('Registration successful! Please log in to continue.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
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
    // If already authenticated on app init, fetch /auth/me
    (async () => {
      const token = getToken();
      const userData = getUser();
      if (token && userData) {
        try {
          const meRes = await authenticatedFetch(API_URLS.ME_URL, { method: 'GET' });
          if (meRes.ok) {
            const me = await meRes.json();
            setPlan(me?.data?.plan ?? null);
            setMonthlyCreditsLimit(me?.data?.monthly_credits_limit ?? null);
            setMonthlyCreditsUsed(me?.data?.monthly_credits_used ?? null);
            setMonthlyCreditsResetAt(me?.data?.monthly_credits_reset_at ?? null);
          }
        } catch {}
      }
    })();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    plan,
    monthlyCreditsLimit,
    monthlyCreditsUsed,
    monthlyCreditsResetAt,
    setCreditsFromServer: (credits) => {
      setMonthlyCreditsLimit(credits.limit);
      setMonthlyCreditsUsed(credits.used);
      setMonthlyCreditsResetAt(credits.reset_at);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 