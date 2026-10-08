import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import apiClient from '@/api/client';
import { getHospitalProfile } from '@/api/hospital.api';

import {
  hospitalProfileSchema,
  HospitalProfileFormData,
} from '@/lib/validation';

import { useToast } from '@/hooks/useToast';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';

import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

import { getApiErrorMessage } from '@/lib/utils';

import {
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export function HospitalProfilePage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const { success } = useToast();

  const queryClient = useQueryClient();

  /*
   * =========================================================
   * HOSPITAL PROFILE QUERY
   * =========================================================
   */

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['hospital', 'profile'],
    queryFn: getHospitalProfile,
    retry: false,
  });

  /*
   * =========================================================
   * FORM
   * =========================================================
   */

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<HospitalProfileFormData>({
    resolver: zodResolver(
      hospitalProfileSchema
    ),

    defaultValues: {
      hospitalName: '',
      registrationNumber: '',
      address: '',
      city: '',
      state: '',
      phone: '',
    },
  });

  /*
   * =========================================================
   * LOAD EXISTING PROFILE INTO FORM
   * =========================================================
   */

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      hospitalName:
        profile.hospitalName || '',

      registrationNumber:
        profile.registrationNumber || '',

      address:
        profile.address || '',

      city:
        profile.city || '',

      state:
        profile.state || '',

      phone:
        profile.phone || '',
    });
  }, [profile, reset]);

  /*
   * =========================================================
   * DETECT "PROFILE NOT FOUND"
   * =========================================================
   *
   * Backend returns:
   *
   * {
   *   "message": "Hospital profile not found"
   * }
   *
   * In this situation we show the CREATE form.
   * =========================================================
   */

  const backendMessage =
    (error as any)?.response?.data?.message ||
    '';

  const profileNotFound =
    isError &&
    backendMessage ===
      'Hospital profile not found';

  /*
   * =========================================================
   * CREATE PROFILE
   * =========================================================
   */

  const createMutation = useMutation({
    mutationFn: async (
      data: HospitalProfileFormData
    ) => {
      const response =
        await apiClient.post(
          '/api/hospital/profile',
          data
        );

      return response.data;
    },

    onSuccess: () => {
      setServerError(null);

      queryClient.invalidateQueries({
        queryKey: ['hospital', 'profile'],
      });

      queryClient.invalidateQueries({
        queryKey: ['hospital', 'inventory'],
      });

      queryClient.invalidateQueries({
        queryKey: ['hospital', 'reservations'],
      });

      success(
        'Hospital facility profile created successfully. It is now pending administrator verification.',
        'Profile Created'
      );
    },

    onError: (err) => {
      setServerError(
        getApiErrorMessage(err)
      );
    },
  });

  /*
   * =========================================================
   * UPDATE PROFILE
   * =========================================================
   */

  const updateMutation = useMutation({
    mutationFn: async (
      data: HospitalProfileFormData
    ) => {
      const response =
        await apiClient.put(
          '/api/hospital/profile',
          data
        );

      return response.data;
    },

    onSuccess: () => {
      setServerError(null);

      queryClient.invalidateQueries({
        queryKey: ['hospital', 'profile'],
      });

      success(
        'Hospital facility details updated successfully!',
        'Profile Saved'
      );
    },

    onError: (err) => {
      setServerError(
        getApiErrorMessage(err)
      );
    },
  });

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const onSubmit = (
    data: HospitalProfileFormData
  ) => {
    setServerError(null);

    /*
     * No profile exists:
     * POST /api/hospital/profile
     *
     * Existing profile:
     * PUT /api/hospital/profile
     */

    if (profileNotFound) {
      createMutation.mutate(data);
      return;
    }

    updateMutation.mutate(data);
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isLoading) {
    return (
      <PageContainer
        title="Hospital Facility Profile"
        description="Hospital accreditation details, license numbers, and medical facility contact information."
      >
        <div className="py-20 flex justify-center">
          <Spinner
            size="lg"
            label="Loading hospital profile..."
          />
        </div>
      </PageContainer>
    );
  }

  /*
   * =========================================================
   * PROFILE NOT FOUND
   *
   * This is NOT a fatal error.
   *
   * Show the create profile form.
   * =========================================================
   */

  if (profileNotFound) {
    return (
      <PageContainer
        title="Create Hospital Facility Profile"
        description="Register your medical facility before managing blood inventory and reservations."
      >
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>

                <div>
                  <CardTitle className="text-sm font-semibold text-slate-800">
                    Facility Profile Required
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Your hospital account is active, but
                    a facility profile has not been created
                    yet. Complete the details below to
                    register the hospital.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {serverError && (
                <div
                  role="alert"
                  className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />

                  <div className="flex-1 leading-relaxed">
                    {serverError}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* HOSPITAL NAME + REGISTRATION */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Hospital / Clinic Name"
                    type="text"
                    required
                    placeholder="Test Hospital Hyderabad"
                    error={
                      errors.hospitalName?.message
                    }
                    {...register(
                      'hospitalName'
                    )}
                  />

                  <Input
                    label="Medical Registration / License Number"
                    type="text"
                    required
                    placeholder="HOSP-TEST-001"
                    error={
                      errors.registrationNumber
                        ?.message
                    }
                    {...register(
                      'registrationNumber'
                    )}
                  />
                </div>

                {/* ADDRESS */}

                <Input
                  label="Facility Street Address"
                  type="text"
                  required
                  placeholder="Banjara Hills, Hyderabad"
                  error={
                    errors.address?.message
                  }
                  {...register('address')}
                />

                {/* CITY / STATE / PHONE */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    required
                    placeholder="Hyderabad"
                    error={
                      errors.city?.message
                    }
                    {...register('city')}
                  />

                  <Input
                    label="State / Province"
                    type="text"
                    required
                    placeholder="Telangana"
                    error={
                      errors.state?.message
                    }
                    {...register('state')}
                  />

                  <Input
                    label="Contact Phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    error={
                      errors.phone?.message
                    }
                    {...register('phone')}
                  />
                </div>

                {/* INFO */}

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />

                    <div className="text-xs text-blue-800 leading-relaxed">
                      After submission, the hospital
                      profile will be marked as
                      <strong>
                        {' '}
                        Pending Administrator Review
                      </strong>
                      . An administrator must verify the
                      facility before it becomes an
                      accredited facility.
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={
                      isSubmitting ||
                      createMutation.isPending
                    }
                    leftIcon={
                      <Building2 className="w-4 h-4" />
                    }
                  >
                    {createMutation.isPending ||
                    isSubmitting
                      ? 'Creating Facility...'
                      : 'Create Facility Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  /*
   * =========================================================
   * OTHER ERRORS
   * =========================================================
   */

  if (isError) {
    return (
      <PageContainer
        title="Hospital Facility Profile"
        description="Hospital accreditation details, license numbers, and medical facility contact information."
      >
        <ErrorState
          title="Could not load profile"
          message={
            getApiErrorMessage(error) ||
            'Failed to retrieve facility details from backend.'
          }
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  /*
   * =========================================================
   * EXISTING PROFILE
   * =========================================================
   */

  const isVerified =
    profile?.verified === true ||
    profile?.verificationStatus ===
      'VERIFIED';

  const isSaving =
    isSubmitting ||
    updateMutation.isPending;

  return (
    <PageContainer
      title="Hospital Facility Profile"
      description="Hospital accreditation details, license numbers, and medical facility contact information."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===================================================
            VERIFICATION STATUS
            =================================================== */}

        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Accreditation Status
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Verification Status
              </span>

              <div className="flex items-center gap-2">
                {isVerified ? (
                  <Badge variant="verified">
                    Accredited Facility
                  </Badge>
                ) : (
                  <Badge variant="pending">
                    Pending Administrator Review
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isVerified
                  ? 'This medical center is verified to manage inventory and reserve blood units.'
                  : 'System administrators review licenses prior to active emergency blood operations.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Registration / License
              </span>

              <p className="text-sm font-bold text-slate-900">
                {profile?.registrationNumber ||
                  'Not configured'}
              </p>
            </div>

            {isVerified && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />

                  <span className="text-xs font-semibold">
                    Facility Verified
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===================================================
            EDIT FORM
            =================================================== */}

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Facility Information
              </CardTitle>

              <CardDescription>
                Keep contact telephone and address up to
                date for emergency donor dispatch.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {serverError && (
                <div
                  role="alert"
                  className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />

                  <div className="flex-1 leading-relaxed">
                    {serverError}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Hospital / Clinic Name"
                    type="text"
                    required
                    error={
                      errors.hospitalName?.message
                    }
                    {...register(
                      'hospitalName'
                    )}
                  />

                  <Input
                    label="Medical Registration / License Number"
                    type="text"
                    required
                    error={
                      errors.registrationNumber
                        ?.message
                    }
                    {...register(
                      'registrationNumber'
                    )}
                  />
                </div>

                <Input
                  label="Facility Street Address"
                  type="text"
                  required
                  error={
                    errors.address?.message
                  }
                  {...register('address')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    required
                    error={
                      errors.city?.message
                    }
                    {...register('city')}
                  />

                  <Input
                    label="State / Province"
                    type="text"
                    required
                    error={
                      errors.state?.message
                    }
                    {...register('state')}
                  />

                  <Input
                    label="Contact Phone"
                    type="tel"
                    required
                    error={
                      errors.phone?.message
                    }
                    {...register('phone')}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSaving}
                  >
                    {isSaving
                      ? 'Saving Facility...'
                      : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}