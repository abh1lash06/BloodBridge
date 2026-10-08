import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
export function Spinner({ size = 'md', className, label }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-2", role: "status", children: [_jsx(Loader2, { className: cn('animate-spin text-rose-600', sizeClasses[size], className) }), label && _jsx("p", { className: "text-xs text-slate-500 font-medium", children: label }), _jsx("span", { className: "sr-only", children: "Loading..." })] }));
}
