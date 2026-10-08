import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ShieldX, Home } from 'lucide-react';

export function ForbiddenPage() {
  const { user, isAuthenticated, getRoleDashboardPath } = useAuth();
  const dashboardPath = isAuthenticated ? getRoleDashboardPath(user?.role) : '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
        <ShieldX className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        Access Restricted (403)
      </h1>
      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        You do not have permission to access this page. Please return to your authorized role dashboard.
      </p>
      <Link to={dashboardPath}>
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Go to Your Dashboard
        </Button>
      </Link>
    </div>
  );
}
