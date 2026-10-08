import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Flame, Check, ShieldCheck, Ban, PackageCheck, RotateCcw, } from 'lucide-react';
export function Badge({ className, variant = 'default', size = 'md', icon = true, children, ...props }) {
    const getIcon = () => {
        if (!icon)
            return null;
        switch (variant) {
            case 'open':
                return _jsx(Clock, { className: "w-3 h-3 text-sky-600", "aria-hidden": "true" });
            case 'matched':
                return _jsx(CheckCircle2, { className: "w-3 h-3 text-indigo-600", "aria-hidden": "true" });
            case 'fulfilled':
                return _jsx(PackageCheck, { className: "w-3 h-3 text-emerald-600", "aria-hidden": "true" });
            case 'cancelled':
                return _jsx(XCircle, { className: "w-3 h-3 text-slate-500", "aria-hidden": "true" });
            case 'pending':
                return _jsx(Clock, { className: "w-3 h-3 text-amber-600", "aria-hidden": "true" });
            case 'accepted':
                return _jsx(Check, { className: "w-3 h-3 text-emerald-600", "aria-hidden": "true" });
            case 'rejected':
                return _jsx(Ban, { className: "w-3 h-3 text-rose-600", "aria-hidden": "true" });
            case 'reserved':
                return _jsx(Clock, { className: "w-3 h-3 text-purple-600", "aria-hidden": "true" });
            case 'released':
                return _jsx(RotateCcw, { className: "w-3 h-3 text-slate-600", "aria-hidden": "true" });
            case 'verified':
                return _jsx(ShieldCheck, { className: "w-3 h-3 text-emerald-600", "aria-hidden": "true" });
            case 'normal':
                return null;
            case 'urgent':
                return _jsx(AlertTriangle, { className: "w-3 h-3 text-amber-600", "aria-hidden": "true" });
            case 'critical':
                return _jsx(Flame, { className: "w-3 h-3 text-rose-600", "aria-hidden": "true" });
            default:
                return null;
        }
    };
    const variantStyles = {
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        open: 'bg-sky-50 text-sky-700 border-sky-200',
        matched: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        fulfilled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        rejected: 'bg-rose-50 text-rose-700 border-rose-200',
        reserved: 'bg-purple-50 text-purple-700 border-purple-200',
        released: 'bg-slate-100 text-slate-700 border-slate-200',
        verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        normal: 'bg-slate-100 text-slate-700 border-slate-200',
        urgent: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
        critical: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
    };
    const sizeStyles = {
        sm: 'text-[11px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
    };
    return (_jsxs("span", { className: cn('inline-flex items-center font-medium rounded-full border shrink-0', variantStyles[variant], sizeStyles[size], className), ...props, children: [getIcon(), _jsx("span", { children: children })] }));
}
export function StatusBadge({ status }) {
    const norm = status?.toUpperCase();
    switch (norm) {
        case 'OPEN':
            return _jsx(Badge, { variant: "open", children: "Open" });
        case 'MATCHED':
            return _jsx(Badge, { variant: "matched", children: "Matched" });
        case 'FULFILLED':
            return _jsx(Badge, { variant: "fulfilled", children: "Fulfilled" });
        case 'CANCELLED':
            return _jsx(Badge, { variant: "cancelled", children: "Cancelled" });
        case 'PENDING':
            return _jsx(Badge, { variant: "pending", children: "Pending" });
        case 'ACCEPTED':
            return _jsx(Badge, { variant: "accepted", children: "Accepted" });
        case 'REJECTED':
            return _jsx(Badge, { variant: "rejected", children: "Rejected" });
        case 'RESERVED':
            return _jsx(Badge, { variant: "reserved", children: "Reserved" });
        case 'RELEASED':
            return _jsx(Badge, { variant: "released", children: "Released" });
        case 'VERIFIED':
            return _jsx(Badge, { variant: "verified", children: "Verified" });
        case 'CRITICAL':
            return _jsx(Badge, { variant: "critical", children: "CRITICAL" });
        case 'URGENT':
            return _jsx(Badge, { variant: "urgent", children: "URGENT" });
        case 'NORMAL':
            return _jsx(Badge, { variant: "normal", children: "Normal" });
        default:
            return _jsx(Badge, { variant: "default", children: status });
    }
}
