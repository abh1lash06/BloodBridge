import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RoleGuard } from '@/components/common/RoleGuard';
// Public Pages
import { LandingPage } from '@/pages/landing/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { ForbiddenPage } from '@/pages/errors/ForbiddenPage';
// Common Authenticated Pages
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
// Patient Module
import { PatientDashboard } from '@/pages/patient/PatientDashboard';
import { PatientRequestsPage } from '@/pages/patient/PatientRequestsPage';
import { CreateRequestPage } from '@/pages/patient/CreateRequestPage';
import { RequestDetailPage } from '@/pages/patient/RequestDetailPage';
// Donor Module
import { DonorDashboard } from '@/pages/donor/DonorDashboard';
import { DonorProfilePage } from '@/pages/donor/DonorProfilePage';
import { DonorMatchesPage } from '@/pages/donor/DonorMatchesPage';
// Hospital Module
import { HospitalDashboard } from '@/pages/hospital/HospitalDashboard';
import { HospitalProfilePage } from '@/pages/hospital/HospitalProfilePage';
import { HospitalInventoryPage } from '@/pages/hospital/HospitalInventoryPage';
import { HospitalReservationsPage } from '@/pages/hospital/HospitalReservationsPage';
// Admin Module
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { DonorVerificationPage } from '@/pages/admin/DonorVerificationPage';
import { HospitalVerificationPage } from '@/pages/admin/HospitalVerificationPage';
export const router = createBrowserRouter([
    // Public Routes
    {
        path: '/',
        element: _jsx(LandingPage, {}),
    },
    {
        path: '/login',
        element: _jsx(LoginPage, {}),
    },
    {
        path: '/register',
        element: _jsx(RegisterPage, {}),
    },
    {
        path: '/403',
        element: _jsx(ForbiddenPage, {}),
    },
    {
        path: '/404',
        element: _jsx(NotFoundPage, {}),
    },
    // Authenticated Protected App Shell
    {
        element: (_jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) })),
        children: [
            // Notifications (all authenticated roles)
            {
                path: '/notifications',
                element: _jsx(NotificationsPage, {}),
            },
            // Patient Routes
            {
                path: '/patient',
                element: _jsx(Navigate, { to: "/patient/dashboard", replace: true }),
            },
            {
                path: '/patient/dashboard',
                element: (_jsx(RoleGuard, { allowedRoles: ['PATIENT'], children: _jsx(PatientDashboard, {}) })),
            },
            {
                path: '/patient/requests',
                element: (_jsx(RoleGuard, { allowedRoles: ['PATIENT'], children: _jsx(PatientRequestsPage, {}) })),
            },
            {
                path: '/patient/requests/new',
                element: (_jsx(RoleGuard, { allowedRoles: ['PATIENT'], children: _jsx(CreateRequestPage, {}) })),
            },
            {
                path: '/patient/requests/:requestId',
                element: (_jsx(RoleGuard, { allowedRoles: ['PATIENT'], children: _jsx(RequestDetailPage, {}) })),
            },
            // Donor Routes
            {
                path: '/donor',
                element: _jsx(Navigate, { to: "/donor/dashboard", replace: true }),
            },
            {
                path: '/donor/dashboard',
                element: (_jsx(RoleGuard, { allowedRoles: ['DONOR'], children: _jsx(DonorDashboard, {}) })),
            },
            {
                path: '/donor/profile',
                element: (_jsx(RoleGuard, { allowedRoles: ['DONOR'], children: _jsx(DonorProfilePage, {}) })),
            },
            {
                path: '/donor/matches',
                element: (_jsx(RoleGuard, { allowedRoles: ['DONOR'], children: _jsx(DonorMatchesPage, {}) })),
            },
            // Hospital Routes
            {
                path: '/hospital',
                element: _jsx(Navigate, { to: "/hospital/dashboard", replace: true }),
            },
            {
                path: '/hospital/dashboard',
                element: (_jsx(RoleGuard, { allowedRoles: ['HOSPITAL'], children: _jsx(HospitalDashboard, {}) })),
            },
            {
                path: '/hospital/profile',
                element: (_jsx(RoleGuard, { allowedRoles: ['HOSPITAL'], children: _jsx(HospitalProfilePage, {}) })),
            },
            {
                path: '/hospital/inventory',
                element: (_jsx(RoleGuard, { allowedRoles: ['HOSPITAL'], children: _jsx(HospitalInventoryPage, {}) })),
            },
            {
                path: '/hospital/reservations',
                element: (_jsx(RoleGuard, { allowedRoles: ['HOSPITAL'], children: _jsx(HospitalReservationsPage, {}) })),
            },
            // Admin Routes
            {
                path: '/admin',
                element: _jsx(Navigate, { to: "/admin/dashboard", replace: true }),
            },
            {
                path: '/admin/dashboard',
                element: (_jsx(RoleGuard, { allowedRoles: ['ADMIN'], children: _jsx(AdminDashboard, {}) })),
            },
            {
                path: '/admin/donors',
                element: (_jsx(RoleGuard, { allowedRoles: ['ADMIN'], children: _jsx(DonorVerificationPage, {}) })),
            },
            {
                path: '/admin/hospitals',
                element: (_jsx(RoleGuard, { allowedRoles: ['ADMIN'], children: _jsx(HospitalVerificationPage, {}) })),
            },
        ],
    },
    // Fallback 404
    {
        path: '*',
        element: _jsx(NotFoundPage, {}),
    },
]);
