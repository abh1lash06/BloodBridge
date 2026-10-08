import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
    const variants = {
        primary: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 active:bg-slate-950 focus-visible:ring-slate-700 shadow-sm',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-sm',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500 shadow-sm',
        outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400',
        ghost: 'text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
    };
    const sizes = {
        sm: 'text-xs px-2.5 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-5 py-2.5 gap-2.5',
    };
    return (_jsxs("button", { ref: ref, disabled: disabled || isLoading, className: cn(baseStyles, variants[variant], sizes[size], className), ...props, children: [isLoading ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin shrink-0" })) : (leftIcon && _jsx("span", { className: "shrink-0", children: leftIcon })), _jsx("span", { children: children }), !isLoading && rightIcon && _jsx("span", { className: "shrink-0", children: rightIcon })] }));
});
Button.displayName = 'Button';
