import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBloodRequest } from '@/api/patient.api';
import { patientRequestSchema } from '@/lib/validation';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ALL_DISPLAY_BLOOD_GROUPS, getApiErrorMessage } from '@/lib/utils';
import { ArrowLeft, AlertCircle, Droplet } from 'lucide-react';
export function CreateRequestPage() {
    const [serverError, setServerError] = useState(null);
    const { success } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    // Tomorrow's date as default requiredDate
    const defaultRequiredDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(patientRequestSchema),
        defaultValues: {
            bloodGroup: 'O+',
            unitsRequired: 1,
            hospitalName: '',
            hospitalAddress: '',
            urgency: 'NORMAL',
            requiredDate: defaultRequiredDate,
            additionalNotes: '',
        },
    });
    const createMutation = useMutation({
        mutationFn: createBloodRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['patient', 'requests'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            success('Emergency blood request created successfully!', 'Request Created');
            if (data?.id) {
                navigate(`/patient/requests/${data.id}`);
            }
            else {
                navigate('/patient/requests');
            }
        },
        onError: (err) => {
            setServerError(getApiErrorMessage(err));
        },
    });
    const onSubmit = async (data) => {
        setServerError(null);
        createMutation.mutate(data);
    };
    return (_jsx(PageContainer, { title: "Create Emergency Blood Request", description: "Specify patient blood requirements, target hospital, and urgency to initiate matching.", action: _jsx(Link, { to: "/patient/requests", children: _jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(ArrowLeft, { className: "w-4 h-4" }), children: "Back to Requests" }) }), children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs(Card, { className: "border-slate-200 shadow-sm", children: [_jsxs(CardHeader, { className: "bg-slate-50/70 border-b border-slate-100 pb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Droplet, { className: "w-5 h-5 text-rose-600" }), _jsx(CardTitle, { className: "text-base", children: "Request Specification" })] }), _jsx(CardDescription, { children: "All registered donors matching this blood type will be alerted upon creation." })] }), _jsxs(CardContent, { className: "pt-6", children: [serverError && (_jsxs("div", { role: "alert", className: "mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 shrink-0 text-rose-600 mt-0.5" }), _jsx("div", { className: "flex-1 leading-relaxed", children: serverError })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Select, { label: "Blood Group Required", required: true, error: errors.bloodGroup?.message, ...register('bloodGroup'), children: ALL_DISPLAY_BLOOD_GROUPS.map((bg) => (_jsx("option", { value: bg, children: bg }, bg))) }), _jsx(Input, { label: "Units Required (Pints/Bags)", type: "number", min: 1, max: 20, required: true, error: errors.unitsRequired?.message, ...register('unitsRequired', { valueAsNumber: true }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs(Select, { label: "Urgency Level", required: true, error: errors.urgency?.message, ...register('urgency'), children: [_jsx("option", { value: "NORMAL", children: "Normal (Standard Schedule)" }), _jsx("option", { value: "URGENT", children: "Urgent (Within 24 Hours)" }), _jsx("option", { value: "CRITICAL", children: "Critical (Immediate Emergency)" })] }), _jsx(Input, { label: "Required By Date", type: "date", required: true, error: errors.requiredDate?.message, ...register('requiredDate') })] }), _jsx(Input, { label: "Hospital / Clinic Name", type: "text", placeholder: "e.g. City General Hospital, Emergency Ward 3", required: true, error: errors.hospitalName?.message, ...register('hospitalName') }), _jsx(Input, { label: "Hospital Address / Location", type: "text", placeholder: "e.g. 450 Medical Center Blvd, Floor 2", required: true, error: errors.hospitalAddress?.message, ...register('hospitalAddress') }), _jsx(Textarea, { label: "Additional Clinical Notes / Instructions (Optional)", placeholder: "e.g. Patient is undergoing surgery at 9 AM. Contact Dr. Smith at desk.", rows: 3, error: errors.additionalNotes?.message, ...register('additionalNotes') }), _jsxs("div", { className: "pt-4 border-t border-slate-100 flex items-center justify-end gap-3", children: [_jsx(Link, { to: "/patient/requests", children: _jsx(Button, { type: "button", variant: "outline", size: "md", children: "Cancel" }) }), _jsx(Button, { type: "submit", variant: "primary", size: "md", isLoading: isSubmitting || createMutation.isPending, children: isSubmitting || createMutation.isPending
                                                    ? 'Submitting Request...'
                                                    : 'Publish Blood Request' })] })] })] })] }) }) }));
}
