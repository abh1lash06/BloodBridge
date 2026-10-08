import apiClient from './client';
import {
  BloodRequest,
  CreateBloodRequestInput,
  DonorMatch,
} from '@/types/patient';
import { toInternalBloodGroup } from '@/lib/utils';

type BloodRequestResponse =
  | BloodRequest[]
  | {
      content?: BloodRequest[];
      requests?: BloodRequest[];
      data?: BloodRequest[];
      items?: BloodRequest[];
    };

type BackendDonorMatch = {
  donorProfileId?: number | string;
  userId?: number | string;
  fullName?: string;
  bloodGroup?: string;
  gender?: string;
  address?: string;
  available?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  id?: number | string;
  donorId?: number | string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  matchedAt?: string;
  requestId?: number | string;
};

type BackendMatchesResponse =
  | BackendDonorMatch[]
  | {
      content?: BackendDonorMatch[];
      matches?: BackendDonorMatch[];
      data?: BackendDonorMatch[];
      items?: BackendDonorMatch[];
    };

function normalizeBloodRequests(
  data: BloodRequestResponse
): BloodRequest[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.requests)) {
    return data.requests;
  }

  if (Array.isArray(data.content)) {
    return data.content;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  return [];
}

function extractMatches(
  data: BackendMatchesResponse
): BackendDonorMatch[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.content)) {
    return data.content;
  }

  if (Array.isArray(data.matches)) {
    return data.matches;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  return [];
}

function normalizeMatches(
  data: BackendMatchesResponse,
  requestId: string | number
): DonorMatch[] {
  const matches = extractMatches(data);

  return matches.map((match) => ({
    id:
      match.id ??
      match.donorProfileId ??
      match.userId ??
      `${requestId}-${match.donorProfileId ?? match.userId}`,

    donorId:
      match.donorProfileId ??
      match.donorId ??
      match.userId,

    donorName:
      match.fullName ??
      match.donorName ??
      'Unknown Donor',

    donorEmail:
      match.donorEmail,

    donorPhone:
      match.donorPhone,

    bloodGroup:
      match.bloodGroup ?? '',

    verificationStatus:
      match.verificationStatus ?? 'PENDING',

    isAvailable:
      match.available ?? false,

    status:
      match.status ?? 'PENDING',

    matchedAt:
      match.matchedAt,

    requestId:
      match.requestId ?? requestId,
  }));
}

export async function getPatientBloodRequests(): Promise<BloodRequest[]> {
  const response =
    await apiClient.get<BloodRequestResponse>(
      '/api/blood-requests/my'
    );

  return normalizeBloodRequests(response.data);
}

export async function getBloodRequestById(
  requestId: string | number
): Promise<BloodRequest> {
  const response =
    await apiClient.get<BloodRequest>(
      `/api/blood-requests/${requestId}`
    );

  return response.data;
}

export async function createBloodRequest(
  data: CreateBloodRequestInput
): Promise<BloodRequest> {
  const payload = {
    ...data,
    bloodGroup:
      toInternalBloodGroup(data.bloodGroup) ||
      data.bloodGroup,
  };

  const response =
    await apiClient.post<BloodRequest>(
      '/api/blood-requests',
      payload
    );

  return response.data;
}

export async function getMatchingDonors(
  requestId: string | number
): Promise<DonorMatch[]> {
  const response =
    await apiClient.get<BackendMatchesResponse>(
      `/api/blood-requests/${requestId}/matches`
    );

  return normalizeMatches(
    response.data,
    requestId
  );
}

export async function getPersistedMatches(
  requestId: string | number
): Promise<DonorMatch[]> {
  const response =
    await apiClient.get<BackendMatchesResponse>(
      `/api/blood-requests/${requestId}/matches/persisted`
    );

  return normalizeMatches(
    response.data,
    requestId
  );
}

export async function cancelBloodRequest(
  requestId: string | number
): Promise<unknown> {
  const response =
    await apiClient.patch(
      `/api/blood-requests/${requestId}/cancel`
    );

  return response.data;
}

export async function fulfillBloodRequest(
  requestId: string | number
): Promise<unknown> {
  const response =
    await apiClient.patch(
      `/api/blood-requests/${requestId}/fulfill`
    );

  return response.data;
}