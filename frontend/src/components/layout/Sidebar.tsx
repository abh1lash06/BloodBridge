import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FilePlus,
  ListOrdered,
  UserCheck,
  Building2,
  Package,
  CalendarCheck,
  ShieldAlert,
  Bell,
  LogOut,
  User,
  HeartHandshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
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
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">Patient</span>;
      case 'DONOR':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">Donor</span>;
      case 'HOSPITAL':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Hospital</span>;
      case 'ADMIN':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Admin</span>;
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold shadow-md shadow-rose-900/40">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight leading-tight block">
            Blood<span className="text-rose-500">Bridge</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Emergency Network</span>
        </div>
      </div>

      {/* User Info Bar */}
      <div className="px-5 py-4 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
            {user?.fullName || 'User'}
          </p>
          {getRoleBadge()}
        </div>
        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="p-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
