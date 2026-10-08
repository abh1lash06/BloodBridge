import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ShieldX, Home } from 'lucide-react';
export function ForbiddenPage() {
    const { user, isAuthenticated, getRoleDashboardPath } = useAuth();
    const dashboardPath = isAuthenticated ? getRoleDashboardPath(user?.role) : '/login';
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4", children: _jsx(ShieldX, { className: "w-8 h-8" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight mb-2", children: "Access Restricted (403)" }), _jsx("p", { className: "text-sm text-slate-600 max-w-sm mb-6 leading-relaxed", children: "You do not have permission to access this page. Please return to your authorized role dashboard." }), _jsx(Link, { to: dashboardPath, children: _jsx(Button, { variant: "primary", size: "md", leftIcon: _jsx(Home, { className: "w-4 h-4" }), children: "Go to Your Dashboard" }) })] }));
}
