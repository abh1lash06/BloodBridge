import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBloodRequestById,
  getMatchingDonors,
  getPersistedMatches,
  cancelBloodRequest,
  fulfillBloodRequest,
} from '@/api/patient.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { toDisplayBloodGroup, formatDate, formatDateTime, getApiErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import {
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Users,
  Search,
  Building2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFulfillDialog, setShowFulfillDialog] = useState(false);
  const [matchTab, setMatchTab] = useState<'persisted' | 'all'>('persisted');

  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  // 1. Request Details
  const {
    data: request,
    isLoading: isRequestLoading,
    isError: isRequestError,
    refetch: refetchRequest,
  } = useQuery({
    queryKey: ['blood-request', requestId],
    queryFn: () => getBloodRequestById(requestId!),
    enabled: !!requestId,
  });

  // 2. Persisted Matches (GET /api/blood-requests/{requestId}/matches/persisted)
  const {
    data: persistedMatches = [],
    isLoading: isPersistedLoading,
    refetch: refetchPersisted,
  } = useQuery({
    queryKey: ['blood-request-matches-persisted', requestId],
    queryFn: () => getPersistedMatches(requestId!),
    enabled: !!requestId,
  });

  // 3. Live Matching Donors (GET /api/blood-requests/{requestId}/matches)
  const {
    data: liveMatches = [],
    isLoading: isLiveLoading,
    refetch: refetchLive,
  } = useQuery({
    queryKey: ['blood-request-matches-live', requestId],
    queryFn: () => getMatchingDonors(requestId!),
    enabled: !!requestId && matchTab === 'all',
  });

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: () => cancelBloodRequest(requestId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      success('Blood request has been cancelled.', 'Request Cancelled');
      setShowCancelDialog(false);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err));
    },
  });

  // Fulfill Mutation
  const fulfillMutation = useMutation({
    mutationFn: () => fulfillBloodRequest(requestId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      success('Blood request marked as fulfilled!', 'Request Fulfilled');
      setShowFulfillDialog(false);
    },
    onError: (err) => {
      toastError(getApiErrorMessage(err));
    },
  });

  if (isRequestLoading) {
    return (
      <PageContainer>
        <div className="py-24 flex justify-center">
          <Spinner size="lg" label="Loading request details..." />
        </div>
      </PageContainer>
    );
  }

  if (isRequestError || !request) {
    return (
      <PageContainer>
        <ErrorState
          title="Request Not Found"
          message="Could not load details for this blood request. It may not exist or the server could not be reached."
          onRetry={() => refetchRequest()}
        />
      </PageContainer>
    );
  }

  const isFinalState = request.status === 'FULFILLED' || request.status === 'CANCELLED';
  const matchesToDisplay = matchTab === 'persisted' ? persistedMatches : liveMatches;
  const isMatchesLoading = matchTab === 'persisted' ? isPersistedLoading : isLiveLoading;

  return (
    <PageContainer
      title={`Request #${request.id} - ${toDisplayBloodGroup(request.bloodGroup)}`}
      description={`Submitted on ${formatDateTime(request.createdAt)}`}
      action={
        <div className="flex items-center gap-2">
          <Link to="/patient/requests">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Requests
            </Button>
          </Link>
          {!isFinalState && (
            <>
              {request.status === 'MATCHED' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => setShowFulfillDialog(true)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark Fulfilled
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Cancel Request
              </Button>
            </>
          )}
        </div>
      }
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Request Specs */}
        <Card className="md:col-span-2">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Request Information
            </CardTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={request.status} />
              <StatusBadge status={request.urgency} />
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
                  Blood Group
                </p>
                <p className="text-2xl font-black text-rose-700 mt-0.5">
                  {toDisplayBloodGroup(request.bloodGroup)}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Units Required
                </p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {request.unitsRequired}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    {request.unitsRequired === 1 ? 'unit' : 'units'}
                  </span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Required Date
                </p>
                <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(request.requiredDate)}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                    Hospital / Facility
                  </h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {request.hospitalName}
                  </p>
                  {request.hospitalAddress && (
                    <p className="text-xs text-slate-500 mt-0.5">{request.hospitalAddress}</p>
                  )}
                </div>
              </div>

              {request.additionalNotes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      Additional Clinical Notes
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {request.additionalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Guide / Action Card */}
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Matching Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            {request.status === 'OPEN' && (
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Request is Active & Searching
                </div>
                <p className="leading-relaxed">
                  Eligible donors of type {toDisplayBloodGroup(request.bloodGroup)} have been notified. Once a donor accepts or a hospital reserves units, the status updates to Matched.
                </p>
              </div>
            )}

            {request.status === 'MATCHED' && (
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Match Confirmed!
                </div>
                <p className="leading-relaxed">
                  Donors or hospital facilities have accepted/reserved blood for this request. Coordinate with the hospital desk for collection.
                </p>
              </div>
            )}

            {request.status === 'FULFILLED' && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Request Fulfilled
                </div>
                <p className="leading-relaxed">
                  Blood units were successfully collected or transfused. This request is completed.
                </p>
              </div>
            )}

            {request.status === 'CANCELLED' && (
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <AlertTriangle className="w-4 h-4 text-slate-500" />
                  Request Cancelled
                </div>
                <p className="leading-relaxed">
                  This request was cancelled. No further donor actions or hospital reservations are active.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Donor Matches Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Donor Matches & Responses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review donors matched with this request and their acceptance state.
            </p>
          </div>

          {/* Toggle between Persisted Matches and Active Matches */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMatchTab('persisted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                matchTab === 'persisted'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Persisted Matches ({persistedMatches.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setMatchTab('all');
                refetchLive();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                matchTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Scan Live Donors
            </button>
          </div>
        </div>

        {isMatchesLoading ? (
          <div className="py-12 flex justify-center bg-white rounded-xl border border-slate-200">
            <Spinner size="md" label="Checking donor matches..." />
          </div>
        ) : matchesToDisplay.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-slate-500 text-xs">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-800 text-sm mb-1">
                {matchTab === 'persisted'
                  ? 'No persisted donor matches recorded yet.'
                  : 'No active donors currently available for this blood group.'}
              </p>
              <p className="max-w-md mx-auto text-slate-500 leading-relaxed">
                As soon as registered donors respond or match criteria align, their status will appear here.
              </p>
              {matchTab === 'persisted' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  leftIcon={<Search className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setMatchTab('all');
                    refetchLive();
                  }}
                >
                  Scan Live Donors Now
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor ID / Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Match Status</TableHead>
                  <TableHead>Matched Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchesToDisplay.map((match, idx) => (
                  <TableRow key={match.id || idx}>
                    <TableCell className="font-semibold text-slate-900">
                      {match.donorName || `Donor #${match.donorId || match.id}`}
                      {match.donorPhone && (
                        <p className="text-[11px] text-slate-500 font-normal">
                          {match.donorPhone}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {toDisplayBloodGroup(match.bloodGroup)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={match.verificationStatus || 'PENDING'} />
                    </TableCell>
                    <TableCell>
                      {match.isAvailable !== false ? (
                        <Badge variant="verified">Available</Badge>
                      ) : (
                        <Badge variant="cancelled">Unavailable</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={match.status || 'PENDING'} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {formatDate(match.matchedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => cancelMutation.mutate()}
        isLoading={cancelMutation.isPending}
        title="Cancel Blood Request"
        message="Are you sure you want to cancel this emergency request? Any pending donor matching will be halted."
        confirmText="Yes, Cancel Request"
        variant="danger"
      />

      {/* Fulfill Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showFulfillDialog}
        onClose={() => setShowFulfillDialog(false)}
        onConfirm={() => fulfillMutation.mutate()}
        isLoading={fulfillMutation.isPending}
        title="Mark Request as Fulfilled"
        message="Confirm that the required blood units have been collected and this emergency request is satisfied."
        confirmText="Mark Fulfilled"
        variant="success"
      />
    </PageContainer>
  );
}
