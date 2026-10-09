import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPatientBloodRequests } from '@/api/patient.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { toDisplayBloodGroup, formatDate } from '@/lib/utils';
import { FilePlus, Eye, Droplet, Filter } from 'lucide-react';
export function PatientRequestsPage() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const { data: requests = [], isLoading, isError, refetch, } = useQuery({
        queryKey: ['patient', 'requests'],
        queryFn: getPatientBloodRequests,
    });
    const filteredRequests = requests.filter((req) => {
        if (statusFilter === 'ALL')
            return true;
        return req.status === statusFilter;
    });
    return (<PageContainer title="My Blood Requests" description="Track all blood requests created under your account and check donor match progress." action={<Link to="/patient/requests/new">
          <Button variant="primary" size="md" leftIcon={<FilePlus className="w-4 h-4"/>}>
            Create Request
          </Button>
        </Link>}>
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5"/>
          <span>Status:</span>
        </div>
        {['ALL', 'OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED'].map((st) => (<button key={st} type="button" onClick={() => setStatusFilter(st)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === st
                ? 'bg-rose-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {st === 'ALL' ? 'All Requests' : st}
          </button>))}
      </div>

      {isLoading ? (<div className="py-16 flex justify-center bg-white rounded-xl border border-slate-200">
          <Spinner size="lg" label="Loading blood requests..."/>
        </div>) : isError ? (<ErrorState title="Failed to load requests" message="Could not load blood requests from the server." onRetry={() => refetch()}/>) : filteredRequests.length === 0 ? (<EmptyState icon={<Droplet className="w-6 h-6 text-rose-600"/>} title="No requests found" description={statusFilter === 'ALL'
                ? "You haven't submitted any blood requests yet."
                : `No requests with status ${statusFilter}.`} actionLabel={statusFilter === 'ALL' ? 'Create Your First Request' : undefined} onAction={() => window.location.assign('/patient/requests/new')}/>) : (<TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Group</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Required Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (<TableRow key={req.id}>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {toDisplayBloodGroup(req.bloodGroup)}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {req.unitsRequired} {req.unitsRequired === 1 ? 'unit' : 'units'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{req.hospitalName}</p>
                      {req.hospitalAddress && (<p className="text-[11px] text-slate-400 truncate max-w-xs">{req.hospitalAddress}</p>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.urgency}/>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {formatDate(req.requiredDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status}/>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {formatDate(req.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/patient/requests/${req.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5"/>}>
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </TableContainer>)}
    </PageContainer>);
}
