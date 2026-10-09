import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
export function ErrorState({ title = 'Something went wrong', message = 'An unexpected error occurred while communicating with the server.', onRetry, className, }) {
    return (<div className={cn('flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-rose-200 shadow-xs', className)}>
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7"/>
      </div>
      <h4 className="text-base font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-600 max-w-md mb-5 leading-relaxed">{message}</p>
      {onRetry && (<Button variant="outline" size="md" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4"/>}>
          Try Again
        </Button>)}
    </div>);
}
