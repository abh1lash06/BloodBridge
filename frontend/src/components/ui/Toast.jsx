import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useToast } from '@/context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ToastContainer() {
    const { toasts, removeToast } = useToast();
    if (toasts.length === 0)
        return null;
    return (_jsx("div", { "aria-live": "polite", className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0", children: toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';
            const isInfo = toast.type === 'info';
            return (_jsxs("div", { role: "status", className: cn('pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all animate-in slide-in-from-bottom-2 duration-200', isSuccess && 'bg-emerald-50/95 border-emerald-200 text-emerald-900', isError && 'bg-rose-50/95 border-rose-200 text-rose-900', isWarning && 'bg-amber-50/95 border-amber-200 text-amber-900', isInfo && 'bg-blue-50/95 border-blue-200 text-blue-900'), children: [_jsxs("div", { className: "shrink-0 mt-0.5", children: [isSuccess && _jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600" }), isError && _jsx(AlertCircle, { className: "w-5 h-5 text-rose-600" }), isWarning && _jsx(AlertTriangle, { className: "w-5 h-5 text-amber-600" }), isInfo && _jsx(Info, { className: "w-5 h-5 text-blue-600" })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [toast.title && (_jsx("h4", { className: "text-sm font-semibold mb-0.5 leading-tight", children: toast.title })), _jsx("p", { className: "text-sm text-opacity-90 leading-relaxed break-words", children: toast.message })] }), _jsx("button", { type: "button", onClick: () => removeToast(toast.id), className: "shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 -mt-1 rounded-md", "aria-label": "Close notification", children: _jsx(X, { className: "w-4 h-4" }) })] }, toast.id));
        }) }));
}
