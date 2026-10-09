import React from 'react';
import { cn } from '@/lib/utils';
export const Select = React.forwardRef(({ className, label, error, helperText, options, children, id, ...props }, ref) => {
    const selectId = id || React.useId();
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    return (<div className="w-full">
        {label && (<label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>)}
        <select id={selectId} ref={ref} aria-invalid={!!error} aria-describedby={error ? errorId : helperText ? helperId : undefined} className={cn('w-full px-3.5 py-2 rounded-lg border bg-white text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:bg-slate-50', error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100', className)} {...props}>
          {options
            ? options.map((opt) => (<option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>))
            : children}
        </select>
        {error && (<p id={errorId} className="mt-1 text-xs text-rose-600 font-medium">
            {error}
          </p>)}
        {!error && helperText && (<p id={helperId} className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>)}
      </div>);
});
Select.displayName = 'Select';
