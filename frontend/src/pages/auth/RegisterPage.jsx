import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ALL_DISPLAY_BLOOD_GROUPS } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShieldAlert, AlertCircle, Heart, User } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils';
export function RegisterPage() {
    const [serverError, setServerError] = useState(null);
    const { register: authRegister, login, getRoleDashboardPath } = useAuth();
    const { success } = useToast();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            role: 'PATIENT',
            phone: '',
            bloodGroup: '',
            dateOfBirth: '',
            gender: '',
            address: '',
        },
    });
    const selectedRole = watch('role');
    const onSubmit = async (data) => {
        setServerError(null);
        try {
            await authRegister(data);
            success('Account created successfully! Signing you in...', 'Registration Complete');
            // Auto login after registration
            try {
                const loginRes = await login({ email: data.email, password: data.password });
                navigate(getRoleDashboardPath(loginRes.role), { replace: true });
            }
            catch {
                navigate('/login');
            }
        }
        catch (err) {
            const msg = getApiErrorMessage(err);
            setServerError(msg);
        }
    };
    return (<div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <ShieldAlert className="w-6 h-6 text-white"/>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Blood<span className="text-rose-600">Bridge</span>
            </span>
          </Link>
        </div>
        <h2 className="text-center text-xl font-bold text-slate-900 tracking-tight">
          Create Your Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Join the emergency network as a Patient or Donor
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Account Type</CardTitle>
            <CardDescription>
              Choose whether you are requesting blood or registering to donate.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {serverError && (<div role="alert" className="mb-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5"/>
                <div className="flex-1 leading-relaxed">{serverError}</div>
              </div>)}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setValue('role', 'PATIENT')} className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${selectedRole === 'PATIENT'
            ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-semibold ring-2 ring-rose-600/20'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                    <User className="w-5 h-5 text-rose-600"/>
                    <span className="text-xs">Patient / Family</span>
                  </button>

                  <button type="button" onClick={() => setValue('role', 'DONOR')} className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${selectedRole === 'DONOR'
            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-2 ring-indigo-600/20'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                    <Heart className="w-5 h-5 text-indigo-600"/>
                    <span className="text-xs">Blood Donor</span>
                  </button>
                </div>
                {errors.role && (<p className="mt-1 text-xs text-rose-600 font-medium">
                    {errors.role.message}
                  </p>)}
              </div>

              <Input label="Full Name" type="text" autoComplete="name" placeholder="John Doe" required error={errors.fullName?.message} {...register('fullName')}/>

              <Input label="Email Address" type="email" autoComplete="email" placeholder="you@example.com" required error={errors.email?.message} {...register('email')}/>

              <Input label="Phone Number" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register('phone')}/>

              {selectedRole === 'DONOR' && (<div className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-xs font-semibold text-indigo-900">Donor Profile Details</p>
                <Select label="Blood Group" required error={errors.bloodGroup?.message} {...register('bloodGroup')}>
                  <option value="">Select blood group</option>
                  {ALL_DISPLAY_BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
                </Select>
                <Input label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth')}/>
                <Select label="Gender" required error={errors.gender?.message} {...register('gender')}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
                <Input label="Address" type="text" required error={errors.address?.message} {...register('address')}/>
              </div>)}

              <Input label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required error={errors.password?.message} {...register('password')}/>

              <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-700 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);
}
