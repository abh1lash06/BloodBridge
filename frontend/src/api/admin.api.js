import apiClient from './client';
export async function verifyDonor(donorProfileId) {
    const response = await apiClient.patch(`/api/admin/donors/${donorProfileId}/verify`);
    return response.data;
}
export async function verifyHospital(hospitalProfileId) {
    const response = await apiClient.patch(`/api/admin/hospitals/${hospitalProfileId}/verify`);
    return response.data;
}
export async function unverifyHospital(hospitalProfileId) {
    const response = await apiClient.patch(`/api/admin/hospitals/${hospitalProfileId}/unverify`);
    return response.data;
}
