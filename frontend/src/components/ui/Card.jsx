import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
export function Card({ className, children, ...props }) {
    return (_jsx("div", { className: cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all', className), ...props, children: children }));
}
export function CardHeader({ className, children, ...props }) {
    return (_jsx("div", { className: cn('p-5 border-b border-slate-100 flex flex-col gap-1', className), ...props, children: children }));
}
export function CardTitle({ className, children, ...props }) {
    return (_jsx("h3", { className: cn('text-base font-semibold text-slate-900 tracking-tight leading-snug', className), ...props, children: children }));
}
export function CardDescription({ className, children, ...props }) {
    return (_jsx("p", { className: cn('text-xs text-slate-500 leading-normal', className), ...props, children: children }));
}
export function CardContent({ className, children, ...props }) {
    return (_jsx("div", { className: cn('p-5', className), ...props, children: children }));
}
export function CardFooter({ className, children, ...props }) {
    return (_jsx("div", { className: cn('p-5 bg-slate-50/75 border-t border-slate-100 flex items-center justify-between gap-3', className), ...props, children: children }));
}
