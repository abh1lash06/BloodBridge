export interface HospitalProfile {
  id?: number | string;
  userId?: number | string;
  hospitalName: string;
  registrationNumber: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  verified?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface HospitalInventoryItem {
  bloodGroup: string;
  availableUnits: number;
  reservedUnits: number;
  updatedAt?: string;
}

export type ReservationStatus = 'RESERVED' | 'RELEASED' | 'FULFILLED' | 'CANCELLED';

export interface HospitalReservation {
  id: number | string;
  bloodRequestId: number | string;
  bloodGroup: string;
  unitsReserved: number;
  status: ReservationStatus;
  patientName?: string;
  hospitalName?: string;
  createdAt: string;
  releasedAt?: string | null;
  fulfilledAt?: string | null;
}

export interface ReserveBloodRequest {
  units: number;
}
