import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface User {
  id: number;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await api.get<User>('/api/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      const response = await api.post<{ access_token: string; token_type: string }>('/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response);
      localStorage.setItem('auth_token', response.access_token);

      const userData = await api.get<User>('/api/auth/me');
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting registration with:', { email, password: '***' });
      const response = await api.post<{ access_token: string; token_type: string }>('/api/auth/register', {
        email,
        password,
      });
      console.log('Registration response:', response);
      localStorage.setItem('auth_token', response.access_token);

      const userData = await api.get<User>('/api/auth/me');
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return { user, loading, signIn, signUp, signOut };
};
