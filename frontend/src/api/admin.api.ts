import apiClient from './client';

export async function verifyDonor(
  donorProfileId: string | number
): Promise<unknown> {
  const response = await apiClient.patch(
    `/api/admin/donors/${donorProfileId}/verify`
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