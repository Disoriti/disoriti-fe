export interface User {
  id: string;
  email: string;
  is_active: boolean;
  role: string;
  plan?: string;
  monthly_credits_limit?: number;
  monthly_credits_used?: number;
  monthly_credits_reset_at?: string;
}

export interface AuthResponse {
  status_code: number;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  is_active: boolean;
  role: string;
  id: string;
  plan: string;
  monthly_credits_limit: number;
  monthly_credits_used: number;
  monthly_credits_reset_at: string;
}

// Token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  // Also set cookie for middleware
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  // Also remove cookie
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// User data management
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

// Authentication state
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Logout function
export const logout = (): void => {
  removeToken();
  removeUser();
};

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export const isUnauthorizedError = (err: unknown): boolean => {
  return err instanceof UnauthorizedError || (err as any)?.name === 'UnauthorizedError' || (err as any)?.message === 'Unauthorized';
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    try {
      // Best-effort toast; ignore if not available
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { toast } = require('sonner');
      toast.error('Session expired. Please log in again.');
    } catch {}
    window.location.href = '/login';
  }
};

// API request helper with authentication
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Clear auth and redirect
    logout();
    redirectToLogin();
    throw new UnauthorizedError();
  }

  return response;
}; 