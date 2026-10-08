import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'md', }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const maxWidths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (_jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": title ? 'modal-title' : undefined, "aria-describedby": description ? 'modal-description' : undefined, className: "fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6", children: [_jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity", onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { ref: dialogRef, className: cn('relative w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 overflow-hidden transform transition-all', maxWidths[maxWidth]), children: [_jsxs("div", { className: "flex items-start justify-between p-5 border-b border-slate-100", children: [_jsxs("div", { children: [title && (_jsx("h3", { id: "modal-title", className: "text-lg font-semibold text-slate-900", children: title })), description && (_jsx("p", { id: "modal-description", className: "text-sm text-slate-500 mt-0.5", children: description }))] }), _jsx("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100", "aria-label": "Close dialog", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-5", children: children })] })] }));
}
