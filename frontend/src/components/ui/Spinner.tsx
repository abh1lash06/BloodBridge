import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status">
      <Loader2 className={cn('animate-spin text-rose-600', sizeClasses[size], className)} />
      {label && <p className="text-xs text-slate-500 font-medium">{label}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
