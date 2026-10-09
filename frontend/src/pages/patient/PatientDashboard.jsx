import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getPatientBloodRequests } from '@/api/patient.api';
import { useNotifications } from '@/hooks/useNotifications';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { toDisplayBloodGroup, formatDate, formatDateTime } from '@/lib/utils';
import { FilePlus, Clock, CheckCircle2, PackageCheck, AlertCircle, ArrowRight, Droplet, Bell, Eye, } from 'lucide-react';
export function PatientDashboard() {
    const { user } = useAuth();
    const { notifications } = useNotifications();
    const { data: requests = [], isLoading, isError, refetch, } = useQuery({
        queryKey: ['patient', 'requests'],
        queryFn: getPatientBloodRequests,
    });
    const openCount = requests.filter((r) => r.status === 'OPEN').length;
    const matchedCount = requests.filter((r) => r.status === 'MATCHED').length;
    const fulfilledCount = requests.filter((r) => r.status === 'FULFILLED').length;
    const cancelledCount = requests.filter((r) => r.status === 'CANCELLED').length;
    const recentRequests = requests.slice(0, 5);
    const recentNotifs = notifications.slice(0, 4);
    return (<PageContainer title={`Welcome back, ${user?.fullName || 'Patient'}`} description="Manage your emergency blood requests, monitor live donor matching, and track hospital fulfillment." action={<Link to="/patient/requests/new">
          <Button variant="primary" size="md" leftIcon={<FilePlus className="w-4 h-4"/>}>
            Create Blood Request
          </Button>
        </Link>}>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-sky-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Open Requests</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{openCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-5 h-5"/>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-indigo-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Matched</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{matchedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5"/>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-emerald-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Fulfilled</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{fulfilledCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5"/>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cancelled</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{cancelledCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5"/>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Blood Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Blood Requests</h3>
            <Link to="/patient/requests" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
              View all ({requests.length}) <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>

          {isLoading ? (<div className="py-12 flex justify-center bg-white rounded-xl border border-slate-200">
              <Spinner size="lg" label="Loading blood requests..."/>
            </div>) : isError ? (<ErrorState title="Failed to load requests" message="Could not retrieve your blood requests. Please check if backend is running." onRetry={() => refetch()}/>) : recentRequests.length === 0 ? (<EmptyState icon={<Droplet className="w-6 h-6 text-rose-600"/>} title="No blood requests yet" description="Create an emergency request to start finding matching donors and reserving blood units." actionLabel="Create Blood Request" onAction={() => window.location.assign('/patient/requests/new')}/>) : (<div className="space-y-3">
              {recentRequests.map((req) => (<Card key={req.id} className="hover:border-slate-300 transition-colors">
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 font-bold text-sm flex flex-col items-center justify-center border border-rose-200 shrink-0">
                        <span>{toDisplayBloodGroup(req.bloodGroup)}</span>
                        <span className="text-[9px] font-normal text-rose-600 leading-none">
                          {req.unitsRequired} {req.unitsRequired === 1 ? 'unit' : 'units'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {req.hospitalName}
                          </h4>
                          <StatusBadge status={req.status}/>
                          <StatusBadge status={req.urgency}/>
                        </div>
                        <p className="text-xs text-slate-500">
                          Required by: <span className="font-medium text-slate-700">{formatDate(req.requiredDate)}</span>
                          {req.createdAt && (<span className="ml-2 text-slate-400">
                              (Created: {formatDate(req.createdAt)})
                            </span>)}
                        </p>
                      </div>
                    </div>

                    <Link to={`/patient/requests/${req.id}`} className="shrink-0 sm:self-center">
                      <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5"/>} className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>))}
            </div>)}
        </div>

        {/* Recent Notifications Sidebar Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Updates</h3>
            <Link to="/notifications" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              See all
            </Link>
          </div>

          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100 flex-row items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600"/>
              <CardTitle className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Emergency Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {recentNotifs.length === 0 ? (<div className="p-6 text-center text-xs text-slate-500">
                  No notifications yet. You'll be alerted when donors accept or hospitals reserve blood.
                </div>) : (recentNotifs.map((notif) => (<div key={notif.id} className="p-3.5 text-xs">
                    <p className="font-semibold text-slate-900 mb-0.5">{notif.title || 'Notification'}</p>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatDateTime(notif.createdAt)}
                    </span>
                  </div>)))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>);
}
