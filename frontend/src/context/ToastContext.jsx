import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const addToast = useCallback(({ type, title, message, duration = 4000 }) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);
    const success = useCallback((message, title) => addToast({ type: 'success', message, title }), [addToast]);
    const error = useCallback((message, title) => addToast({ type: 'error', message, title: title || 'Error' }), [addToast]);
    const info = useCallback((message, title) => addToast({ type: 'info', message, title }), [addToast]);
    const warning = useCallback((message, title) => addToast({ type: 'warning', message, title }), [addToast]);
    return (_jsx(ToastContext.Provider, { value: { toasts, addToast, removeToast, success, error, info, warning }, children: children }));
}
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
