import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '@/api/auth.api';
import { setOnUnauthorizedCallback } from '@/api/client';
import { queryClient } from '@/lib/queryClient';
const AuthContext = createContext(undefined);
const TOKEN_KEY = 'bloodbridge_token';
const USER_KEY = 'bloodbridge_user';
export function getRoleDashboardPath(role) {
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
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
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
        }
        catch {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Set up 401 interceptor hook
    useEffect(() => {
        setOnUnauthorizedCallback(() => {
            logout();
        });
    }, [logout]);
    const login = async (data) => {
        const res = await apiLogin(data);
        const token = res.accessToken;
        const authUser = {
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
    const register = async (data) => {
        return await apiRegister(data);
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            accessToken,
            isAuthenticated: !!accessToken && !!user,
            loading,
            login,
            register,
            logout,
            getRoleDashboardPath,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
