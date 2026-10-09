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
        element: <LandingPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/403',
        element: <ForbiddenPage />,
    },
    {
        path: '/404',
        element: <NotFoundPage />,
    },
    // Authenticated Protected App Shell
    {
        element: (<ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>),
        children: [
            // Notifications (all authenticated roles)
            {
                path: '/notifications',
                element: <NotificationsPage />,
            },
            // Patient Routes
            {
                path: '/patient',
                element: <Navigate to="/patient/dashboard" replace/>,
            },
            {
                path: '/patient/dashboard',
                element: (<RoleGuard allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </RoleGuard>),
            },
            {
                path: '/patient/requests',
                element: (<RoleGuard allowedRoles={['PATIENT']}>
            <PatientRequestsPage />
          </RoleGuard>),
            },
            {
                path: '/patient/requests/new',
                element: (<RoleGuard allowedRoles={['PATIENT']}>
            <CreateRequestPage />
          </RoleGuard>),
            },
            {
                path: '/patient/requests/:requestId',
                element: (<RoleGuard allowedRoles={['PATIENT']}>
            <RequestDetailPage />
          </RoleGuard>),
            },
            // Donor Routes
            {
                path: '/donor',
                element: <Navigate to="/donor/dashboard" replace/>,
            },
            {
                path: '/donor/dashboard',
                element: (<RoleGuard allowedRoles={['DONOR']}>
            <DonorDashboard />
          </RoleGuard>),
            },
            {
                path: '/donor/profile',
                element: (<RoleGuard allowedRoles={['DONOR']}>
            <DonorProfilePage />
          </RoleGuard>),
            },
            {
                path: '/donor/matches',
                element: (<RoleGuard allowedRoles={['DONOR']}>
            <DonorMatchesPage />
          </RoleGuard>),
            },
            // Hospital Routes
            {
                path: '/hospital',
                element: <Navigate to="/hospital/dashboard" replace/>,
            },
            {
                path: '/hospital/dashboard',
                element: (<RoleGuard allowedRoles={['HOSPITAL']}>
            <HospitalDashboard />
          </RoleGuard>),
            },
            {
                path: '/hospital/profile',
                element: (<RoleGuard allowedRoles={['HOSPITAL']}>
            <HospitalProfilePage />
          </RoleGuard>),
            },
            {
                path: '/hospital/inventory',
                element: (<RoleGuard allowedRoles={['HOSPITAL']}>
            <HospitalInventoryPage />
          </RoleGuard>),
            },
            {
                path: '/hospital/reservations',
                element: (<RoleGuard allowedRoles={['HOSPITAL']}>
            <HospitalReservationsPage />
          </RoleGuard>),
            },
            // Admin Routes
            {
                path: '/admin',
                element: <Navigate to="/admin/dashboard" replace/>,
            },
            {
                path: '/admin/dashboard',
                element: (<RoleGuard allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RoleGuard>),
            },
            {
                path: '/admin/donors',
                element: (<RoleGuard allowedRoles={['ADMIN']}>
            <DonorVerificationPage />
          </RoleGuard>),
            },
            {
                path: '/admin/hospitals',
                element: (<RoleGuard allowedRoles={['ADMIN']}>
            <HospitalVerificationPage />
          </RoleGuard>),
            },
        ],
    },
    // Fallback 404
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
