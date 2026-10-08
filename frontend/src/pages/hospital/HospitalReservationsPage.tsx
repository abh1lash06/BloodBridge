import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getHospitalReservations,
  releaseReservation,
  fulfillReservation,
  reserveBlood,
} from '@/api/hospital.api';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
} from '@/components/ui/Card';
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';

import {
  toDisplayBloodGroup,
  formatDateTime,
  getApiErrorMessage,
} from '@/lib/utils';

import { useToast } from '@/hooks/useToast';

import {
  CalendarCheck,
  PackageCheck,
  RotateCcw,
  PlusCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';

export function HospitalReservationsPage() {
  const [filter, setFilter] =
    useState<string>('ALL');

  const [releaseId, setReleaseId] =
    useState<string | number | null>(null);

  const [fulfillId, setFulfillId] =
    useState<string | number | null>(null);

  const [isReserveModalOpen, setIsReserveModalOpen] =
    useState(false);

  const [selectedRequestId, setSelectedRequestId] =
    useState<string>('');

  const [unitsToReserve, setUnitsToReserve] =
    useState<number>(1);

  const [modalError, setModalError] =
    useState<string | null>(null);

  const { success, error: toastError } =
    useToast();

  const queryClient = useQueryClient();

  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['hospital', 'reservations'],
    queryFn: getHospitalReservations,
  });

  const releaseMutation = useMutation({
    mutationFn: (id: string | number) =>
      releaseReservation(id),

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

      success(
        'Blood units successfully released back to inventory.',
        'Reservation Released'
      );

      setReleaseId(null);
    },

    onError: (err) => {
      toastError(getApiErrorMessage(err));
    },
  });

  const fulfillMutation = useMutation({
    mutationFn: (id: string | number) =>
      fulfillReservation(id),

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

      success(
        'Reservation and patient request marked as fulfilled!',
        'Blood Fulfilled'
      );

      setFulfillId(null);
    },

    onError: (err) => {
      toastError(getApiErrorMessage(err));
    },
  });

  const reserveMutation = useMutation({
    mutationFn: ({
      reqId,
      units,
    }: {
      reqId: string | number;
      units: number;
    }) =>
      reserveBlood(reqId, units),

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

      success(
        'Blood successfully reserved for patient request!',
        'Reservation Created'
      );

      setIsReserveModalOpen(false);
      setSelectedRequestId('');
      setUnitsToReserve(1);
      setModalError(null);
    },

    onError: (err) => {
      setModalError(
        getApiErrorMessage(err)
      );
    },
  });

  const handleCreateReservation = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const requestId =
      selectedRequestId.trim();

    if (!requestId) {
      setModalError(
        'Please enter the patient blood request ID.'
      );
      return;
    }

    if (
      !Number.isInteger(unitsToReserve) ||
      unitsToReserve < 1
    ) {
      setModalError(
        'Units to reserve must be at least 1.'
      );
      return;
    }

    reserveMutation.mutate({
      reqId: requestId,
      units: unitsToReserve,
    });
  };

  const filteredReservations =
    reservations.filter((reservation) => {
      if (filter === 'ALL') {
        return true;
      }

      return reservation.status === filter;
    });

  return (
    <PageContainer
      title="Hospital Blood Reservations"
      description="Lock available blood units for urgent patient cases, release cancelled holds, or confirm clinical fulfillment."
      action={
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setIsReserveModalOpen(true);
            setModalError(null);
          }}
          leftIcon={
            <PlusCircle className="w-4 h-4" />
          }
        >
          Reserve Blood for Request
        </Button>
      }
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
        </div>

        {[
          'ALL',
          'RESERVED',
          'RELEASED',
          'FULFILLED',
          'CANCELLED',
        ].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'ALL'
              ? 'All Reservations'
              : status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner
            size="lg"
            label="Loading reservations..."
          />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load reservations"
          message="Failed to retrieve reservation records from the server."
          onRetry={() => refetch()}
        />
      ) : filteredReservations.length === 0 ? (
        <EmptyState
          icon={
            <CalendarCheck className="w-6 h-6 text-purple-600" />
          }
          title={
            filter === 'ALL'
              ? 'No reservations yet'
              : `No ${filter.toLowerCase()} reservations`
          }
          description={
            filter === 'ALL'
              ? 'When blood is reserved for patient requests, records will appear here for release or fulfillment.'
              : `No reservation records currently matched the ${filter} filter.`
          }
          actionLabel="Reserve Blood Now"
          onAction={() =>
            setIsReserveModalOpen(true)
          }
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Reservation ID
                </TableHead>

                <TableHead>
                  Blood Group
                </TableHead>

                <TableHead>
                  Units Reserved
                </TableHead>

                <TableHead>
                  Request Ref
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Created Time
                </TableHead>

                <TableHead>
                  Release / Fulfill Time
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReservations.map(
                (reservation) => {
                  const isHoldActive =
                    reservation.status ===
                    'RESERVED';

                  return (
                    <TableRow
                      key={reservation.id}
                    >
                      <TableCell className="font-semibold text-slate-900">
                        #{reservation.id}
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {toDisplayBloodGroup(
                            reservation.bloodGroup
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="font-bold text-slate-800">
                        {reservation.unitsReserved}{' '}
                        {reservation.unitsReserved ===
                        1
                          ? 'unit'
                          : 'units'}
                      </TableCell>

                      <TableCell className="text-slate-600 font-medium">
                        Request #
                        {reservation.requestId}
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          status={
                            reservation.status
                          }
                        />
                      </TableCell>

                      <TableCell className="text-xs text-slate-500">
                        {formatDateTime(
                          reservation.createdAt
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500">
                        {reservation.releaseTime
                          ? formatDateTime(
                              reservation.releaseTime
                            )
                          : reservation.fulfilledAt
                            ? formatDateTime(
                                reservation.fulfilledAt
                              )
                            : '—'}
                      </TableCell>

                      <TableCell className="text-right">
                        {isHoldActive ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setReleaseId(
                                  reservation.id
                                )
                              }
                              leftIcon={
                                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                              }
                            >
                              Release
                            </Button>

                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                setFulfillId(
                                  reservation.id
                                )
                              }
                              leftIcon={
                                <PackageCheck className="w-3.5 h-3.5" />
                              }
                            >
                              Fulfill
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        isOpen={isReserveModalOpen}
        onClose={() =>
          setIsReserveModalOpen(false)
        }
        title="Reserve Blood Units"
        description="Enter the BloodBridge request ID and allocate available hospital blood units to that emergency request."
      >
        {modalError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{modalError}</span>
          </div>
        )}

        <form
          onSubmit={handleCreateReservation}
          className="space-y-4"
        >
          <Input
            label="Blood Request ID"
            type="number"
            min={1}
            value={selectedRequestId}
            onChange={(event) =>
              setSelectedRequestId(
                event.target.value
              )
            }
            placeholder="Example: 3"
            helperText="Enter the ID of the patient blood request you want to reserve blood for."
            required
          />

          <Input
            label="Units to Reserve"
            type="number"
            min={1}
            max={50}
            value={unitsToReserve}
            onChange={(event) =>
              setUnitsToReserve(
                parseInt(
                  event.target.value,
                  10
                ) || 1
              )
            }
            required
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setIsReserveModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={
                reserveMutation.isPending
              }
            >
              Confirm Reservation
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!releaseId}
        onClose={() => setReleaseId(null)}
        onConfirm={() =>
          releaseId &&
          releaseMutation.mutate(releaseId)
        }
        isLoading={
          releaseMutation.isPending
        }
        title="Release Blood Reservation"
        message="Are you sure you want to release these reserved units back to available hospital inventory?"
        confirmText="Release Units"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!fulfillId}
        onClose={() => setFulfillId(null)}
        onConfirm={() =>
          fulfillId &&
          fulfillMutation.mutate(fulfillId)
        }
        isLoading={
          fulfillMutation.isPending
        }
        title="Fulfill Blood Reservation"
        message="Confirm that the reserved blood units have been delivered to the patient."
        confirmText="Confirm Fulfillment"
        variant="success"
      />
    </PageContainer>
  );
}