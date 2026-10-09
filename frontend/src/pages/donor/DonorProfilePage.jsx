import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDonorProfile, saveDonorProfile, updateDonorAvailability } from '@/api/donor.api';
import { donorProfileUpdateSchema } from '@/lib/validation';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { ALL_DISPLAY_BLOOD_GROUPS, toDisplayBloodGroup, formatDate, getApiErrorMessage } from '@/lib/utils';
import { Power, AlertCircle } from 'lucide-react';
export function DonorProfilePage() {
    const [serverError, setServerError] = useState(null);
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    const { data: profile, isLoading, isError, refetch, } = useQuery({
        queryKey: ['donor', 'profile'],
        queryFn: getDonorProfile,
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(donorProfileUpdateSchema),
        defaultValues: {
            bloodGroup: 'O+',
            dateOfBirth: '1995-01-01',
            gender: 'MALE',
            address: '',
        },
    });
    useEffect(() => {
        if (profile) {
            reset({
                bloodGroup: toDisplayBloodGroup(profile.bloodGroup) || 'O+',
                dateOfBirth: profile.dateOfBirth?.split('T')[0] || '1995-01-01',
                gender: profile.gender || 'MALE',
                address: profile.address || '',
            });
        }
    }, [profile, reset]);
    const saveMutation = useMutation({
        mutationFn: saveDonorProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donor', 'profile'] });
            success('Donor profile updated successfully!', 'Profile Saved');
            setServerError(null);
        },
        onError: (err) => {
            setServerError(getApiErrorMessage(err));
        },
    });
    const availabilityMutation = useMutation({
        mutationFn: (newStatus) => updateDonorAvailability(newStatus),
        onSuccess: (_, newStatus) => {
            queryClient.invalidateQueries({ queryKey: ['donor', 'profile'] });
            success(newStatus ? 'You are now available for donation matches.' : 'Marked as unavailable.', 'Availability Updated');
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    const onSubmit = (data) => {
        setServerError(null);
        saveMutation.mutate(data);
    };
    const isAvailable = profile?.available ?? false;
    return (<PageContainer title="Donor Medical Profile" description="Maintain your blood donation eligibility, clinical details, and real-time availability.">
      {isLoading ? (<div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading donor profile..."/>
        </div>) : isError ? (<ErrorState title="Could not load profile" message="Failed to retrieve donor profile details from backend." onRetry={() => refetch()}/>) : (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status & Availability Overview Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Verification & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Medical Verification
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={profile?.verificationStatus || 'PENDING'}/>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {profile?.verificationStatus === 'VERIFIED'
                ? 'Your donor profile is medically verified by administrator.'
                : profile?.verificationStatus === 'REJECTED'
                    ? 'Your donor verification was declined. Please contact admin.'
                    : 'Verification is currently pending administrative review.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Donation Availability
                  </span>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {isAvailable ? (<Badge variant="verified">Available to Donate</Badge>) : (<Badge variant="cancelled">Currently Unavailable</Badge>)}
                    </div>
                    <Button variant={isAvailable ? 'outline' : 'success'} size="sm" onClick={() => availabilityMutation.mutate(!isAvailable)} isLoading={availabilityMutation.isPending} leftIcon={<Power className="w-3.5 h-3.5"/>}>
                      {isAvailable ? 'Go Unavailable' : 'Make Available'}
                    </Button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Last Donation Date
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {profile?.lastDonationDate
                ? formatDate(profile.lastDonationDate)
                : 'No previous donations recorded'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Donor Clinical Information
                </CardTitle>
                <CardDescription>
                  Accurate blood group and address are required for rapid emergency matching.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {serverError && (<div role="alert" className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5"/>
                    <div className="flex-1 leading-relaxed">{serverError}</div>
                  </div>)}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select label="Blood Group (fixed at registration)" disabled value={toDisplayBloodGroup(profile?.bloodGroup) || 'O+'}>
                      {ALL_DISPLAY_BLOOD_GROUPS.map((bg) => (<option key={bg} value={bg}>
                          {bg}
                        </option>))}
                    </Select>

                    <Select label="Gender" required error={errors.gender?.message} {...register('gender')}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </div>

                  <Input label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth')}/>

                  <Input label="Residential Address / City" type="text" placeholder="e.g. 124 Park Ave, Metropolis" required error={errors.address?.message} {...register('address')}/>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" variant="primary" size="md" isLoading={isSubmitting || saveMutation.isPending}>
                      {isSubmitting || saveMutation.isPending
                ? 'Saving Profile...'
                : 'Save Profile Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>)}
    </PageContainer>);
}
