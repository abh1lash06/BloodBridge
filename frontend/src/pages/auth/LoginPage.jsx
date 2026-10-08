import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, ShieldAlert, AlertCircle } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils';
export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(null);
    const { login, getRoleDashboardPath } = useAuth();
    const { success } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = async (data) => {
        setServerError(null);
        try {
            const response = await login(data);
            success(`Welcome back, ${response.fullName}!`, 'Signed in successfully');
            const from = location.state?.from?.pathname;
            if (from && !from.includes('/login') && !from.includes('/register')) {
                navigate(from, { replace: true });
            }
            else {
                const redirectPath = getRoleDashboardPath(response.role);
                navigate(redirectPath, { replace: true });
            }
        }
        catch (err) {
            const msg = getApiErrorMessage(err);
            setServerError(msg);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center mb-3", children: _jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-200", children: _jsx(ShieldAlert, { className: "w-6 h-6 text-white" }) }), _jsxs("span", { className: "text-2xl font-bold tracking-tight text-slate-900", children: ["Blood", _jsx("span", { className: "text-rose-600", children: "Bridge" })] })] }) }), _jsx("h2", { className: "text-center text-xl font-bold text-slate-900 tracking-tight", children: "Sign In to BloodBridge" }), _jsx("p", { className: "mt-1 text-center text-xs text-slate-500", children: "Access your Patient, Donor, Hospital, or Admin dashboard" })] }), _jsx("div", { className: "mt-6 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs(Card, { className: "shadow-lg border-slate-200", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsx(CardTitle, { className: "text-base", children: "Authentication" }), _jsx(CardDescription, { children: "Enter your registered email and password to continue." })] }), _jsxs(CardContent, { className: "pt-2", children: [serverError && (_jsxs("div", { role: "alert", className: "mb-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-600 mt-0.5" }), _jsx("div", { className: "flex-1 leading-relaxed", children: serverError })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsx(Input, { label: "Email Address", type: "email", autoComplete: "email", placeholder: "you@example.com", required: true, error: errors.email?.message, ...register('email') }), _jsx("div", { className: "w-full", children: _jsxs("div", { className: "relative", children: [_jsx(Input, { label: "Password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", placeholder: "Enter your password", required: true, error: errors.password?.message, ...register('password') }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), "aria-label": showPassword ? 'Hide password' : 'Show password', className: "absolute right-3 top-8 text-slate-400 hover:text-slate-600 p-1", children: showPassword ? (_jsx(EyeOff, { className: "w-4 h-4" })) : (_jsx(Eye, { className: "w-4 h-4" })) })] }) }), _jsx(Button, { type: "submit", variant: "primary", size: "md", className: "w-full mt-2", isLoading: isSubmitting, children: isSubmitting ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "mt-6 pt-4 border-t border-slate-100 text-center", children: [_jsxs("p", { className: "text-xs text-slate-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "font-semibold text-rose-600 hover:text-rose-700 hover:underline", children: "Register as Patient or Donor" })] }), _jsx("p", { className: "text-[11px] text-slate-400 mt-2", children: "Hospital and Admin accounts are provisioned by system administration." })] })] })] }) })] }));
}
