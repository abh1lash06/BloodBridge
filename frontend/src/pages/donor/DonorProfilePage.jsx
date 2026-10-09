import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDonorProfile, saveDonorProfile, updateDonorAvailability } from '@/api/donor.api';
import { donorProfileSchema } from '@/lib/validation';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { ALL_DISPLAY_BLOOD_GROUPS, toDisplayBloodGroup, formatDate, getApiErrorMessage } from '@/lib/utils';
import { Power, AlertCircle } from 'lucide-react';
export function DonorProfilePage() {
    const [serverError, setServerError] = useState(null);
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    const { data: profile, isLoading, isError, refetch, } = useQuery({
        queryKey: ['donor', 'profile'],
        queryFn: getDonorProfile,
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(donorProfileSchema),
        defaultValues: {
            bloodGroup: '',
            dateOfBirth: '',
            gender: '',
            address: '',
        },
    });
    useEffect(() => {
        if (profile) {
            reset({
                bloodGroup: toDisplayBloodGroup(profile.bloodGroup) || '',
                dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
                gender: profile.gender || '',
                address: profile.address || '',
            });
        }
    }, [profile, reset]);
    const saveMutation = useMutation({
        mutationFn: saveDonorProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donor', 'profile'] });
            success('Donor profile saved successfully!', 'Profile Saved');
            setServerError(null);
        },
        onError: (err) => {
            setServerError(getApiErrorMessage(err));
        },
    });
    const availabilityMutation = useMutation({
        mutationFn: (newStatus) => updateDonorAvailability(newStatus),
        onSuccess: (_, newStatus) => {
            queryClient.invalidateQueries({ queryKey: ['donor', 'profile'] });
            success(newStatus ? 'You are now available for donation matches.' : 'Marked as unavailable.', 'Availability Updated');
        },
        onError: (err) => {
            toastError(getApiErrorMessage(err));
        },
    });
    const onSubmit = (data) => {
        setServerError(null);
        saveMutation.mutate(data);
    };
    const isAvailable = profile?.available ?? false;
    return (_jsx(PageContainer, { title: "Donor Medical Profile", description: "Maintain your blood donation eligibility, clinical details, and real-time availability.", children: isLoading ? (_jsx("div", { className: "py-20 flex justify-center", children: _jsx(Spinner, { size: "lg", label: "Loading donor profile..." }) })) : isError ? (_jsx(ErrorState, { title: "Could not load profile", message: "Failed to retrieve donor profile details from backend.", onRetry: () => refetch() })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { className: "bg-slate-50 border-b border-slate-100", children: _jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Verification & Status" }) }), _jsxs(CardContent, { className: "p-5 space-y-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1", children: "Medical Verification" }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(StatusBadge, { status: profile?.verificationStatus || 'PENDING' }) }), _jsx("p", { className: "text-xs text-slate-500 mt-2 leading-relaxed", children: profile?.verificationStatus === 'VERIFIED'
                                                    ? 'Your donor profile is medically verified by administrator.'
                                                    : profile?.verificationStatus === 'REJECTED'
                                                        ? 'Your donor verification was declined. Please contact admin.'
                                                        : 'Verification is currently pending administrative review.' })] }), _jsxs("div", { className: "pt-3 border-t border-slate-100", children: [_jsx("span", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1", children: "Donation Availability" }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("div", { children: isAvailable ? (_jsx(Badge, { variant: "verified", children: "Available to Donate" })) : (_jsx(Badge, { variant: "cancelled", children: "Currently Unavailable" })) }), _jsx(Button, { variant: isAvailable ? 'outline' : 'success', size: "sm", onClick: () => availabilityMutation.mutate(!isAvailable), isLoading: availabilityMutation.isPending, disabled: profile?.needsCreation === true, leftIcon: _jsx(Power, { className: "w-3.5 h-3.5" }), children: isAvailable ? 'Go Unavailable' : 'Make Available' })] })] }), _jsxs("div", { className: "pt-3 border-t border-slate-100", children: [_jsx("span", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1", children: "Last Donation Date" }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: profile?.lastDonationDate
                                                    ? formatDate(profile.lastDonationDate)
                                                    : 'No previous donations recorded' })] })] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "bg-slate-50 border-b border-slate-100", children: [_jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Donor Clinical Information" }), _jsx(CardDescription, { children: "Accurate blood group and address are required for rapid emergency matching." })] }), _jsxs(CardContent, { className: "p-6", children: [serverError && (_jsxs("div", { role: "alert", className: "mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-600 mt-0.5" }), _jsx("div", { className: "flex-1 leading-relaxed", children: serverError })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [profile?.bloodGroup
    ? _jsx("div", { className: "text-sm font-semibold text-slate-700", children: `Blood Group: ${toDisplayBloodGroup(profile.bloodGroup)} (fixed after registration)` })
    : _jsx(Select, { label: "Blood Group", required: true, error: errors.bloodGroup?.message, ...register('bloodGroup'), children: [
        _jsx("option", { value: "", children: "Select blood group" }),
        ...ALL_DISPLAY_BLOOD_GROUPS.map((bg) => (_jsx("option", { value: bg, children: bg }, bg)))
    ] }), _jsxs(Select, { label: "Gender", required: true, error: errors.gender?.message, ...register('gender'), children: [_jsx("option", { value: "", children: "Select gender" }), _jsx("option", { value: "MALE", children: "Male" }), _jsx("option", { value: "FEMALE", children: "Female" }), _jsx("option", { value: "OTHER", children: "Other" })] })] }), _jsx(Input, { label: "Date of Birth", type: "date", required: true, error: errors.dateOfBirth?.message, ...register('dateOfBirth') }), _jsx(Input, { label: "Residential Address / City", type: "text", placeholder: "e.g. 124 Park Ave, Metropolis", required: true, error: errors.address?.message, ...register('address') }), _jsx("div", { className: "pt-4 border-t border-slate-100 flex justify-end", children: _jsx(Button, { type: "submit", variant: "primary", size: "md", isLoading: isSubmitting || saveMutation.isPending, children: isSubmitting || saveMutation.isPending
                                                        ? 'Saving Profile...'
                                                        : 'Save Profile Changes' }) })] })] })] }) })] })) }));
}
