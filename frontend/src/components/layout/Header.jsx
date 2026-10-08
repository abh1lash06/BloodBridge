import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from 'lucide-react';
import { NotificationBell } from '@/components/common/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
export function Header({ onOpenMobileMenu, title }) {
    const { user } = useAuth();
    return (_jsxs("header", { className: "h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "button", onClick: onOpenMobileMenu, className: "lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors", "aria-label": "Open sidebar menu", children: _jsx(Menu, { className: "w-5 h-5" }) }), title && (_jsx("h1", { className: "text-lg font-semibold text-slate-900 tracking-tight", children: title }))] }), _jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [_jsx(NotificationBell, {}), _jsxs("div", { className: "hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-semibold text-xs flex items-center justify-center uppercase", children: user?.fullName?.charAt(0) || 'U' }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-xs font-semibold text-slate-800 leading-tight", children: user?.fullName }), _jsx("p", { className: "text-[10px] text-slate-500 font-medium leading-tight mt-0.5", children: user?.role })] })] })] })] }));
}
