import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import {
  verifyHospital,
  unverifyHospital,
} from '@/api/admin.api';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

import {
  getApiErrorMessage,
} from '@/lib/utils';

import { useToast } from '@/hooks/useToast';

export function HospitalVerificationPage() {
  const [hospitalProfileId, setHospitalProfileId] =
    useState('');

  const { success, error: toastError } =
    useToast();

  const verifyMutation = useMutation({
    mutationFn: (id: string) =>
      verifyHospital(id),

    onSuccess: () => {
      success(
        'Hospital profile has been verified successfully.',
        'Hospital Verified'
      );

      setHospitalProfileId('');
    },

    onError: (error) => {
      toastError(
        getApiErrorMessage(error)
      );
    },
  });

  const unverifyMutation = useMutation({
    mutationFn: (id: string) =>
      unverifyHospital(id),

    onSuccess: () => {
      success(
        'Hospital verification has been revoked.',
        'Hospital Unverified'
      );

      setHospitalProfileId('');
    },

    onError: (error) => {
      toastError(
        getApiErrorMessage(error)
      );
    },
  });

  const handleVerify = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const id = hospitalProfileId.trim();

    if (!id) {
      toastError(
        'Please enter a hospital profile ID.'
      );
      return;
    }

    verifyMutation.mutate(id);
  };

  const handleUnverify = () => {
    const id = hospitalProfileId.trim();

    if (!id) {
      toastError(
        'Please enter a hospital profile ID.'
      );
      return;
    }

    unverifyMutation.mutate(id);
  };

  const isWorking =
    verifyMutation.isPending ||
    unverifyMutation.isPending;

  return (
    <PageContainer
      title="Hospital Verification"
      description="Verify or revoke verification for a hospital profile."
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader className="bg-teal-50/50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-900">
              <Building2 className="w-5 h-5 text-teal-600" />
              Hospital Profile Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Enter the hospital profile ID
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The current backend exposes verify and
                  unverify actions. It does not expose an
                  admin hospital-list endpoint.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Input
                label="Hospital Profile ID"
                type="number"
                min={1}
                value={hospitalProfileId}
                onChange={(event) =>
                  setHospitalProfileId(
                    event.target.value
                  )
                }
                placeholder="Example: 1"
                required
              />

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="success"
                  size="md"
                  isLoading={
                    verifyMutation.isPending
                  }
                  disabled={isWorking}
                  onClick={handleVerify}
                  leftIcon={
                    <ShieldCheck className="w-4 h-4" />
                  }
                >
                  Verify Hospital
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  isLoading={
                    unverifyMutation.isPending
                  }
                  disabled={isWorking}
                  onClick={handleUnverify}
                  leftIcon={
                    <ShieldAlert className="w-4 h-4" />
                  }
                >
                  Revoke Verification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}