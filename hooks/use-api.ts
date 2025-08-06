import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/lib/auth';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useApi = (options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const request = useCallback(async (
    url: string,
    fetchOptions: RequestInit = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(url, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          // Clear any stored authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Force a page reload to reset auth context
          window.location.href = '/login';
          return null;
        }
        
        // Show the message field as the primary error message for other errors
        const errorMessage = errorData.message || 'Request failed';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }

      const data = await response.json();
      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    request,
    loading,
    error,
    clearError: () => setError(null),
  };
}; 