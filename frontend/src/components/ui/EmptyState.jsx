import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';
export function EmptyState({ icon, title, description, actionLabel, onAction, className, }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-slate-200', className), children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4", children: icon || _jsx(Inbox, { className: "w-7 h-7" }) }), _jsx("h4", { className: "text-base font-semibold text-slate-900 mb-1", children: title }), _jsx("p", { className: "text-sm text-slate-500 max-w-sm mb-5 leading-relaxed", children: description }), actionLabel && onAction && (_jsx(Button, { variant: "primary", size: "md", onClick: onAction, children: actionLabel }))] }));
}
