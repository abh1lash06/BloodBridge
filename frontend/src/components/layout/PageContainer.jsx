import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
export function PageContainer({ title, description, action, children, className, }) {
    return (_jsxs("div", { className: cn('p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6', className), children: [(title || action) && (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200", children: [_jsxs("div", { children: [title && (_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 tracking-tight", children: title })), description && (_jsx("p", { className: "text-sm text-slate-500 mt-1", children: description }))] }), action && _jsx("div", { className: "shrink-0", children: action })] })), children] }));
}
