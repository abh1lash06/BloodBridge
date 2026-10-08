import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const { user, isAuthenticated, getRoleDashboardPath } = useAuth();
  const dashboardPath = isAuthenticated ? getRoleDashboardPath(user?.role) : '/';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex items-center gap-3">
        <Link to={dashboardPath}>
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
        <Button
          variant="outline"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
