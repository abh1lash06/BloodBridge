import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from './LoadingScreen';
export function RoleGuard({ allowedRoles, children }) {
    const { user, loading, isAuthenticated } = useAuth();
    if (loading) {
        return _jsx(LoadingScreen, { message: "Checking permissions..." });
    }
    if (!isAuthenticated || !user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/403", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
