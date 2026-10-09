import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, } from '@tanstack/react-query';
import { getDonorMatches, acceptDonorMatch, rejectDonorMatch, } from '@/api/donor.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { toDisplayBloodGroup, formatDate, formatDateTime, getApiErrorMessage, } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { HeartHandshake, CheckCircle2, XCircle, Calendar, Clock, Filter, } from 'lucide-react';
export function DonorMatchesPage() {
    const [filter, setFilter] = useState('ALL');
    const [rejectMatchId, setRejectMatchId,] = useState(null);
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    /*
     * =========================================================
     * LOAD DONOR MATCHES
     * =========================================================
     */
    const { data: matches = [], isLoading, isError, refetch, } = useQuery({
        queryKey: ['donor', 'matches'],
        queryFn: getDonorMatches,
    });
    /*
     * =========================================================
     * ACCEPT MATCH
     * =========================================================
     */
    const acceptMutation = useMutation({
        mutationFn: (matchId) => acceptDonorMatch(matchId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['donor', 'matches'],
            });
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
            queryClient.invalidateQueries({
                queryKey: ['patient'],
            });
            success('You have accepted this blood match request! Patient notified.', 'Match Accepted');
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    /*
     * =========================================================
     * REJECT MATCH
     * =========================================================
     */
    const rejectMutation = useMutation({
        mutationFn: (matchId) => rejectDonorMatch(matchId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['donor', 'matches'],
            });
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
            success('You have declined this match request.', 'Match Declined');
            setRejectMatchId(null);
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    /*
     * =========================================================
     * FILTER MATCHES
     *
     * IMPORTANT:
     * Backend field is matchStatus, NOT status.
     * =========================================================
     */
    const filteredMatches = matches.filter((match) => {
        const matchStatus = match.matchStatus ?? 'PENDING';
        if (filter === 'ALL') {
            return true;
        }
        return matchStatus === filter;
    });
    /*
     * =========================================================
     * UI
     * =========================================================
     */
    return (<PageContainer title="Match Inbox" description="Respond to urgent blood requests seeking your blood type from regional hospitals.">
      {/* =====================================================
            FILTERS
            ===================================================== */}

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5"/>

          <span>Status:</span>
        </div>

        {[
            'ALL',
            'PENDING',
            'ACCEPTED',
            'REJECTED',
        ].map((status) => (<button key={status} type="button" onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {status === 'ALL'
                ? 'All Matches'
                : status}
          </button>))}
      </div>

      {/* =====================================================
            LOADING
            ===================================================== */}

      {isLoading ? (<div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading match inbox..."/>
        </div>) : isError ? (
        /* ===================================================
           ERROR
           =================================================== */
        <ErrorState title="Could not load matches" message="Failed to retrieve donor matches from the server." onRetry={() => refetch()}/>) : filteredMatches.length === 0 ? (
        /* ===================================================
           EMPTY
           =================================================== */
        <EmptyState icon={<HeartHandshake className="w-6 h-6 text-indigo-600"/>} title={filter === 'ALL'
                ? 'No match requests yet'
                : `No ${filter.toLowerCase()} matches`} description={filter === 'ALL'
                ? 'When emergency blood requests match your blood type and availability, they will appear in this inbox.'
                : `No match records currently have ${filter.toLowerCase()} status.`}/>) : (
        /* ===================================================
           MATCH LIST
           =================================================== */
        <div className="space-y-4">
          {filteredMatches.map((match) => {
                /*
                 * Backend response:
                 *
                 * matchId
                 * bloodRequestId
                 * patientName
                 * bloodGroup
                 * unitsRequired
                 * hospitalName
                 * hospitalAddress
                 * urgency
                 * requestStatus
                 * requiredDate
                 * additionalNotes
                 * matchStatus
                 * matchedAt
                 * respondedAt
                 */
                const matchId = match.matchId;
                const matchStatus = match.matchStatus ?? 'PENDING';
                const isPending = matchStatus === 'PENDING';
                const bloodType = match.bloodGroup;
                const hospital = match.hospitalName ||
                    'Emergency Hospital';
                const urgency = match.urgency ||
                    'URGENT';
                const requiredDate = match.requiredDate;
                const units = match.unitsRequired;
                return (<Card key={String(matchId)} className={`transition-all ${isPending
                        ? 'border-indigo-200 shadow-sm bg-white'
                        : 'border-slate-200 bg-slate-50/50'}`}>
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* =========================================
                        MATCH INFORMATION
                        ========================================= */}

                  <div className="flex items-start gap-4">
                    {/* BLOOD GROUP */}

                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 font-bold text-sm flex flex-col items-center justify-center border border-rose-200 shrink-0">
                      <span>
                        {toDisplayBloodGroup(bloodType)}
                      </span>

                      {units !== undefined &&
                        units !== null && (<span className="text-[9px] font-normal text-rose-600 leading-none">
                            {units}{' '}
                            {units === 1
                            ? 'unit'
                            : 'units'}
                          </span>)}
                    </div>

                    {/* DETAILS */}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">
                          {hospital}
                        </h4>

                        <StatusBadge status={matchStatus}/>

                        <StatusBadge status={urgency}/>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {requiredDate && (<span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400"/>

                            Required:{' '}

                            <strong className="text-slate-700">
                              {formatDate(requiredDate)}
                            </strong>
                          </span>)}

                        {match.matchedAt && (<span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5"/>

                            Matched{' '}

                            {formatDateTime(match.matchedAt)}
                          </span>)}
                      </div>

                      {match.patientName && (<div className="text-xs text-slate-500">
                          Patient:{' '}

                          <strong className="text-slate-700">
                            {match.patientName}
                          </strong>
                        </div>)}
                    </div>
                  </div>

                  {/* =========================================
                        ACTIONS
                        ========================================= */}

                  <div className="flex items-center gap-2 shrink-0 md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {isPending ? (<>
                        {/* DECLINE */}

                        <Button variant="outline" size="sm" onClick={() => setRejectMatchId(matchId)} disabled={acceptMutation.isPending ||
                            rejectMutation.isPending} leftIcon={<XCircle className="w-4 h-4 text-slate-400"/>}>
                          Decline
                        </Button>

                        {/* ACCEPT */}

                        <Button variant="primary" size="sm" onClick={() => acceptMutation.mutate(matchId)} isLoading={acceptMutation.isPending} disabled={rejectMutation.isPending} leftIcon={<CheckCircle2 className="w-4 h-4"/>}>
                          Accept to Donate
                        </Button>
                      </>) : (<span className="text-xs font-medium text-slate-500">
                        Response recorded:{' '}

                        <strong>
                          {matchStatus}
                        </strong>
                      </span>)}
                  </div>
                </CardContent>
              </Card>);
            })}
        </div>)}

      {/* =====================================================
            REJECT CONFIRMATION
            ===================================================== */}

      <ConfirmDialog isOpen={!!rejectMatchId} onClose={() => setRejectMatchId(null)} onConfirm={() => {
            if (rejectMatchId !== null) {
                rejectMutation.mutate(rejectMatchId);
            }
        }} isLoading={rejectMutation.isPending} title="Decline Blood Match Request" message="Are you sure you want to decline this donation request? The system will search for another matching donor." confirmText="Decline Match" variant="danger"/>
    </PageContainer>);
}
