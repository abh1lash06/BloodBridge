import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHospitalInventory, updateHospitalInventory } from '@/api/hospital.api';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { ALL_DISPLAY_BLOOD_GROUPS, toDisplayBloodGroup, formatDateTime, getApiErrorMessage, } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { Package, Edit3, Droplet, RefreshCw, AlertCircle } from 'lucide-react';
export function HospitalInventoryPage() {
    const [editingGroup, setEditingGroup] = useState(null);
    const [newUnits, setNewUnits] = useState(0);
    const [modalError, setModalError] = useState(null);
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    const { data: rawInventory = [], isLoading, isError, refetch, } = useQuery({
        queryKey: ['hospital', 'inventory'],
        queryFn: getHospitalInventory,
    });
    const updateMutation = useMutation({
        mutationFn: (data) => updateHospitalInventory(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['hospital', 'inventory'] });
            queryClient.invalidateQueries({ queryKey: ['hospital', 'profile'] });
            success(`Inventory for ${toDisplayBloodGroup(variables.bloodGroup)} updated to ${variables.availableUnits} units!`, 'Inventory Updated');
            setEditingGroup(null);
            setModalError(null);
        },
        onError: (err) => {
            setModalError(getApiErrorMessage(err));
        },
    });
    // Ensure all 8 blood groups are represented even if backend returns fewer
    const fullInventory = ALL_DISPLAY_BLOOD_GROUPS.map((group) => {
        const existing = rawInventory.find((item) => toDisplayBloodGroup(item.bloodGroup) === group);
        return {
            bloodGroup: group,
            availableUnits: existing ? existing.availableUnits : 0,
            reservedUnits: existing ? existing.reservedUnits : 0,
            updatedAt: existing?.updatedAt,
        };
    });
    const handleOpenEdit = (group, currentAvailable) => {
        setEditingGroup(group);
        setNewUnits(currentAvailable);
        setModalError(null);
    };
    const handleSaveUnits = (e) => {
        e.preventDefault();
        if (!editingGroup)
            return;
        if (newUnits < 0) {
            setModalError('Units cannot be negative.');
            return;
        }
        updateMutation.mutate({
            bloodGroup: editingGroup,
            availableUnits: Number(newUnits),
        });
    };
    const totalAvailable = fullInventory.reduce((acc, curr) => acc + curr.availableUnits, 0);
    const totalReserved = fullInventory.reduce((acc, curr) => acc + curr.reservedUnits, 0);
    return (_jsxs(PageContainer, { title: "Blood Bank Inventory Management", description: "Monitor live stock levels and update available units across all 8 standard blood groups.", action: _jsx(Button, { variant: "outline", size: "sm", onClick: () => refetch(), leftIcon: _jsx(RefreshCw, { className: "w-3.5 h-3.5" }), children: "Refresh Stock" }), children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 rounded-xl border border-teal-200 bg-teal-50/60 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-teal-800 uppercase tracking-wider", children: "Total Available Blood Units" }), _jsxs("h3", { className: "text-2xl font-black text-teal-950 mt-1", children: [totalAvailable, " units"] })] }), _jsx("div", { className: "w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold", children: _jsx(Package, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-4 rounded-xl border border-purple-200 bg-purple-50/60 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-purple-800 uppercase tracking-wider", children: "Total Reserved For Patients" }), _jsxs("h3", { className: "text-2xl font-black text-purple-950 mt-1", children: [totalReserved, " units"] })] }), _jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold", children: _jsx(Droplet, { className: "w-5 h-5" }) })] })] }), isLoading ? (_jsx("div", { className: "py-20 flex justify-center", children: _jsx(Spinner, { size: "lg", label: "Loading blood inventory..." }) })) : isError ? (_jsx(ErrorState, { title: "Could not load inventory", message: "Failed to fetch hospital inventory levels from the server.", onRetry: () => refetch() })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: fullInventory.map((item) => (_jsx(Card, { className: "hover:border-slate-300 transition-all shadow-xs", children: _jsxs(CardContent, { className: "p-5 flex flex-col justify-between h-full", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "w-12 h-12 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-lg font-black flex items-center justify-center shadow-xs", children: item.bloodGroup }), _jsx("button", { type: "button", onClick: () => handleOpenEdit(item.bloodGroup, item.availableUnits), className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors", title: `Update ${item.bloodGroup} inventory`, children: _jsx(Edit3, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-1 mb-4", children: [_jsxs("div", { className: "flex items-baseline justify-between", children: [_jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Available Units:" }), _jsx("span", { className: "text-xl font-bold text-slate-900", children: item.availableUnits })] }), _jsxs("div", { className: "flex items-baseline justify-between text-xs text-slate-500", children: [_jsx("span", { children: "Reserved:" }), _jsx("span", { className: "font-semibold text-purple-700", children: item.reservedUnits })] })] })] }), _jsxs("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] text-slate-400 truncate", children: item.updatedAt
                                            ? `Updated ${formatDateTime(item.updatedAt)}`
                                            : 'Stock monitored' }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-xs text-rose-600 hover:text-rose-700 p-0 h-auto", onClick: () => handleOpenEdit(item.bloodGroup, item.availableUnits), children: "Adjust" })] })] }) }, item.bloodGroup))) })), _jsxs(Modal, { isOpen: !!editingGroup, onClose: () => setEditingGroup(null), title: `Adjust Stock: ${editingGroup ? toDisplayBloodGroup(editingGroup) : ''}`, description: "Update the available units on hand in the facility blood bank.", maxWidth: "sm", children: [modalError && (_jsxs("div", { role: "alert", className: "mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-rose-600 shrink-0 mt-0.5" }), _jsx("span", { children: modalError })] })), _jsxs("form", { onSubmit: handleSaveUnits, className: "space-y-4", children: [_jsx(Input, { label: `Available Units (${editingGroup})`, type: "number", min: 0, max: 9999, value: newUnits, onChange: (e) => setNewUnits(parseInt(e.target.value) || 0), required: true, autoFocus: true }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100", children: [_jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setEditingGroup(null), children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", size: "sm", isLoading: updateMutation.isPending, children: "Update Stock" })] })] })] })] }));
}
