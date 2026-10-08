import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

import { verifyDonor } from '@/api/admin.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { getApiErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

export function DonorVerificationPage() {
  const [donorProfileId, setDonorProfileId] =
    useState('');

  const { success, error: toastError } =
    useToast();

  const verifyMutation = useMutation({
    mutationFn: (id: string) => verifyDonor(id),

    onSuccess: () => {
      success(
        'Donor profile has been verified successfully.',
        'Donor Verified'
      );

      setDonorProfileId('');
    },

    onError: (error) => {
      toastError(getApiErrorMessage(error));
    },
  });

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const id = donorProfileId.trim();

    if (!id) {
      toastError(
        'Please enter a donor profile ID.'
      );
      return;
    }

    verifyMutation.mutate(id);
  };

  return (
    <PageContainer
      title="Donor Verification"
      description="Verify a donor profile using the donor profile ID."
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Verify Donor Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Enter the donor profile ID
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The current backend exposes the donor
                  verification action but does not expose
                  an admin donor-list endpoint.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <Input
                label="Donor Profile ID"
                type="number"
                min={1}
                value={donorProfileId}
                onChange={(event) =>
                  setDonorProfileId(event.target.value)
                }
                placeholder="Example: 2"
                required
              />

              <Button
                type="submit"
                variant="success"
                size="md"
                isLoading={verifyMutation.isPending}
                leftIcon={
                  <ShieldCheck className="w-4 h-4" />
                }
              >
                Verify Donor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}