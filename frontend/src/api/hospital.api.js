import apiClient from './client';

export async function getHospitalProfile() {
    const response = await apiClient.get('/api/hospital/profile');
    return response.data;
}

export async function createHospitalProfile(data) {
    const response = await apiClient.post('/api/hospital/profile', data);
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

export async function getHospitalInventoryForGroup(bloodGroup) {
    const response = await apiClient.get(`/api/hospital/inventory/${encodeURIComponent(bloodGroup)}`);
    return response.data;
}

export async function updateHospitalInventory(data) {
    const response = await apiClient.put('/api/hospital/inventory', {
        bloodGroup: data.bloodGroup,
        availableUnits: Number(data.availableUnits),
    });
    return response.data;
}

export async function getHospitalReservations() {
    const response = await apiClient.get('/api/hospital/reservations');
    return response.data;
}

export async function reserveBlood(requestId, units) {
    const response = await apiClient.post(
        `/api/hospital/blood-requests/${requestId}/reserve`,
        { units: Number(units) },
    );
    return response.data;
}

export async function releaseReservation(reservationId) {
    await apiClient.patch(`/api/hospital/reservations/${reservationId}/release`);
}

export async function fulfillReservation(reservationId) {
    await apiClient.patch(`/api/hospital/reservations/${reservationId}/fulfill`);
}
