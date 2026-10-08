import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Eye, EyeOff, ShieldAlert, AlertCircle } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login, getRoleDashboardPath } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await login(data);
      success(`Welcome back, ${response.fullName}!`, 'Signed in successfully');
      
      const from = (location.state as any)?.from?.pathname;
      if (from && !from.includes('/login') && !from.includes('/register')) {
        navigate(from, { replace: true });
      } else {
        const redirectPath = getRoleDashboardPath(response.role);
        navigate(redirectPath, { replace: true });
      }
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Blood<span className="text-rose-600">Bridge</span>
            </span>
          </Link>
        </div>
        <h2 className="text-center text-xl font-bold text-slate-900 tracking-tight">
          Sign In to BloodBridge
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Access your Patient, Donor, Hospital, or Admin dashboard
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Authentication</CardTitle>
            <CardDescription>
              Enter your registered email and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {serverError && (
              <div
                role="alert"
                className="mb-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1 leading-relaxed">{serverError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="w-full">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  Register as Patient or Donor
                </Link>
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Hospital and Admin accounts are provisioned by system administration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
