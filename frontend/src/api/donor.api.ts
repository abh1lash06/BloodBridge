import apiClient from './client';
import { getAllPages } from './pagination';

export interface DonorProfile {
  id?: number | string;
  donorProfileId?: number | string;
  userId?: number | string;

  fullName?: string;
  email?: string;
  phone?: string;

  bloodGroup?: string;
  gender?: string;
  address?: string;

  available?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface DonorMatch {
  matchId: number | string;
  bloodRequestId: number | string;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalAddress?: string;

  urgency: string;
  requestStatus: string;
  requiredDate: string;

  additionalNotes?: string;

  matchStatus:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'CANCELLED';

  matchedAt?: string;
  respondedAt?: string;
}

interface DonorMatchesResponse {
  content?: DonorMatch[];
  data?: DonorMatch[];
  matches?: DonorMatch[];
  items?: DonorMatch[];
}

function normalizeDonorMatches(
  data:
    | DonorMatchesResponse
    | DonorMatch[]
    | null
    | undefined
): DonorMatch[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data) {
    return [];
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

/* =========================================================
   DONOR PROFILE
   ========================================================= */

export async function getDonorProfile(): Promise<DonorProfile> {
  const response =
    await apiClient.get<DonorProfile>(
      '/api/donors/profile'
    );

  return response.data;
}

export async function saveDonorProfile(
  data: Record<string, unknown>
): Promise<DonorProfile> {
  const response =
    await apiClient.put<DonorProfile>(
      '/api/donors/profile',
      data
    );

  return response.data;
}

export async function createDonorProfile(
  data: Record<string, unknown>
): Promise<DonorProfile> {
  const response =
    await apiClient.post<DonorProfile>(
      '/api/donors/profile',
      data
    );

  return response.data;
}

export async function updateDonorProfile(
  data: Record<string, unknown>
): Promise<DonorProfile> {
  const response =
    await apiClient.put<DonorProfile>(
      '/api/donors/profile',
      data
    );

  return response.data;
}

export async function updateDonorAvailability(
  available: boolean
): Promise<unknown> {
  const response =
    await apiClient.patch(
      '/api/donors/profile/availability',
      { available }
    );

  return response.data;
}

/* =========================================================
   DONOR MATCHES
   ========================================================= */

export async function getDonorMatches(): Promise<DonorMatch[]> {
  return getAllPages<DonorMatch>('/api/donor/matches');
}

export async function acceptDonorMatch(
  matchId: string | number
): Promise<unknown> {
  const response =
    await apiClient.patch(
      `/api/donor/matches/${matchId}/accept`
    );

  return response.data;
}

export async function rejectDonorMatch(
  matchId: string | number
): Promise<unknown> {
  const response =
    await apiClient.patch(
      `/api/donor/matches/${matchId}/reject`
    );

  return response.data;
}