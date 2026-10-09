
import apiClient from './client';

export async function verifyDonor(donorProfileId) {
  const response = await apiClient.patch(
    `/api/admin/donors/${donorProfileId}/verify`,
    { reason: null }
  );
  return response.data;
}

export async function rejectDonor(donorProfileId, reason) {
  const response = await apiClient.patch(
    `/api/admin/donors/${donorProfileId}/reject`,
    { reason: reason || null }
  );
  return response.data;
}

export async function getPendingDonors() {
  const response = await apiClient.get(
    '/api/admin/donors/pending'
  );
  return response.data.content || [];
}

export async function verifyHospital(hospitalProfileId) {
  const response = await apiClient.patch(
    `/api/admin/hospitals/${hospitalProfileId}/verify`
  );
  return response.data;
}

export async function unverifyHospital(hospitalProfileId) {
  const response = await apiClient.patch(
    `/api/admin/hospitals/${hospitalProfileId}/unverify`
  );
  return response.data;
}

export async function getPendingHospitals() {
  const response = await apiClient.get(
    '/api/admin/hospitals/pending'
  );
  return response.data.content || [];
}

export async function createHospitalAccount(data) {
  const response = await apiClient.post(
    '/api/admin/hospitals/accounts',
    data
  );
  return response.data;
}
