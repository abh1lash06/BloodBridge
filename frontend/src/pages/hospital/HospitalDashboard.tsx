import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import {
  getHospitalProfile,
  getHospitalInventory,
  getHospitalReservations,
} from '@/api/hospital.api';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';
import {
  StatusBadge,
  Badge,
} from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  toDisplayBloodGroup,
  formatDate,
} from '@/lib/utils';

import {
  Building2,
  Package,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';

export function HospitalDashboard() {
  const { user } = useAuth();

  const {
    data: profile,
  } = useQuery({
    queryKey: ['hospital', 'profile'],
    queryFn: getHospitalProfile,
  });

  const {
    data: inventory = [],
    isLoading: isInventoryLoading,
  } = useQuery({
    queryKey: ['hospital', 'inventory'],
    queryFn: getHospitalInventory,
  });

  const {
    data: reservations = [],
    isLoading: isReservationsLoading,
  } = useQuery({
    queryKey: ['hospital', 'reservations'],
    queryFn: getHospitalReservations,
  });

  const totalAvailable = inventory.reduce(
    (sum, item) =>
      sum + (item.availableUnits || 0),
    0
  );

  const totalReserved = inventory.reduce(
    (sum, item) =>
      sum + (item.reservedUnits || 0),
    0
  );

  const activeReservations =
    reservations.filter(
      (r) => r.status === 'RESERVED'
    );

  const isVerified =
    profile?.verified === true ||
    profile?.verificationStatus === 'VERIFIED';

  return (
    <PageContainer
      title={`Hospital Operations: ${
        profile?.hospitalName ||
        user?.fullName ||
        'Portal'
      }`}
      description="Manage blood bank inventory, reserve units for patient requests, and record reservation fulfillment."
      action={
        <div className="flex items-center gap-2">
          <Link to="/hospital/inventory">
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <Package className="w-4 h-4" />
              }
            >
              Update Inventory
            </Button>
          </Link>

          <Link to="/hospital/reservations">
            <Button
              variant="primary"
              size="sm"
              leftIcon={
                <CalendarCheck className="w-4 h-4" />
              }
            >
              Manage Reservations (
              {activeReservations.length})
            </Button>
          </Link>
        </div>
      }
    >
      <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isVerified
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {profile?.hospitalName ||
                  'Medical Center'}
              </h4>

              {isVerified ? (
                <Badge variant="verified">
                  Facility Verified
                </Badge>
              ) : (
                <Badge variant="pending">
                  Pending Admin Verification
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Registration #
              {profile?.registrationNumber ||
                'Pending'}{' '}
              •{' '}
              {profile?.city
                ? `${profile.city}, ${profile.state}`
                : 'Location unconfigured'}
            </p>
          </div>
        </div>

        <Link to="/hospital/profile">
          <Button
            variant="outline"
            size="sm"
          >
            View Facility Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-teal-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Available Stock
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {totalAvailable}{' '}
                <span className="text-xs font-normal text-slate-500">
                  units
                </span>
              </h3>
            </div>

            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                Reserved Units
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {totalReserved}{' '}
                <span className="text-xs font-normal text-slate-500">
                  units
                </span>
              </h3>
            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-sky-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                Active Holds
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {activeReservations.length}
              </h3>
            </div>

            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-indigo-100 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                Total Reservations
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {reservations.length}
              </h3>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Inventory Snapshot
            </CardTitle>

            <Link
              to="/hospital/inventory"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              Full Inventory
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-4">
            {isInventoryLoading ? (
              <div className="py-8 flex justify-center">
                <Spinner
                  size="md"
                  label="Loading inventory..."
                />
              </div>
            ) : inventory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No inventory records found. Click
                "Update Inventory" to populate stocks.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {inventory.map((item) => (
                  <div
                    key={item.bloodGroup}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 text-center"
                  >
                    <span className="text-xs font-extrabold text-rose-700 block">
                      {toDisplayBloodGroup(
                        item.bloodGroup
                      )}
                    </span>

                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {item.availableUnits}
                    </span>

                    <span className="text-[10px] text-slate-400 block">
                      {item.reservedUnits} res
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Active Blood Holds
            </CardTitle>

            <Link
              to="/hospital/reservations"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All ({reservations.length})
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100">
            {isReservationsLoading ? (
              <div className="py-8 flex justify-center">
                <Spinner
                  size="md"
                  label="Loading reservations..."
                />
              </div>
            ) : activeReservations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active blood reservations at this time.
              </div>
            ) : (
              activeReservations
                .slice(0, 4)
                .map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center justify-center">
                        {toDisplayBloodGroup(
                          res.bloodGroup
                        )}
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {res.unitsReserved}{' '}
                          {res.unitsReserved === 1
                            ? 'unit'
                            : 'units'}{' '}
                          • Request #
                          {res.requestId}
                        </p>

                        <p className="text-[11px] text-slate-500">
                          Reserved on{' '}
                          {formatDate(
                            res.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={res.status}
                    />
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}