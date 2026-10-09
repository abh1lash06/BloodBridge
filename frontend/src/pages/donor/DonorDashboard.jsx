import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(PageContainer, { title: `Welcome, ${profile?.fullName || user?.fullName || 'Donor'}`, description: "Manage your blood donor profile, toggle donation availability, and respond to urgent hospital match alerts.", action: _jsx(Link, { to: "/donor/matches", children: _jsxs(Button, { variant: "primary", size: "md", leftIcon: _jsx(HeartHandshake, { className: "w-4 h-4" }), children: ["View Match Inbox (", pendingMatches.length, ")"] }) }), children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { className: "border-rose-100 shadow-xs", children: _jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Blood Group" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-3xl font-black text-rose-600", children: profile?.bloodGroup ? toDisplayBloodGroup(profile.bloodGroup) : 'Not Set' }), profile?.verificationStatus && (_jsx(StatusBadge, { status: profile.verificationStatus }))] })] }), _jsx("div", { className: "w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center", children: _jsx(Droplet, { className: "w-6 h-6" }) })] }) }), _jsx(Card, { className: "border-slate-200 shadow-xs", children: _jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Current Status" }), _jsx("div", { className: "mt-1 flex items-center gap-2", children: profile?.available ? (_jsx(Badge, { variant: "verified", children: "Available to Donate" })) : (_jsx(Badge, { variant: "cancelled", children: "Currently Unavailable" })) })] }), _jsx(Button, { variant: profile?.available ? 'outline' : 'success', size: "sm", onClick: toggleAvailability, isLoading: availabilityMutation.isPending, leftIcon: _jsx(Power, { className: "w-3.5 h-3.5" }), children: profile?.available ? 'Go Offline' : 'Set Available' })] }) }), _jsx(Card, { className: "border-indigo-100 shadow-xs", children: _jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-indigo-700", children: "Pending Match Alerts" }), _jsx("h3", { className: "text-3xl font-black text-slate-900 mt-1", children: pendingMatches.length })] }), _jsx("div", { className: "w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center", children: _jsx(HeartHandshake, { className: "w-6 h-6" }) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-base font-semibold text-slate-900", children: "Urgent Request Matches" }), _jsxs(Link, { to: "/donor/matches", className: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1", children: ["Open Inbox (", matches.length, ") ", _jsx(ArrowRight, { className: "w-3 h-3" })] })] }), isMatchesLoading ? (_jsx("div", { className: "py-12 flex justify-center bg-white rounded-xl border border-slate-200", children: _jsx(Spinner, { size: "lg", label: "Checking matches..." }) })) : pendingMatches.length === 0 ? (_jsx(EmptyState, { icon: _jsx(Heart, { className: "w-6 h-6 text-indigo-600" }), title: "No pending match requests", description: "You don't have any pending requests waiting for your decision right now. Keep your availability active to receive urgent alerts." })) : (_jsx("div", { className: "space-y-3", children: pendingMatches.slice(0, 3).map((m) => (_jsx(Card, { className: "hover:border-slate-300 transition-colors", children: _jsxs(CardContent, { className: "p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-bold text-slate-900 text-sm", children: m.hospitalName || 'Emergency Hospital' }), _jsx(StatusBadge, { status: m.urgency || 'URGENT' }), _jsx("span", { className: "text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200", children: toDisplayBloodGroup(m.bloodGroup) })] }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Required date: ", _jsx("span", { className: "font-medium text-slate-700", children: formatDate(m.requiredDate) }), m.unitsRequired && (_jsxs("span", { className: "ml-2", children: ["(", m.unitsRequired, " units needed)"] }))] })] }), _jsx(Link, { to: "/donor/matches", className: "shrink-0", children: _jsx(Button, { variant: "primary", size: "sm", children: "Review & Respond" }) })] }) }, m.id))) }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-base font-semibold text-slate-900", children: "Donor Profile" }), _jsx(Link, { to: "/donor/profile", className: "text-xs font-semibold text-rose-600 hover:text-rose-700", children: "Edit Details" })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "py-3 px-4 bg-slate-50 border-b border-slate-100 flex-row items-center gap-2", children: [_jsx(User, { className: "w-4 h-4 text-slate-600" }), _jsx(CardTitle, { className: "text-xs font-semibold text-slate-700 uppercase tracking-wider", children: "Medical & Contact Details" })] }), _jsxs(CardContent, { className: "p-4 space-y-3 text-xs", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-[11px] uppercase font-semibold", children: "Verification" }), _jsx("div", { className: "mt-1", children: _jsx(StatusBadge, { status: profile?.verificationStatus || 'PENDING' }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-[11px] uppercase font-semibold", children: "Last Donation" }), _jsx("p", { className: "font-semibold text-slate-800 mt-0.5", children: profile?.lastDonationDate ? formatDate(profile.lastDonationDate) : 'None recorded' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-[11px] uppercase font-semibold", children: "Registered Address" }), _jsx("p", { className: "font-medium text-slate-700 mt-0.5", children: profile?.address || 'Address not yet provided' })] }), _jsx("div", { className: "pt-2 border-t border-slate-100", children: _jsx(Link, { to: "/donor/profile", children: _jsx(Button, { variant: "outline", size: "sm", className: "w-full", children: "Update Profile" }) }) })] })] })] })] })] }));
}
