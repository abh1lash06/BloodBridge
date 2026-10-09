import apiClient from './client';
import {
  HospitalProfile,
  HospitalInventoryItem,
  HospitalReservation,
} from '@/types/hospital';
import { toInternalBloodGroup } from '@/lib/utils';

export async function getHospitalProfile(): Promise<HospitalProfile> {
  const response = await apiClient.get<HospitalProfile>(
    '/api/hospital/profile'
  );

  return response.data;
}

export async function saveHospitalProfile(
  data: HospitalProfile
): Promise<HospitalProfile> {
  const response = await apiClient.put<HospitalProfile>(
    '/api/hospital/profile',
    data
  );

  return response.data;
}

export async function getHospitalInventory(): Promise<
  HospitalInventoryItem[]
> {
  const response = await apiClient.get<HospitalInventoryItem[]>(
    '/api/hospital/inventory'
  );

  return response.data;
}

export async function updateHospitalInventory(data: {
  bloodGroup: string;
  availableUnits: number;
}): Promise<unknown> {
  const payload = {
    bloodGroup:
      toInternalBloodGroup(data.bloodGroup) ||
      data.bloodGroup,
    availableUnits: data.availableUnits,
  };

  const response = await apiClient.put(
    '/api/hospital/inventory',
    payload
  );

  return response.data;
}

export async function getHospitalReservations(): Promise<
  HospitalReservation[]
> {
  const response = await apiClient.get<HospitalReservation[]>(
    '/api/hospital/reservations'
  );

  return response.data;
}

export async function reserveBlood(
  requestId: string | number,
  units: number
): Promise<unknown> {
  const response = await apiClient.post(
    `/api/hospital/blood-requests/${requestId}/reserve`,
    {
      units,
    }
  );

  return response.data;
}

export async function releaseReservation(
  reservationId: string | number
): Promise<unknown> {
  const response = await apiClient.patch(
    `/api/hospital/reservations/${reservationId}/release`
  );

  return response.data;
}

export async function fulfillReservation(
  reservationId: string | number
): Promise<unknown> {
  const response = await apiClient.patch(
    `/api/hospital/reservations/${reservationId}/fulfill`
  );

  return response.data;
}