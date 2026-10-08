import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient, } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { getHospitalProfile } from '@/api/hospital.api';
import { hospitalProfileSchema, } from '@/lib/validation';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { getApiErrorMessage } from '@/lib/utils';
import { Building2, ShieldCheck, AlertCircle, CheckCircle2, } from 'lucide-react';
export function HospitalProfilePage() {
    const [serverError, setServerError] = useState(null);
    const { success } = useToast();
    const queryClient = useQueryClient();
    /*
     * =========================================================
     * HOSPITAL PROFILE QUERY
     * =========================================================
     */
    const { data: profile, isLoading, isError, error, refetch, } = useQuery({
        queryKey: ['hospital', 'profile'],
        queryFn: getHospitalProfile,
        retry: false,
    });
    /*
     * =========================================================
     * FORM
     * =========================================================
     */
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, }, } = useForm({
        resolver: zodResolver(hospitalProfileSchema),
        defaultValues: {
            hospitalName: '',
            registrationNumber: '',
            address: '',
            city: '',
            state: '',
            phone: '',
        },
    });
    /*
     * =========================================================
     * LOAD EXISTING PROFILE INTO FORM
     * =========================================================
     */
    useEffect(() => {
        if (!profile) {
            return;
        }
        reset({
            hospitalName: profile.hospitalName || '',
            registrationNumber: profile.registrationNumber || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            phone: profile.phone || '',
        });
    }, [profile, reset]);
    /*
     * =========================================================
     * DETECT "PROFILE NOT FOUND"
     * =========================================================
     *
     * Backend returns:
     *
     * {
     *   "message": "Hospital profile not found"
     * }
     *
     * In this situation we show the CREATE form.
     * =========================================================
     */
    const backendMessage = error?.response?.data?.message ||
        '';
    const profileNotFound = isError &&
        backendMessage ===
            'Hospital profile not found';
    /*
     * =========================================================
     * CREATE PROFILE
     * =========================================================
     */
    const createMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/api/hospital/profile', data);
            return response.data;
        },
        onSuccess: () => {
            setServerError(null);
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'profile'],
            });
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'inventory'],
            });
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'reservations'],
            });
            success('Hospital facility profile created successfully. It is now pending administrator verification.', 'Profile Created');
        },
        onError: (err) => {
            setServerError(getApiErrorMessage(err));
        },
    });
    /*
     * =========================================================
     * UPDATE PROFILE
     * =========================================================
     */
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.put('/api/hospital/profile', data);
            return response.data;
        },
        onSuccess: () => {
            setServerError(null);
            queryClient.invalidateQueries({
                queryKey: ['hospital', 'profile'],
            });
            success('Hospital facility details updated successfully!', 'Profile Saved');
        },
        onError: (err) => {
            setServerError(getApiErrorMessage(err));
        },
    });
    /*
     * =========================================================
     * SUBMIT
     * =========================================================
     */
    const onSubmit = (data) => {
        setServerError(null);
        /*
         * No profile exists:
         * POST /api/hospital/profile
         *
         * Existing profile:
         * PUT /api/hospital/profile
         */
        if (profileNotFound) {
            createMutation.mutate(data);
            return;
        }
        updateMutation.mutate(data);
    };
    /*
     * =========================================================
     * LOADING
     * =========================================================
     */
    if (isLoading) {
        return (_jsx(PageContainer, { title: "Hospital Facility Profile", description: "Hospital accreditation details, license numbers, and medical facility contact information.", children: _jsx("div", { className: "py-20 flex justify-center", children: _jsx(Spinner, { size: "lg", label: "Loading hospital profile..." }) }) }));
    }
    /*
     * =========================================================
     * PROFILE NOT FOUND
     *
     * This is NOT a fatal error.
     *
     * Show the create profile form.
     * =========================================================
     */
    if (profileNotFound) {
        return (_jsx(PageContainer, { title: "Create Hospital Facility Profile", description: "Register your medical facility before managing blood inventory and reservations.", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs(Card, { children: [_jsx(CardHeader, { className: "bg-amber-50 border-b border-amber-100", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0", children: _jsx(Building2, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Facility Profile Required" }), _jsx(CardDescription, { className: "mt-1", children: "Your hospital account is active, but a facility profile has not been created yet. Complete the details below to register the hospital." })] })] }) }), _jsxs(CardContent, { className: "p-6", children: [serverError && (_jsxs("div", { role: "alert", className: "mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-600 mt-0.5" }), _jsx("div", { className: "flex-1 leading-relaxed", children: serverError })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Input, { label: "Hospital / Clinic Name", type: "text", required: true, placeholder: "Test Hospital Hyderabad", error: errors.hospitalName?.message, ...register('hospitalName') }), _jsx(Input, { label: "Medical Registration / License Number", type: "text", required: true, placeholder: "HOSP-TEST-001", error: errors.registrationNumber
                                                        ?.message, ...register('registrationNumber') })] }), _jsx(Input, { label: "Facility Street Address", type: "text", required: true, placeholder: "Banjara Hills, Hyderabad", error: errors.address?.message, ...register('address') }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx(Input, { label: "City", type: "text", required: true, placeholder: "Hyderabad", error: errors.city?.message, ...register('city') }), _jsx(Input, { label: "State / Province", type: "text", required: true, placeholder: "Telangana", error: errors.state?.message, ...register('state') }), _jsx(Input, { label: "Contact Phone", type: "tel", required: true, placeholder: "9876543210", error: errors.phone?.message, ...register('phone') })] }), _jsx("div", { className: "p-4 rounded-xl bg-blue-50 border border-blue-100", children: _jsxs("div", { className: "flex items-start gap-2.5", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-blue-600 mt-0.5 shrink-0" }), _jsxs("div", { className: "text-xs text-blue-800 leading-relaxed", children: ["After submission, the hospital profile will be marked as", _jsxs("strong", { children: [' ', "Pending Administrator Review"] }), ". An administrator must verify the facility before it becomes an accredited facility."] })] }) }), _jsx("div", { className: "pt-4 border-t border-slate-100 flex justify-end", children: _jsx(Button, { type: "submit", variant: "primary", size: "md", isLoading: isSubmitting ||
                                                    createMutation.isPending, leftIcon: _jsx(Building2, { className: "w-4 h-4" }), children: createMutation.isPending ||
                                                    isSubmitting
                                                    ? 'Creating Facility...'
                                                    : 'Create Facility Profile' }) })] })] })] }) }) }));
    }
    /*
     * =========================================================
     * OTHER ERRORS
     * =========================================================
     */
    if (isError) {
        return (_jsx(PageContainer, { title: "Hospital Facility Profile", description: "Hospital accreditation details, license numbers, and medical facility contact information.", children: _jsx(ErrorState, { title: "Could not load profile", message: getApiErrorMessage(error) ||
                    'Failed to retrieve facility details from backend.', onRetry: () => refetch() }) }));
    }
    /*
     * =========================================================
     * EXISTING PROFILE
     * =========================================================
     */
    const isVerified = profile?.verified === true ||
        profile?.verificationStatus ===
            'VERIFIED';
    const isSaving = isSubmitting ||
        updateMutation.isPending;
    return (_jsx(PageContainer, { title: "Hospital Facility Profile", description: "Hospital accreditation details, license numbers, and medical facility contact information.", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "bg-slate-50 border-b border-slate-100", children: _jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Accreditation Status" }) }), _jsxs(CardContent, { className: "p-5 space-y-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1", children: "Verification Status" }), _jsx("div", { className: "flex items-center gap-2", children: isVerified ? (_jsx(Badge, { variant: "verified", children: "Accredited Facility" })) : (_jsx(Badge, { variant: "pending", children: "Pending Administrator Review" })) }), _jsx("p", { className: "text-xs text-slate-500 mt-2 leading-relaxed", children: isVerified
                                                ? 'This medical center is verified to manage inventory and reserve blood units.'
                                                : 'System administrators review licenses prior to active emergency blood operations.' })] }), _jsxs("div", { className: "pt-3 border-t border-slate-100", children: [_jsx("span", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1", children: "Registration / License" }), _jsx("p", { className: "text-sm font-bold text-slate-900", children: profile?.registrationNumber ||
                                                'Not configured' })] }), isVerified && (_jsx("div", { className: "pt-3 border-t border-slate-100", children: _jsxs("div", { className: "flex items-center gap-2 text-emerald-700", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), _jsx("span", { className: "text-xs font-semibold", children: "Facility Verified" })] }) }))] })] }), _jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "bg-slate-50 border-b border-slate-100", children: [_jsx(CardTitle, { className: "text-sm font-semibold text-slate-800", children: "Facility Information" }), _jsx(CardDescription, { children: "Keep contact telephone and address up to date for emergency donor dispatch." })] }), _jsxs(CardContent, { className: "p-6", children: [serverError && (_jsxs("div", { role: "alert", className: "mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-600 mt-0.5" }), _jsx("div", { className: "flex-1 leading-relaxed", children: serverError })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Input, { label: "Hospital / Clinic Name", type: "text", required: true, error: errors.hospitalName?.message, ...register('hospitalName') }), _jsx(Input, { label: "Medical Registration / License Number", type: "text", required: true, error: errors.registrationNumber
                                                            ?.message, ...register('registrationNumber') })] }), _jsx(Input, { label: "Facility Street Address", type: "text", required: true, error: errors.address?.message, ...register('address') }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx(Input, { label: "City", type: "text", required: true, error: errors.city?.message, ...register('city') }), _jsx(Input, { label: "State / Province", type: "text", required: true, error: errors.state?.message, ...register('state') }), _jsx(Input, { label: "Contact Phone", type: "tel", required: true, error: errors.phone?.message, ...register('phone') })] }), _jsx("div", { className: "pt-4 border-t border-slate-100 flex justify-end", children: _jsx(Button, { type: "submit", variant: "primary", size: "md", isLoading: isSaving, children: isSaving
                                                        ? 'Saving Facility...'
                                                        : 'Save Changes' }) })] })] })] }) })] }) }));
}
