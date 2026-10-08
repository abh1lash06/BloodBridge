import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
export function TableContainer({ className, children, ...props }) {
    return (_jsx("div", { className: cn('w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs', className), ...props, children: children }));
}
export function Table({ className, children, ...props }) {
    return (_jsx("table", { className: cn('w-full text-left text-sm text-slate-700', className), ...props, children: children }));
}
export function TableHeader({ className, children, ...props }) {
    return (_jsx("thead", { className: cn('bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200', className), ...props, children: children }));
}
export function TableBody({ className, children, ...props }) {
    return (_jsx("tbody", { className: cn('divide-y divide-slate-100', className), ...props, children: children }));
}
export function TableRow({ className, children, ...props }) {
    return (_jsx("tr", { className: cn('hover:bg-slate-50/50 transition-colors', className), ...props, children: children }));
}
export function TableHead({ className, children, ...props }) {
    return (_jsx("th", { className: cn('px-4 py-3.5 whitespace-nowrap', className), ...props, children: children }));
}
export function TableCell({ className, children, ...props }) {
    return (_jsx("td", { className: cn('px-4 py-3.5 align-middle', className), ...props, children: children }));
}
