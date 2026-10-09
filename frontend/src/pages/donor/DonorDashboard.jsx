import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getDonorProfile, updateDonorAvailability, getDonorMatches } from '@/api/donor.api';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { toDisplayBloodGroup, formatDate, getApiErrorMessage } from '@/lib/utils';
import { Heart, User, HeartHandshake, ArrowRight, Droplet, Power, } from 'lucide-react';
export function DonorDashboard() {
    const { user } = useAuth();
    const { notifications } = useNotifications();
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile, } = useQuery({
        queryKey: ['donor', 'profile'],
        queryFn: getDonorProfile,
    });
    const { data: matches = [], isLoading: isMatchesLoading, } = useQuery({
        queryKey: ['donor', 'matches'],
        queryFn: getDonorMatches,
    });
    const availabilityMutation = useMutation({
        mutationFn: (newStatus) => updateDonorAvailability(newStatus),
        onSuccess: (_, newStatus) => {
            queryClient.invalidateQueries({ queryKey: ['donor', 'profile'] });
            success(newStatus ? 'You are marked as Available to donate!' : 'You are now marked as Unavailable.', 'Availability Updated');
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    const pendingMatches = matches.filter((m) => m.status === 'PENDING');
    const acceptedMatches = matches.filter((m) => m.status === 'ACCEPTED');
    const toggleAvailability = () => {
        const currentStatus = profile?.available ?? true;
        availabilityMutation.mutate(!currentStatus);
    };
    return (<PageContainer title={`Welcome, ${profile?.fullName || user?.fullName || 'Donor'}`} description="Manage your blood donor profile, toggle donation availability, and respond to urgent hospital match alerts." action={<Link to="/donor/matches">
          <Button variant="primary" size="md" leftIcon={<HeartHandshake className="w-4 h-4"/>}>
            View Match Inbox ({pendingMatches.length})
          </Button>
        </Link>}>
      {/* Top Banner: Verification & Availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile / Blood Group Card */}
        <Card className="border-rose-100 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Blood Group
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-black text-rose-600">
                  {profile?.bloodGroup ? toDisplayBloodGroup(profile.bloodGroup) : 'Not Set'}
                </span>
                {profile?.verificationStatus && (<StatusBadge status={profile.verificationStatus}/>)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Droplet className="w-6 h-6"/>
            </div>
          </CardContent>
        </Card>

        {/* Availability Status & Toggle */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Status
              </p>
              <div className="mt-1 flex items-center gap-2">
                {profile?.available ? (<Badge variant="verified">Available to Donate</Badge>) : (<Badge variant="cancelled">Currently Unavailable</Badge>)}
              </div>
            </div>
            <Button variant={profile?.available ? 'outline' : 'success'} size="sm" onClick={toggleAvailability} isLoading={availabilityMutation.isPending} leftIcon={<Power className="w-3.5 h-3.5"/>}>
              {profile?.available ? 'Go Offline' : 'Set Available'}
            </Button>
          </CardContent>
        </Card>

        {/* Pending Match Alerts */}
        <Card className="border-indigo-100 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                Pending Match Alerts
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {pendingMatches.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Inbox Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Urgent Request Matches</h3>
            <Link to="/donor/matches" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Open Inbox ({matches.length}) <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>

          {isMatchesLoading ? (<div className="py-12 flex justify-center bg-white rounded-xl border border-slate-200">
              <Spinner size="lg" label="Checking matches..."/>
            </div>) : pendingMatches.length === 0 ? (<EmptyState icon={<Heart className="w-6 h-6 text-indigo-600"/>} title="No pending match requests" description="You don't have any pending requests waiting for your decision right now. Keep your availability active to receive urgent alerts."/>) : (<div className="space-y-3">
              {pendingMatches.slice(0, 3).map((m) => (<Card key={m.id} className="hover:border-slate-300 transition-colors">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {m.hospitalName || 'Emergency Hospital'}
                        </span>
                        <StatusBadge status={m.urgency || 'URGENT'}/>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          {toDisplayBloodGroup(m.bloodGroup)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Required date: <span className="font-medium text-slate-700">{formatDate(m.requiredDate)}</span>
                        {m.unitsRequired && (<span className="ml-2">({m.unitsRequired} units needed)</span>)}
                      </p>
                    </div>

                    <Link to="/donor/matches" className="shrink-0">
                      <Button variant="primary" size="sm">
                        Review & Respond
                      </Button>
                    </Link>
                  </CardContent>
                </Card>))}
            </div>)}
        </div>

        {/* Profile Summary Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Donor Profile</h3>
            <Link to="/donor/profile" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              Edit Details
            </Link>
          </div>

          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100 flex-row items-center gap-2">
              <User className="w-4 h-4 text-slate-600"/>
              <CardTitle className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Medical & Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <p className="text-slate-400 text-[11px] uppercase font-semibold">Verification</p>
                <div className="mt-1">
                  <StatusBadge status={profile?.verificationStatus || 'PENDING'}/>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] uppercase font-semibold">Last Donation</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {profile?.lastDonationDate ? formatDate(profile.lastDonationDate) : 'None recorded'}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] uppercase font-semibold">Registered Address</p>
                <p className="font-medium text-slate-700 mt-0.5">
                  {profile?.address || 'Address not yet provided'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link to="/donor/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>);
}
