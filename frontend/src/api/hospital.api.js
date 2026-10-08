import apiClient from './client';
import { toInternalBloodGroup } from '@/lib/utils';
export async function getHospitalProfile() {
    const response = await apiClient.get('/api/hospital/profile');
    return response.data;
}
export async function saveHospitalProfile(data) {
    const response = await apiClient.put('/api/hospital/profile', data);
    return response.data;
}
export async function getHospitalInventory() {
    const response = await apiClient.get('/api/hospital/inventory');
    return response.data;
}
export async function updateHospitalInventory(data) {
    const payload = {
        bloodGroup: toInternalBloodGroup(data.bloodGroup) ||
            data.bloodGroup,
        availableUnits: data.availableUnits,
    };
    const response = await apiClient.put('/api/hospital/inventory', payload);
    return response.data;
}
export async function getHospitalReservations() {
    const response = await apiClient.get('/api/hospital/reservations');
    return response.data;
}
export async function reserveBlood(requestId, units) {
    const response = await apiClient.post(`/api/hospital/blood-requests/${requestId}/reserve`, {
        units,
    });
    return response.data;
}
export async function releaseReservation(reservationId) {
    const response = await apiClient.patch(`/api/hospital/reservations/${reservationId}/release`);
    return response.data;
}
export async function fulfillReservation(reservationId) {
    const response = await apiClient.patch(`/api/hospital/reservations/${reservationId}/fulfill`);
    return response.data;
}
