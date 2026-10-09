import { Menu } from 'lucide-react';
import { NotificationBell } from '@/components/common/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
export function Header({ onOpenMobileMenu, title }) {
    const { user } = useAuth();
    return (<header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenMobileMenu} className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors" aria-label="Open sidebar menu">
          <Menu className="w-5 h-5"/>
        </button>
        {title && (<h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>)}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <NotificationBell />

        {/* User preview */}
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-semibold text-xs flex items-center justify-center uppercase">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>);
}
