import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, UserCheck, AlertCircle, } from 'lucide-react';
import { verifyDonor, rejectDonor, getPendingDonors } from '@/api/admin.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/Card';
import { getApiErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
export function DonorVerificationPage() {
    const [donorProfileId, setDonorProfileId] = useState('');
    const [reason, setReason] = useState('');
    const queryClient = useQueryClient();
    const { data: pendingDonors = [], isLoading: pendingLoading } = useQuery({
      queryKey: ['admin', 'pending-donors'], queryFn: getPendingDonors,
    });
    const { success, error: toastError } = useToast();
    const verifyMutation = useMutation({
        mutationFn: (id) => verifyDonor(id),
        onSuccess: () => {
            success('Donor profile has been verified successfully.', 'Donor Verified');
            setDonorProfileId('');
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-donors'] });
        },
        onError: (error) => {
            toastError(getApiErrorMessage(error));
        },
    });
    const rejectMutation = useMutation({
        mutationFn: (id) => rejectDonor(id, reason),
        onSuccess: () => {
            success('Donor profile rejected.', 'Donor Rejected');
            setDonorProfileId('');
            setReason('');
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-donors'] });
        },
        onError: (error) => toastError(getApiErrorMessage(error)),
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        const id = donorProfileId.trim();
        if (!id) {
            toastError('Please enter a donor profile ID.');
            return;
        }
        verifyMutation.mutate(id);
    };
    return (<PageContainer title="Donor Verification" description="Verify a donor profile using the donor profile ID.">
      <div className="max-w-2xl">
        <Card>
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <UserCheck className="w-5 h-5 text-indigo-600"/>
              Verify Donor Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5"/>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Enter the donor profile ID
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Choose a pending donor below or enter a donor profile ID.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Donor Profile ID" type="number" min={1} value={donorProfileId} onChange={(event) => setDonorProfileId(event.target.value)} placeholder="Example: 2" required/>

              <Input label="Rejection reason (optional)" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500}/>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="success" size="md" isLoading={verifyMutation.isPending} leftIcon={<ShieldCheck className="w-4 h-4"/>}>Verify Donor</Button>
                <Button type="button" variant="danger" size="md" isLoading={rejectMutation.isPending} onClick={() => donorProfileId.trim() ? rejectMutation.mutate(donorProfileId.trim()) : toastError('Select a donor ID first.')}>Reject Donor</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Donor Profiles</CardTitle></CardHeader>
          <CardContent className="space-y-2 p-5">
            {pendingLoading ? <p className="text-sm">Loading pending donors...</p> : pendingDonors.length === 0 ? <p className="text-sm text-slate-500">No pending donors in the current review page.</p> : pendingDonors.map((donor) => (
              <button key={donor.donorProfileId} type="button" className="block w-full text-left rounded-lg border border-slate-200 p-3 hover:bg-indigo-50" onClick={() => setDonorProfileId(String(donor.donorProfileId))}>
                <strong>{donor.fullName}</strong> — #{donor.donorProfileId} · {donor.bloodGroup?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>);
}
