import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', isLoading = false, }) {
    const getIcon = () => {
        if (variant === 'danger') {
            return (_jsx("div", { className: "w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600", children: _jsx(AlertCircle, { className: "w-5 h-5" }) }));
        }
        if (variant === 'success') {
            return (_jsx("div", { className: "w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600", children: _jsx(HelpCircle, { className: "w-5 h-5" }) }));
        }
        return (_jsx("div", { className: "w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600", children: _jsx(AlertTriangle, { className: "w-5 h-5" }) }));
    };
    return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, maxWidth: "sm", children: [_jsxs("div", { className: "flex gap-4 items-start", children: [getIcon(), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-base font-semibold text-slate-900 mb-1", children: title }), _jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: message })] })] }), _jsxs("div", { className: "mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100", children: [_jsx(Button, { type: "button", variant: "outline", size: "md", onClick: onClose, disabled: isLoading, children: cancelText }), _jsx(Button, { type: "button", variant: variant, size: "md", onClick: onConfirm, isLoading: isLoading, children: confirmText })] })] }));
}
