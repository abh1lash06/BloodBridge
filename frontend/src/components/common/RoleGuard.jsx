import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from './LoadingScreen';
export function RoleGuard({ allowedRoles, children }) {
    const { user, loading, isAuthenticated } = useAuth();
    if (loading) {
        return <LoadingScreen message="Checking permissions..."/>;
    }
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace/>;
    }
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace/>;
    }
    return <>{children}</>;
}
