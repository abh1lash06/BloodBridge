import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
export const Input = React.forwardRef(({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    return (_jsxs("div", { className: "w-full", children: [label && (_jsxs("label", { htmlFor: inputId, className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5", children: [label, props.required && _jsx("span", { className: "text-rose-500 ml-1", "aria-hidden": "true", children: "*" })] })), _jsx("div", { className: "relative", children: _jsx("input", { id: inputId, ref: ref, "aria-invalid": !!error, "aria-describedby": error ? errorId : helperText ? helperId : undefined, className: cn('w-full px-3.5 py-2 rounded-lg border bg-white text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:bg-slate-50', error
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100', className), ...props }) }), error && (_jsx("p", { id: errorId, className: "mt-1 text-xs text-rose-600 font-medium", children: error })), !error && helperText && (_jsx("p", { id: helperId, className: "mt-1 text-xs text-slate-500", children: helperText }))] }));
});
Input.displayName = 'Input';
