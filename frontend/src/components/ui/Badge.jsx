import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Flame, Check, ShieldCheck, Ban, PackageCheck, RotateCcw, } from 'lucide-react';
export function Badge({ className, variant = 'default', size = 'md', icon = true, children, ...props }) {
    const getIcon = () => {
        if (!icon)
            return null;
        switch (variant) {
            case 'open':
                return <Clock className="w-3 h-3 text-sky-600" aria-hidden="true"/>;
            case 'matched':
                return <CheckCircle2 className="w-3 h-3 text-indigo-600" aria-hidden="true"/>;
            case 'fulfilled':
                return <PackageCheck className="w-3 h-3 text-emerald-600" aria-hidden="true"/>;
            case 'cancelled':
                return <XCircle className="w-3 h-3 text-slate-500" aria-hidden="true"/>;
            case 'pending':
                return <Clock className="w-3 h-3 text-amber-600" aria-hidden="true"/>;
            case 'accepted':
                return <Check className="w-3 h-3 text-emerald-600" aria-hidden="true"/>;
            case 'rejected':
                return <Ban className="w-3 h-3 text-rose-600" aria-hidden="true"/>;
            case 'reserved':
                return <Clock className="w-3 h-3 text-purple-600" aria-hidden="true"/>;
            case 'released':
                return <RotateCcw className="w-3 h-3 text-slate-600" aria-hidden="true"/>;
            case 'verified':
                return <ShieldCheck className="w-3 h-3 text-emerald-600" aria-hidden="true"/>;
            case 'normal':
                return null;
            case 'urgent':
                return <AlertTriangle className="w-3 h-3 text-amber-600" aria-hidden="true"/>;
            case 'critical':
                return <Flame className="w-3 h-3 text-rose-600" aria-hidden="true"/>;
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
    return (<span className={cn('inline-flex items-center font-medium rounded-full border shrink-0', variantStyles[variant], sizeStyles[size], className)} {...props}>
      {getIcon()}
      <span>{children}</span>
    </span>);
}
export function StatusBadge({ status }) {
    const norm = status?.toUpperCase();
    switch (norm) {
        case 'OPEN':
            return <Badge variant="open">Open</Badge>;
        case 'MATCHED':
            return <Badge variant="matched">Matched</Badge>;
        case 'FULFILLED':
            return <Badge variant="fulfilled">Fulfilled</Badge>;
        case 'CANCELLED':
            return <Badge variant="cancelled">Cancelled</Badge>;
        case 'PENDING':
            return <Badge variant="pending">Pending</Badge>;
        case 'ACCEPTED':
            return <Badge variant="accepted">Accepted</Badge>;
        case 'REJECTED':
            return <Badge variant="rejected">Rejected</Badge>;
        case 'RESERVED':
            return <Badge variant="reserved">Reserved</Badge>;
        case 'RELEASED':
            return <Badge variant="released">Released</Badge>;
        case 'VERIFIED':
            return <Badge variant="verified">Verified</Badge>;
        case 'CRITICAL':
            return <Badge variant="critical">CRITICAL</Badge>;
        case 'URGENT':
            return <Badge variant="urgent">URGENT</Badge>;
        case 'NORMAL':
            return <Badge variant="normal">Normal</Badge>;
        default:
            return <Badge variant="default">{status}</Badge>;
    }
}
