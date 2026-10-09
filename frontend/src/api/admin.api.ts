import apiClient from './client';

export async function verifyDonor(
  donorProfileId: string | number
): Promise<unknown> {
  const response = await apiClient.patch(
    `/api/admin/donors/${donorProfileId}/verify`,
    { reason: null }
  );

  return response.data;
}

export async function verifyHospital(
  hospitalProfileId: string | number
): Promise<unknown> {
  const response = await apiClient.patch(
    `/api/admin/hospitals/${hospitalProfileId}/verify`
  );

  return response.data;
}

export async function unverifyHospital(
  hospitalProfileId: string | number
): Promise<unknown> {
  const response = await apiClient.patch(
    `/api/admin/hospitals/${hospitalProfileId}/unverify`
  );

  return response.data;
}
export async function getPendingDonors() {
  const response = await apiClient.get('/api/admin/donors/pending');
  return response.data.content || [];
}

export async function getPendingHospitals() {
  const response = await apiClient.get('/api/admin/hospitals/pending');
  return response.data.content || [];
}

export async function rejectDonor(donorProfileId: string | number, reason?: string) {
  await apiClient.patch(`/api/admin/donors/${donorProfileId}/reject`, { reason: reason || null });
}

export async function createHospitalAccount(data: { fullName: string; email: string; password: string; phone?: string }) {
  const response = await apiClient.post('/api/admin/hospitals/accounts', data);
  return response.data;
}
