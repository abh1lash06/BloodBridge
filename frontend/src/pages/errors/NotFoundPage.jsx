import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
export function NotFoundPage() {
    const { user, isAuthenticated, getRoleDashboardPath } = useAuth();
    const dashboardPath = isAuthenticated ? getRoleDashboardPath(user?.role) : '/';
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl mb-4", children: "404" }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight mb-2", children: "Page Not Found" }), _jsx("p", { className: "text-sm text-slate-600 max-w-sm mb-6 leading-relaxed", children: "The page you are looking for does not exist or may have been moved." }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: dashboardPath, children: _jsx(Button, { variant: "primary", size: "md", leftIcon: _jsx(Home, { className: "w-4 h-4" }), children: "Return to Dashboard" }) }), _jsx(Button, { variant: "outline", size: "md", leftIcon: _jsx(ArrowLeft, { className: "w-4 h-4" }), onClick: () => window.history.back(), children: "Go Back" })] })] }));
}
