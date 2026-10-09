import React from 'react';
import { cn } from '@/lib/utils';
export function Card({ className, children, ...props }) {
    return (<div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all', className)} {...props}>
      {children}
    </div>);
}
export function CardHeader({ className, children, ...props }) {
    return (<div className={cn('p-5 border-b border-slate-100 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>);
}
export function CardTitle({ className, children, ...props }) {
    return (<h3 className={cn('text-base font-semibold text-slate-900 tracking-tight leading-snug', className)} {...props}>
      {children}
    </h3>);
}
export function CardDescription({ className, children, ...props }) {
    return (<p className={cn('text-xs text-slate-500 leading-normal', className)} {...props}>
      {children}
    </p>);
}
export function CardContent({ className, children, ...props }) {
    return (<div className={cn('p-5', className)} {...props}>
      {children}
    </div>);
}
export function CardFooter({ className, children, ...props }) {
    return (<div className={cn('p-5 bg-slate-50/75 border-t border-slate-100 flex items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>);
}
