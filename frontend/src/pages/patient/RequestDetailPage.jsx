import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBloodRequestById, getMatchingDonors, getPersistedMatches, cancelBloodRequest, fulfillBloodRequest, } from '@/api/patient.api';
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
import { ArrowLeft, XCircle, CheckCircle2, Users, Search, Building2, Calendar, AlertTriangle, FileText, Clock, ShieldCheck, } from 'lucide-react';
export function RequestDetailPage() {
    const { requestId } = useParams();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showFulfillDialog, setShowFulfillDialog] = useState(false);
    const [matchTab, setMatchTab] = useState('persisted');
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    // 1. Request Details
    const { data: request, isLoading: isRequestLoading, isError: isRequestError, refetch: refetchRequest, } = useQuery({
        queryKey: ['blood-request', requestId],
        queryFn: () => getBloodRequestById(requestId),
        enabled: !!requestId,
    });
    // 2. Persisted Matches (GET /api/blood-requests/{requestId}/matches/persisted)
    const { data: persistedMatches = [], isLoading: isPersistedLoading, refetch: refetchPersisted, } = useQuery({
        queryKey: ['blood-request-matches-persisted', requestId],
        queryFn: () => getPersistedMatches(requestId),
        enabled: !!requestId,
    });
    // 3. Live Matching Donors (GET /api/blood-requests/{requestId}/matches)
    const { data: liveMatches = [], isLoading: isLiveLoading, refetch: refetchLive, } = useQuery({
        queryKey: ['blood-request-matches-live', requestId],
        queryFn: () => getMatchingDonors(requestId),
        enabled: !!requestId && matchTab === 'all',
    });
    // Cancel Mutation
    const cancelMutation = useMutation({
        mutationFn: () => cancelBloodRequest(requestId),
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
        mutationFn: () => fulfillBloodRequest(requestId),
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
        return (_jsx(PageContainer, { children: _jsx("div", { className: "py-24 flex justify-center", children: _jsx(Spinner, { size: "lg", label: "Loading request details..." }) }) }));
    }
    if (isRequestError || !request) {
        return (_jsx(PageContainer, { children: _jsx(ErrorState, { title: "Request Not Found", message: "Could not load details for this blood request. It may not exist or the server could not be reached.", onRetry: () => refetchRequest() }) }));
    }
    const isFinalState = request.status === 'FULFILLED' || request.status === 'CANCELLED';
    const matchesToDisplay = matchTab === 'persisted' ? persistedMatches : liveMatches;
    const isMatchesLoading = matchTab === 'persisted' ? isPersistedLoading : isLiveLoading;
    return (_jsxs(PageContainer, { title: `Request #${request.id} - ${toDisplayBloodGroup(request.bloodGroup)}`, description: `Submitted on ${formatDateTime(request.createdAt)}`, action: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: "/patient/requests", children: _jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(ArrowLeft, { className: "w-4 h-4" }), children: "Back to Requests" }) }), !isFinalState && (_jsxs(_Fragment, { children: [request.status === 'MATCHED' && (_jsx(Button, { variant: "success", size: "sm", onClick: () => setShowFulfillDialog(true), leftIcon: _jsx(CheckCircle2, { className: "w-4 h-4" }), children: "Mark Fulfilled" })), _jsx(Button, { variant: "danger", size: "sm", onClick: () => setShowCancelDialog(true), leftIcon: _jsx(XCircle, { className: "w-4 h-4" }), children: "Cancel Request" })] }))] }), children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "md:col-span-2", children: [_jsxs(CardHeader, { className: "bg-slate-50 border-b border-slate-100 flex-row items-center justify-between", children: [_jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Request Information" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StatusBadge, { status: request.status }), _jsx(StatusBadge, { status: request.urgency })] })] }), _jsxs(CardContent, { className: "p-5 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-3 bg-rose-50/60 rounded-xl border border-rose-100", children: [_jsx("p", { className: "text-[11px] font-semibold text-rose-800 uppercase tracking-wider", children: "Blood Group" }), _jsx("p", { className: "text-2xl font-black text-rose-700 mt-0.5", children: toDisplayBloodGroup(request.bloodGroup) })] }), _jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200", children: [_jsx("p", { className: "text-[11px] font-semibold text-slate-600 uppercase tracking-wider", children: "Units Required" }), _jsxs("p", { className: "text-2xl font-black text-slate-900 mt-0.5", children: [request.unitsRequired, ' ', _jsx("span", { className: "text-xs font-normal text-slate-500", children: request.unitsRequired === 1 ? 'unit' : 'units' })] })] }), _jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1", children: [_jsx("p", { className: "text-[11px] font-semibold text-slate-600 uppercase tracking-wider", children: "Required Date" }), _jsxs("p", { className: "text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-4 h-4 text-slate-400" }), formatDate(request.requiredDate)] })] })] }), _jsxs("div", { className: "pt-3 border-t border-slate-100 space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Building2, { className: "w-5 h-5 text-slate-400 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold uppercase text-slate-500 tracking-wider", children: "Hospital / Facility" }), _jsx("p", { className: "text-sm font-semibold text-slate-900 mt-0.5", children: request.hospitalName }), request.hospitalAddress && (_jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: request.hospitalAddress }))] })] }), request.additionalNotes && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(FileText, { className: "w-5 h-5 text-slate-400 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold uppercase text-slate-500 tracking-wider", children: "Additional Clinical Notes" }), _jsx("p", { className: "text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100", children: request.additionalNotes })] })] }))] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "bg-slate-50 border-b border-slate-100", children: _jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Matching Status" }) }), _jsxs(CardContent, { className: "p-5 space-y-4 text-xs", children: [request.status === 'OPEN' && (_jsxs("div", { className: "p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold mb-1", children: [_jsx(Clock, { className: "w-4 h-4 text-sky-600" }), "Request is Active & Searching"] }), _jsxs("p", { className: "leading-relaxed", children: ["Eligible donors of type ", toDisplayBloodGroup(request.bloodGroup), " have been notified. Once a donor accepts or a hospital reserves units, the status updates to Matched."] })] })), request.status === 'MATCHED' && (_jsxs("div", { className: "p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold mb-1", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-indigo-600" }), "Match Confirmed!"] }), _jsx("p", { className: "leading-relaxed", children: "Donors or hospital facilities have accepted/reserved blood for this request. Coordinate with the hospital desk for collection." })] })), request.status === 'FULFILLED' && (_jsxs("div", { className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold mb-1", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-600" }), "Request Fulfilled"] }), _jsx("p", { className: "leading-relaxed", children: "Blood units were successfully collected or transfused. This request is completed." })] })), request.status === 'CANCELLED' && (_jsxs("div", { className: "p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold mb-1", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-slate-500" }), "Request Cancelled"] }), _jsx("p", { className: "leading-relaxed", children: "This request was cancelled. No further donor actions or hospital reservations are active." })] }))] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-indigo-600" }), "Donor Matches & Responses"] }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Review donors matched with this request and their acceptance state." })] }), _jsxs("div", { className: "flex items-center gap-2 self-start sm:self-auto", children: [_jsxs("button", { type: "button", onClick: () => setMatchTab('persisted'), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${matchTab === 'persisted'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`, children: ["Persisted Matches (", persistedMatches.length, ")"] }), _jsxs("button", { type: "button", onClick: () => {
                                            setMatchTab('all');
                                            refetchLive();
                                        }, className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${matchTab === 'all'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`, children: [_jsx(Search, { className: "w-3.5 h-3.5" }), "Scan Live Donors"] })] })] }), isMatchesLoading ? (_jsx("div", { className: "py-12 flex justify-center bg-white rounded-xl border border-slate-200", children: _jsx(Spinner, { size: "md", label: "Checking donor matches..." }) })) : matchesToDisplay.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center text-slate-500 text-xs", children: [_jsx(Users, { className: "w-8 h-8 text-slate-400 mx-auto mb-2" }), _jsx("p", { className: "font-semibold text-slate-800 text-sm mb-1", children: matchTab === 'persisted'
                                        ? 'No persisted donor matches recorded yet.'
                                        : 'No active donors currently available for this blood group.' }), _jsx("p", { className: "max-w-md mx-auto text-slate-500 leading-relaxed", children: "As soon as registered donors respond or match criteria align, their status will appear here." }), matchTab === 'persisted' && (_jsx(Button, { variant: "outline", size: "sm", className: "mt-4", leftIcon: _jsx(Search, { className: "w-3.5 h-3.5" }), onClick: () => {
                                        setMatchTab('all');
                                        refetchLive();
                                    }, children: "Scan Live Donors Now" }))] }) })) : (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Donor ID / Name" }), _jsx(TableHead, { children: "Blood Group" }), _jsx(TableHead, { children: "Verification" }), _jsx(TableHead, { children: "Availability" }), _jsx(TableHead, { children: "Match Status" }), _jsx(TableHead, { children: "Matched Time" })] }) }), _jsx(TableBody, { children: matchesToDisplay.map((match, idx) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "font-semibold text-slate-900", children: [match.donorName || `Donor #${match.donorId || match.id}`, match.donorPhone && (_jsx("p", { className: "text-[11px] text-slate-500 font-normal", children: match.donorPhone }))] }), _jsx(TableCell, { children: _jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200", children: toDisplayBloodGroup(match.bloodGroup) }) }), _jsx(TableCell, { children: _jsx(StatusBadge, { status: match.verificationStatus || 'PENDING' }) }), _jsx(TableCell, { children: match.isAvailable !== false ? (_jsx(Badge, { variant: "verified", children: "Available" })) : (_jsx(Badge, { variant: "cancelled", children: "Unavailable" })) }), _jsx(TableCell, { children: _jsx(StatusBadge, { status: match.status || 'PENDING' }) }), _jsx(TableCell, { className: "text-slate-500 text-xs", children: formatDate(match.matchedAt) })] }, match.id || idx))) })] }) }))] }), _jsx(ConfirmDialog, { isOpen: showCancelDialog, onClose: () => setShowCancelDialog(false), onConfirm: () => cancelMutation.mutate(), isLoading: cancelMutation.isPending, title: "Cancel Blood Request", message: "Are you sure you want to cancel this emergency request? Any pending donor matching will be halted.", confirmText: "Yes, Cancel Request", variant: "danger" }), _jsx(ConfirmDialog, { isOpen: showFulfillDialog, onClose: () => setShowFulfillDialog(false), onConfirm: () => fulfillMutation.mutate(), isLoading: fulfillMutation.isPending, title: "Mark Request as Fulfilled", message: "Confirm that the required blood units have been collected and this emergency request is satisfied.", confirmText: "Mark Fulfilled", variant: "success" })] }));
}
