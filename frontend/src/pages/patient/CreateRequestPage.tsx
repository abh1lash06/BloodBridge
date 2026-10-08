import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBloodRequest } from '@/api/patient.api';
import { patientRequestSchema, PatientRequestFormData } from '@/lib/validation';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ALL_DISPLAY_BLOOD_GROUPS, getApiErrorMessage } from '@/lib/utils';
import { ArrowLeft, AlertCircle, Droplet } from 'lucide-react';

export function CreateRequestPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { success } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tomorrow's date as default requiredDate
  const defaultRequiredDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientRequestFormData>({
    resolver: zodResolver(patientRequestSchema),
    defaultValues: {
      bloodGroup: 'O+',
      unitsRequired: 1,
      hospitalName: '',
      hospitalAddress: '',
      urgency: 'NORMAL',
      requiredDate: defaultRequiredDate,
      additionalNotes: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createBloodRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      success('Emergency blood request created successfully!', 'Request Created');
      if (data?.id) {
        navigate(`/patient/requests/${data.id}`);
      } else {
        navigate('/patient/requests');
      }
    },
    onError: (err) => {
      setServerError(getApiErrorMessage(err));
    },
  });

  const onSubmit = async (data: PatientRequestFormData) => {
    setServerError(null);
    createMutation.mutate(data);
  };

  return (
    <PageContainer
      title="Create Emergency Blood Request"
      description="Specify patient blood requirements, target hospital, and urgency to initiate matching."
      action={
        <Link to="/patient/requests">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Requests
          </Button>
        </Link>
      }
    >
      <div className="max-w-2xl mx-auto">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-base">Request Specification</CardTitle>
            </div>
            <CardDescription>
              All registered donors matching this blood type will be alerted upon creation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {serverError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1 leading-relaxed">{serverError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Blood Group Required"
                  required
                  error={errors.bloodGroup?.message}
                  {...register('bloodGroup')}
                >
                  {ALL_DISPLAY_BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Units Required (Pints/Bags)"
                  type="number"
                  min={1}
                  max={50}
                  required
                  error={errors.unitsRequired?.message}
                  {...register('unitsRequired', { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Urgency Level"
                  required
                  error={errors.urgency?.message}
                  {...register('urgency')}
                >
                  <option value="NORMAL">Normal (Standard Schedule)</option>
                  <option value="URGENT">Urgent (Within 24 Hours)</option>
                  <option value="CRITICAL">Critical (Immediate Emergency)</option>
                </Select>

                <Input
                  label="Required By Date"
                  type="date"
                  required
                  error={errors.requiredDate?.message}
                  {...register('requiredDate')}
                />
              </div>

              <Input
                label="Hospital / Clinic Name"
                type="text"
                placeholder="e.g. City General Hospital, Emergency Ward 3"
                required
                error={errors.hospitalName?.message}
                {...register('hospitalName')}
              />

              <Input
                label="Hospital Address / Location"
                type="text"
                placeholder="e.g. 450 Medical Center Blvd, Floor 2"
                error={errors.hospitalAddress?.message}
                {...register('hospitalAddress')}
              />

              <Textarea
                label="Additional Clinical Notes / Instructions (Optional)"
                placeholder="e.g. Patient is undergoing surgery at 9 AM. Contact Dr. Smith at desk."
                rows={3}
                error={errors.additionalNotes?.message}
                {...register('additionalNotes')}
              />

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link to="/patient/requests">
                  <Button type="button" variant="outline" size="md">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending
                    ? 'Submitting Request...'
                    : 'Publish Blood Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
