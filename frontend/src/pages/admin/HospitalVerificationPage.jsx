import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, ShieldAlert, ShieldCheck, AlertCircle, } from 'lucide-react';
import { verifyHospital, unverifyHospital, getPendingHospitals, createHospitalAccount, } from '@/api/admin.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/Card';
import { getApiErrorMessage, } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
export function HospitalVerificationPage() {
    const [hospitalProfileId, setHospitalProfileId] = useState('');
    const [hospitalAccount, setHospitalAccount] = useState({ fullName: '', email: '', password: '', phone: '' });
    const queryClient = useQueryClient();
    const { data: pendingHospitals = [], isLoading: pendingLoading } = useQuery({
      queryKey: ['admin', 'pending-hospitals'], queryFn: getPendingHospitals,
    });
    const { success, error: toastError } = useToast();
    const verifyMutation = useMutation({
        mutationFn: (id) => verifyHospital(id),
        onSuccess: () => {
            success('Hospital profile has been verified successfully.', 'Hospital Verified');
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-hospitals'] });
            setHospitalProfileId('');
        },
        onError: (error) => {
            toastError(getApiErrorMessage(error));
        },
    });
    const unverifyMutation = useMutation({
        mutationFn: (id) => unverifyHospital(id),
        onSuccess: () => {
            success('Hospital verification has been revoked.', 'Hospital Unverified');
            setHospitalProfileId('');
        },
        onError: (error) => {
            toastError(getApiErrorMessage(error));
        },
    });
    const createAccountMutation = useMutation({
        mutationFn: createHospitalAccount,
        onSuccess: () => {
            success('Hospital login created. Hospital staff can sign in and complete their facility profile.', 'Account Created');
            setHospitalAccount({ fullName: '', email: '', password: '', phone: '' });
        },
        onError: (error) => toastError(getApiErrorMessage(error)),
    });
    const handleVerify = (event) => {
        event.preventDefault();
        const id = hospitalProfileId.trim();
        if (!id) {
            toastError('Please enter a hospital profile ID.');
            return;
        }
        verifyMutation.mutate(id);
    };
    const handleUnverify = () => {
        const id = hospitalProfileId.trim();
        if (!id) {
            toastError('Please enter a hospital profile ID.');
            return;
        }
        unverifyMutation.mutate(id);
    };
    const isWorking = verifyMutation.isPending ||
        unverifyMutation.isPending;
    return (<PageContainer title="Hospital Verification" description="Verify or revoke verification for a hospital profile.">
      <div className="max-w-2xl">
        <Card>
          <CardHeader className="bg-teal-50/50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-900">
              <Building2 className="w-5 h-5 text-teal-600"/>
              Hospital Profile Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5"/>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Enter the hospital profile ID
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Choose a pending hospital below or enter its profile ID.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Input label="Hospital Profile ID" type="number" min={1} value={hospitalProfileId} onChange={(event) => setHospitalProfileId(event.target.value)} placeholder="Example: 1" required/>

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="success" size="md" isLoading={verifyMutation.isPending} disabled={isWorking} onClick={handleVerify} leftIcon={<ShieldCheck className="w-4 h-4"/>}>
                  Verify Hospital
                </Button>

                <Button type="button" variant="danger" size="md" isLoading={unverifyMutation.isPending} disabled={isWorking} onClick={handleUnverify} leftIcon={<ShieldAlert className="w-4 h-4"/>}>
                  Revoke Verification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Hospital Profiles</CardTitle></CardHeader>
          <CardContent className="space-y-2 p-5">
            {pendingLoading ? <p className="text-sm">Loading pending hospitals...</p> : pendingHospitals.length === 0 ? <p className="text-sm text-slate-500">No unverified hospitals in the current review page.</p> : pendingHospitals.map((hospital) => (
              <button key={hospital.id} type="button" className="block w-full text-left rounded-lg border border-slate-200 p-3 hover:bg-teal-50" onClick={() => setHospitalProfileId(String(hospital.id))}>
                <strong>{hospital.hospitalName}</strong> — #{hospital.id} · {hospital.city}
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Create Hospital Login</CardTitle></CardHeader>
          <CardContent className="p-5">
            <p className="text-xs text-slate-600 mb-3">Hospital staff can log in and create their facility profile after an administrator creates their account.</p>
            <form className="space-y-3" onSubmit={(event) => {
              event.preventDefault();
              if (hospitalAccount.password.length < 8) { toastError('Password must be at least 8 characters.'); return; }
              createAccountMutation.mutate(hospitalAccount);
            }}>
              {[
                ['fullName','Staff Full Name','text'],
                ['email','Staff Email','email'],
                ['password','Temporary Password (8+ characters)','password'],
                ['phone','Phone (optional)','tel'],
              ].map(([field, label, type]) => <Input key={field} label={label} type={type} value={hospitalAccount[field]} required={field !== 'phone'} onChange={(event) => setHospitalAccount((prev) => ({ ...prev, [field]: event.target.value }))}/>)}
              <Button type="submit" variant="primary" isLoading={createAccountMutation.isPending}>Create Hospital Account</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>);
}
