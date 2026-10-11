import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('snaply_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('snaply_user', JSON.stringify(currentUser));
      return currentUser;
    } catch (err) {
      setUser(null);
      localStorage.removeItem('snaply_user');
      localStorage.removeItem('snaply_token');
      throw err;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          localStorage.setItem('snaply_user', JSON.stringify(currentUser));
        }
      } catch {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('snaply_user');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.token) {
      localStorage.setItem('snaply_token', data.token);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('snaply_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    return data;
  };

  const devLogin = async (arg1 = 'demo@snaply.com', arg2 = 'Demo User') => {
    let email = typeof arg1 === 'object' ? arg1.email : arg1;
    let name = typeof arg1 === 'object' ? arg1.name : arg2;
    if (name && name.includes('@') && (!email || !email.includes('@'))) {
      const temp = email;
      email = name;
      name = temp;
    }
    const data = await authService.devLogin({ email, name });
    if (data.token) {
      localStorage.setItem('snaply_token', data.token);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('snaply_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('snaply_user');
      localStorage.removeItem('snaply_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        devLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
