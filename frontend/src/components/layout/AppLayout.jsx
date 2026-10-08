import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
export function AppLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex", children: [_jsx("div", { className: "hidden lg:flex lg:flex-shrink-0 lg:w-64 fixed inset-y-0 z-40", children: _jsx(Sidebar, {}) }), _jsx(MobileNavigation, { isOpen: mobileMenuOpen, onClose: () => setMobileMenuOpen(false) }), _jsxs("div", { className: "lg:pl-64 flex flex-col flex-1 w-full min-w-0", children: [_jsx(Header, { onOpenMobileMenu: () => setMobileMenuOpen(true) }), _jsx("main", { className: "flex-1 pb-12", children: _jsx(Outlet, {}) })] })] }));
}
