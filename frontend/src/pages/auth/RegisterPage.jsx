import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShieldAlert, AlertCircle, Heart, User } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils';
export function RegisterPage() {
    const [serverError, setServerError] = useState(null);
    const { register: authRegister, login, getRoleDashboardPath } = useAuth();
    const { success } = useToast();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            role: 'PATIENT',
            phoneNumber: '',
        },
    });
    const selectedRole = watch('role');
    const onSubmit = async (data) => {
        setServerError(null);
        try {
            await authRegister(data);
            success('Account created successfully! Signing you in...', 'Registration Complete');
            // Auto login after registration
            try {
                const loginRes = await login({ email: data.email, password: data.password });
                navigate(getRoleDashboardPath(loginRes.role), { replace: true });
            }
            catch {
                navigate('/login');
            }
        }
        catch (err) {
            const msg = getApiErrorMessage(err);
            setServerError(msg);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center mb-3", children: _jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-200", children: _jsx(ShieldAlert, { className: "w-6 h-6 text-white" }) }), _jsxs("span", { className: "text-2xl font-bold tracking-tight text-slate-900", children: ["Blood", _jsx("span", { className: "text-rose-600", children: "Bridge" })] })] }) }), _jsx("h2", { className: "text-center text-xl font-bold text-slate-900 tracking-tight", children: "Create Your Account" }), _jsx("p", { className: "mt-1 text-center text-xs text-slate-500", children: "Join the emergency network as a Patient or Donor" })] }), _jsx("div", { className: "mt-6 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs(Card, { className: "shadow-lg border-slate-200", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsx(CardTitle, { className: "text-base", children: "Select Account Type" }), _jsx(CardDescription, { children: "Choose whether you are requesting blood or registering to donate." })] }), _jsxs(CardContent, { className: "pt-2", children: [serverError && (_jsxs("div", { role: "alert", className: "mb-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-600 mt-0.5" }), _jsx("div", { className: "flex-1 leading-relaxed", children: serverError })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2", children: "I am registering as:" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { type: "button", onClick: () => setValue('role', 'PATIENT'), className: `p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${selectedRole === 'PATIENT'
                                                                ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-semibold ring-2 ring-rose-600/20'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`, children: [_jsx(User, { className: "w-5 h-5 text-rose-600" }), _jsx("span", { className: "text-xs", children: "Patient / Family" })] }), _jsxs("button", { type: "button", onClick: () => setValue('role', 'DONOR'), className: `p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${selectedRole === 'DONOR'
                                                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-2 ring-indigo-600/20'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`, children: [_jsx(Heart, { className: "w-5 h-5 text-indigo-600" }), _jsx("span", { className: "text-xs", children: "Blood Donor" })] })] }), errors.role && (_jsx("p", { className: "mt-1 text-xs text-rose-600 font-medium", children: errors.role.message }))] }), _jsx(Input, { label: "Full Name", type: "text", autoComplete: "name", placeholder: "John Doe", required: true, error: errors.fullName?.message, ...register('fullName') }), _jsx(Input, { label: "Email Address", type: "email", autoComplete: "email", placeholder: "you@example.com", required: true, error: errors.email?.message, ...register('email') }), _jsx(Input, { label: "Phone Number", type: "tel", autoComplete: "tel", placeholder: "+1 (555) 000-0000", error: errors.phoneNumber?.message, ...register('phoneNumber') }), _jsx(Input, { label: "Password", type: "password", autoComplete: "new-password", placeholder: "At least 6 characters", required: true, error: errors.password?.message, ...register('password') }), _jsx(Button, { type: "submit", variant: "primary", size: "md", className: "w-full mt-2", isLoading: isSubmitting, children: isSubmitting ? 'Creating account...' : 'Create Account' })] }), _jsx("div", { className: "mt-6 pt-4 border-t border-slate-100 text-center", children: _jsxs("p", { className: "text-xs text-slate-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-rose-600 hover:text-rose-700 hover:underline", children: "Sign In" })] }) })] })] }) })] }));
}
