import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(PageContainer, { title: "My Blood Requests", description: "Track all blood requests created under your account and check donor match progress.", action: _jsx(Link, { to: "/patient/requests/new", children: _jsx(Button, { variant: "primary", size: "md", leftIcon: _jsx(FilePlus, { className: "w-4 h-4" }), children: "Create Request" }) }), children: [_jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-500 mr-2 shrink-0", children: [_jsx(Filter, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Status:" })] }), ['ALL', 'OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED'].map((st) => (_jsx("button", { type: "button", onClick: () => setStatusFilter(st), className: `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === st
                            ? 'bg-rose-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`, children: st === 'ALL' ? 'All Requests' : st }, st)))] }), isLoading ? (_jsx("div", { className: "py-16 flex justify-center bg-white rounded-xl border border-slate-200", children: _jsx(Spinner, { size: "lg", label: "Loading blood requests..." }) })) : isError ? (_jsx(ErrorState, { title: "Failed to load requests", message: "Could not load blood requests from the server.", onRetry: () => refetch() })) : filteredRequests.length === 0 ? (_jsx(EmptyState, { icon: _jsx(Droplet, { className: "w-6 h-6 text-rose-600" }), title: "No requests found", description: statusFilter === 'ALL'
                    ? "You haven't submitted any blood requests yet."
                    : `No requests with status ${statusFilter}.`, actionLabel: statusFilter === 'ALL' ? 'Create Your First Request' : undefined, onAction: () => window.location.assign('/patient/requests/new') })) : (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Blood Group" }), _jsx(TableHead, { children: "Units" }), _jsx(TableHead, { children: "Hospital" }), _jsx(TableHead, { children: "Urgency" }), _jsx(TableHead, { children: "Required Date" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Created Date" }), _jsx(TableHead, { className: "text-right", children: "Action" })] }) }), _jsx(TableBody, { children: filteredRequests.map((req) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200", children: toDisplayBloodGroup(req.bloodGroup) }) }), _jsxs(TableCell, { className: "font-semibold text-slate-800", children: [req.unitsRequired, " ", req.unitsRequired === 1 ? 'unit' : 'units'] }), _jsx(TableCell, { children: _jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-900", children: req.hospitalName }), req.hospitalAddress && (_jsx("p", { className: "text-[11px] text-slate-400 truncate max-w-xs", children: req.hospitalAddress }))] }) }), _jsx(TableCell, { children: _jsx(StatusBadge, { status: req.urgency }) }), _jsx(TableCell, { className: "text-slate-700", children: formatDate(req.requiredDate) }), _jsx(TableCell, { children: _jsx(StatusBadge, { status: req.status }) }), _jsx(TableCell, { className: "text-slate-500 text-xs", children: formatDate(req.createdAt) }), _jsx(TableCell, { className: "text-right", children: _jsx(Link, { to: `/patient/requests/${req.id}`, children: _jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(Eye, { className: "w-3.5 h-3.5" }), children: "View" }) }) })] }, req.id))) })] }) }))] }));
}
