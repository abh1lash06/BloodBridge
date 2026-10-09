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
    return (<PageContainer title="Blood Bank Inventory Management" description="Monitor live stock levels and update available units across all 8 standard blood groups." action={<Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="w-3.5 h-3.5"/>}>
          Refresh Stock
        </Button>}>
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
              Total Available Blood Units
            </p>
            <h3 className="text-2xl font-black text-teal-950 mt-1">{totalAvailable} units</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
            <Package className="w-5 h-5"/>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
              Total Reserved For Patients
            </p>
            <h3 className="text-2xl font-black text-purple-950 mt-1">{totalReserved} units</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <Droplet className="w-5 h-5"/>
          </div>
        </div>
      </div>

      {isLoading ? (<div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading blood inventory..."/>
        </div>) : isError ? (<ErrorState title="Could not load inventory" message="Failed to fetch hospital inventory levels from the server." onRetry={() => refetch()}/>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fullInventory.map((item) => (<Card key={item.bloodGroup} className="hover:border-slate-300 transition-all shadow-xs">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-lg font-black flex items-center justify-center shadow-xs">
                      {item.bloodGroup}
                    </span>
                    <button type="button" onClick={() => handleOpenEdit(item.bloodGroup, item.availableUnits)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors" title={`Update ${item.bloodGroup} inventory`}>
                      <Edit3 className="w-4 h-4"/>
                    </button>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Available Units:</span>
                      <span className="text-xl font-bold text-slate-900">
                        {item.availableUnits}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs text-slate-500">
                      <span>Reserved:</span>
                      <span className="font-semibold text-purple-700">{item.reservedUnits}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate">
                    {item.updatedAt
                    ? `Updated ${formatDateTime(item.updatedAt)}`
                    : 'Stock monitored'}
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs text-rose-600 hover:text-rose-700 p-0 h-auto" onClick={() => handleOpenEdit(item.bloodGroup, item.availableUnits)}>
                    Adjust
                  </Button>
                </div>
              </CardContent>
            </Card>))}
        </div>)}

      {/* Edit Inventory Modal */}
      <Modal isOpen={!!editingGroup} onClose={() => setEditingGroup(null)} title={`Adjust Stock: ${editingGroup ? toDisplayBloodGroup(editingGroup) : ''}`} description="Update the available units on hand in the facility blood bank." maxWidth="sm">
        {modalError && (<div role="alert" className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"/>
            <span>{modalError}</span>
          </div>)}

        <form onSubmit={handleSaveUnits} className="space-y-4">
          <Input label={`Available Units (${editingGroup})`} type="number" min={0} max={9999} value={newUnits} onChange={(e) => setNewUnits(parseInt(e.target.value) || 0)} required autoFocus/>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingGroup(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={updateMutation.isPending}>
              Update Stock
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>);
}
