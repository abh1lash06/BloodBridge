import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { getHospitalReservations, releaseReservation, fulfillReservation, reserveBlood, } from '@/api/hospital.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { toDisplayBloodGroup, formatDateTime, getApiErrorMessage, } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { CalendarCheck, PackageCheck, RotateCcw, PlusCircle, AlertCircle, Filter, } from 'lucide-react';
export function HospitalReservationsPage() {
    const [filter, setFilter] = useState('ALL');
    const [releaseId, setReleaseId] = useState(null);
    const [fulfillId, setFulfillId] = useState(null);
    const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState('');
    const [unitsToReserve, setUnitsToReserve] = useState(1);
    const [modalError, setModalError] = useState(null);
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    const { data: reservations = [], isLoading, isError, refetch, } = useQuery({
        queryKey: ['hospital', 'reservations'],
        queryFn: getHospitalReservations,
    });
    const releaseMutation = useMutation({
        mutationFn: (id) => releaseReservation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'reservations'],
            });
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'inventory'],
            });
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
            success('Blood units successfully released back to inventory.', 'Reservation Released');
            setReleaseId(null);
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    const fulfillMutation = useMutation({
        mutationFn: (id) => fulfillReservation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'reservations'],
            });
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'inventory'],
            });
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
            success('Reservation and patient request marked as fulfilled!', 'Blood Fulfilled');
            setFulfillId(null);
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    const reserveMutation = useMutation({
        mutationFn: ({ reqId, units, }) => reserveBlood(reqId, units),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'reservations'],
            });
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'inventory'],
            });
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
            success('Blood successfully reserved for patient request!', 'Reservation Created');
            setIsReserveModalOpen(false);
            setSelectedRequestId('');
            setUnitsToReserve(1);
            setModalError(null);
        },
        onError: (err) => {
            setModalError(getApiErrorMessage(err));
        },
    });
    const handleCreateReservation = (event) => {
        event.preventDefault();
        const requestId = selectedRequestId.trim();
        if (!requestId) {
            setModalError('Please enter the patient blood request ID.');
            return;
        }
        if (!Number.isInteger(unitsToReserve) ||
            unitsToReserve < 1) {
            setModalError('Units to reserve must be at least 1.');
            return;
        }
        reserveMutation.mutate({
            reqId: requestId,
            units: unitsToReserve,
        });
    };
    const filteredReservations = reservations.filter((reservation) => {
        if (filter === 'ALL') {
            return true;
        }
        return reservation.status === filter;
    });
    return (_jsxs(PageContainer, { title: "Hospital Blood Reservations", description: "Lock available blood units for urgent patient cases, release cancelled holds, or confirm clinical fulfillment.", action: _jsx(Button, { variant: "primary", size: "sm", onClick: () => {
                setIsReserveModalOpen(true);
                setModalError(null);
            }, leftIcon: _jsx(PlusCircle, { className: "w-4 h-4" }), children: "Reserve Blood for Request" }), children: [_jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-500 mr-2 shrink-0", children: [_jsx(Filter, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Status:" })] }), [
                        'ALL',
                        'RESERVED',
                        'RELEASED',
                        'FULFILLED',
                        'CANCELLED',
                    ].map((status) => (_jsx("button", { type: "button", onClick: () => setFilter(status), className: `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filter === status
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`, children: status === 'ALL'
                            ? 'All Reservations'
                            : status }, status)))] }), isLoading ? (_jsx("div", { className: "py-20 flex justify-center", children: _jsx(Spinner, { size: "lg", label: "Loading reservations..." }) })) : isError ? (_jsx(ErrorState, { title: "Could not load reservations", message: "Failed to retrieve reservation records from the server.", onRetry: () => refetch() })) : filteredReservations.length === 0 ? (_jsx(EmptyState, { icon: _jsx(CalendarCheck, { className: "w-6 h-6 text-purple-600" }), title: filter === 'ALL'
                    ? 'No reservations yet'
                    : `No ${filter.toLowerCase()} reservations`, description: filter === 'ALL'
                    ? 'When blood is reserved for patient requests, records will appear here for release or fulfillment.'
                    : `No reservation records currently matched the ${filter} filter.`, actionLabel: "Reserve Blood Now", onAction: () => setIsReserveModalOpen(true) })) : (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Reservation ID" }), _jsx(TableHead, { children: "Blood Group" }), _jsx(TableHead, { children: "Units Reserved" }), _jsx(TableHead, { children: "Request Ref" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Created Time" }), _jsx(TableHead, { children: "Release / Fulfill Time" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: filteredReservations.map((reservation) => {
                                const isHoldActive = reservation.status ===
                                    'RESERVED';
                                return (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "font-semibold text-slate-900", children: ["#", reservation.id] }), _jsx(TableCell, { children: _jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200", children: toDisplayBloodGroup(reservation.bloodGroup) }) }), _jsxs(TableCell, { className: "font-bold text-slate-800", children: [reservation.unitsReserved, ' ', reservation.unitsReserved ===
                                                    1
                                                    ? 'unit'
                                                    : 'units'] }), _jsxs(TableCell, { className: "text-slate-600 font-medium", children: ["Request #", reservation.bloodRequestId] }), _jsx(TableCell, { children: _jsx(StatusBadge, { status: reservation.status }) }), _jsx(TableCell, { className: "text-xs text-slate-500", children: formatDateTime(reservation.createdAt) }), _jsx(TableCell, { className: "text-xs text-slate-500", children: reservation.releasedAt
                                                ? formatDateTime(reservation.releasedAt)
                                                : '—' }), _jsx(TableCell, { className: "text-right", children: isHoldActive ? (_jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setReleaseId(reservation.id), leftIcon: _jsx(RotateCcw, { className: "w-3.5 h-3.5 text-slate-500" }), children: "Release" }), _jsx(Button, { variant: "success", size: "sm", onClick: () => setFulfillId(reservation.id), leftIcon: _jsx(PackageCheck, { className: "w-3.5 h-3.5" }), children: "Fulfill" })] })) : (_jsx("span", { className: "text-xs text-slate-400", children: "Completed" })) })] }, reservation.id));
                            }) })] }) })), _jsxs(Modal, { isOpen: isReserveModalOpen, onClose: () => setIsReserveModalOpen(false), title: "Reserve Blood Units", description: "Enter the BloodBridge request ID and allocate available hospital blood units to that emergency request.", children: [modalError && (_jsxs("div", { role: "alert", className: "mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-rose-600 shrink-0 mt-0.5" }), _jsx("span", { children: modalError })] })), _jsxs("form", { onSubmit: handleCreateReservation, className: "space-y-4", children: [_jsx(Input, { label: "Blood Request ID", type: "number", min: 1, value: selectedRequestId, onChange: (event) => setSelectedRequestId(event.target.value), placeholder: "Example: 3", helperText: "Enter the ID of the patient blood request you want to reserve blood for.", required: true }), _jsx(Input, { label: "Units to Reserve", type: "number", min: 1, max: 50, value: unitsToReserve, onChange: (event) => setUnitsToReserve(parseInt(event.target.value, 10) || 1), required: true }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-4 border-t border-slate-100", children: [_jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setIsReserveModalOpen(false), children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", size: "sm", isLoading: reserveMutation.isPending, children: "Confirm Reservation" })] })] })] }), _jsx(ConfirmDialog, { isOpen: !!releaseId, onClose: () => setReleaseId(null), onConfirm: () => releaseId &&
                    releaseMutation.mutate(releaseId), isLoading: releaseMutation.isPending, title: "Release Blood Reservation", message: "Are you sure you want to release these reserved units back to available hospital inventory?", confirmText: "Release Units", variant: "danger" }), _jsx(ConfirmDialog, { isOpen: !!fulfillId, onClose: () => setFulfillId(null), onConfirm: () => fulfillId &&
                    fulfillMutation.mutate(fulfillId), isLoading: fulfillMutation.isPending, title: "Fulfill Blood Reservation", message: "Confirm that the reserved blood units have been delivered to the patient.", confirmText: "Confirm Fulfillment", variant: "success" })] }));
}
