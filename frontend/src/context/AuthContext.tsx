import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '@/types/auth';
import { login as apiLogin, register as apiRegister } from '@/api/auth.api';
import { setOnUnauthorizedCallback } from '@/api/client';
import { queryClient } from '@/lib/queryClient';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<any>;
  logout: () => void;
  getRoleDashboardPath: (role?: UserRole | null) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'bloodbridge_token';
const USER_KEY = 'bloodbridge_user';

export function getRoleDashboardPath(role?: UserRole | null): string {
  switch (role) {
    case 'PATIENT':
      return '/patient/dashboard';
    case 'DONOR':
      return '/donor/dashboard';
    case 'HOSPITAL':
      return '/hospital/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setAccessToken(null);
    queryClient.clear();
  }, []);

  // Restore auth from storage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up 401 interceptor hook
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      logout();
    });
  }, [logout]);

  const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiLogin(data);
    const token = res.accessToken;
    const authUser: AuthUser = {
      id: res.id,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));

    setAccessToken(token);
    setUser(authUser);

    return res;
  };

  const register = async (data: RegisterRequest): Promise<any> => {
    return await apiRegister(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        loading,
        login,
        register,
        logout,
        getRoleDashboardPath,
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
