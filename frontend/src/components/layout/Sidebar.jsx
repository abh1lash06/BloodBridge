import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, FilePlus, ListOrdered, UserCheck, Building2, Package, CalendarCheck, ShieldAlert, Bell, LogOut, User, HeartHandshake, } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Sidebar({ onCloseMobile }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
        if (onCloseMobile)
            onCloseMobile();
    };
    const getNavItems = () => {
        switch (user?.role) {
            case 'PATIENT':
                return [
                    { name: 'Dashboard', to: '/patient/dashboard', icon: LayoutDashboard },
                    { name: 'My Requests', to: '/patient/requests', icon: ListOrdered },
                    { name: 'Create Request', to: '/patient/requests/new', icon: FilePlus },
                    { name: 'Notifications', to: '/notifications', icon: Bell },
                ];
            case 'DONOR':
                return [
                    { name: 'Dashboard', to: '/donor/dashboard', icon: LayoutDashboard },
                    { name: 'My Profile', to: '/donor/profile', icon: User },
                    { name: 'Match Inbox', to: '/donor/matches', icon: HeartHandshake },
                    { name: 'Notifications', to: '/notifications', icon: Bell },
                ];
            case 'HOSPITAL':
                return [
                    { name: 'Dashboard', to: '/hospital/dashboard', icon: LayoutDashboard },
                    { name: 'Hospital Profile', to: '/hospital/profile', icon: Building2 },
                    { name: 'Blood Inventory', to: '/hospital/inventory', icon: Package },
                    { name: 'Reservations', to: '/hospital/reservations', icon: CalendarCheck },
                    { name: 'Notifications', to: '/notifications', icon: Bell },
                ];
            case 'ADMIN':
                return [
                    { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
                    { name: 'Donor Verification', to: '/admin/donors', icon: UserCheck },
                    { name: 'Hospital Verification', to: '/admin/hospitals', icon: Building2 },
                    { name: 'Notifications', to: '/notifications', icon: Bell },
                ];
            default:
                return [];
        }
    };
    const navItems = getNavItems();
    const getRoleBadge = () => {
        switch (user?.role) {
            case 'PATIENT':
                return _jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800", children: "Patient" });
            case 'DONOR':
                return _jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800", children: "Donor" });
            case 'HOSPITAL':
                return _jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800", children: "Hospital" });
            case 'ADMIN':
                return _jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800", children: "Admin" });
            default:
                return null;
        }
    };
    return (_jsxs("aside", { className: "w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800", children: [_jsxs("div", { className: "p-5 border-b border-slate-800/80 flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold shadow-md shadow-rose-900/40", children: _jsx(ShieldAlert, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsxs("span", { className: "text-lg font-bold text-white tracking-tight leading-tight block", children: ["Blood", _jsx("span", { className: "text-rose-500", children: "Bridge" })] }), _jsx("span", { className: "text-[11px] text-slate-400 font-medium", children: "Emergency Network" })] })] }), _jsxs("div", { className: "px-5 py-4 border-b border-slate-800/60 bg-slate-950/40", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "text-xs font-semibold text-slate-200 truncate max-w-[130px]", children: user?.fullName || 'User' }), getRoleBadge()] }), _jsx("p", { className: "text-[11px] text-slate-400 truncate", children: user?.email })] }), _jsx("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto", children: navItems.map((item) => {
                    const Icon = item.icon;
                    return (_jsxs(NavLink, { to: item.to, onClick: onCloseMobile, className: ({ isActive }) => cn('flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'), children: [_jsx(Icon, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: item.name })] }, item.to));
                }) }), _jsx("div", { className: "p-3 border-t border-slate-800", children: _jsxs("button", { type: "button", onClick: handleLogout, className: "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 transition-colors", children: [_jsx(LogOut, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: "Sign Out" })] }) })] }));
}
