import apiClient from './client';

// The current Spring Boot backend exposes ID-based verification actions only.
// It has no pending-list or hospital-account creation endpoint.
export async function verifyDonor(donorProfileId, reason = null) {
    await apiClient.patch(`/api/admin/donors/${donorProfileId}/verify`, { reason });
}

export async function rejectDonor(donorProfileId, reason = null) {
    await apiClient.patch(`/api/admin/donors/${donorProfileId}/reject`, { reason });
}

export async function verifyHospital(hospitalProfileId) {
    const response = await apiClient.patch(`/api/admin/hospitals/${hospitalProfileId}/verify`);
    return response.data;
}

export async function unverifyHospital(hospitalProfileId) {
    const response = await apiClient.patch(`/api/admin/hospitals/${hospitalProfileId}/unverify`);
    return response.data;
}
