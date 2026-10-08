import apiClient from './client';
import { toInternalBloodGroup } from '@/lib/utils';
function normalizeBloodRequests(data) {
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
function extractMatches(data) {
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
function normalizeMatches(data, requestId) {
    const matches = extractMatches(data);
    return matches.map((match) => ({
        id: match.id ??
            match.donorProfileId ??
            match.userId ??
            `${requestId}-${match.donorProfileId ?? match.userId}`,
        donorId: match.donorProfileId ??
            match.donorId ??
            match.userId,
        donorName: match.fullName ??
            match.donorName ??
            'Unknown Donor',
        donorEmail: match.donorEmail,
        donorPhone: match.donorPhone,
        bloodGroup: match.bloodGroup ?? '',
        verificationStatus: match.verificationStatus ?? 'PENDING',
        isAvailable: match.available ?? false,
        status: match.status ?? 'PENDING',
        matchedAt: match.matchedAt,
        requestId: match.requestId ?? requestId,
    }));
}
export async function getPatientBloodRequests() {
    const response = await apiClient.get('/api/blood-requests/my');
    return normalizeBloodRequests(response.data);
}
export async function getBloodRequestById(requestId) {
    const response = await apiClient.get(`/api/blood-requests/${requestId}`);
    return response.data;
}
export async function createBloodRequest(data) {
    const payload = {
        ...data,
        bloodGroup: toInternalBloodGroup(data.bloodGroup) ||
            data.bloodGroup,
    };
    const response = await apiClient.post('/api/blood-requests', payload);
    return response.data;
}
export async function getMatchingDonors(requestId) {
    const response = await apiClient.get(`/api/blood-requests/${requestId}/matches`);
    return normalizeMatches(response.data, requestId);
}
export async function getPersistedMatches(requestId) {
    const response = await apiClient.get(`/api/blood-requests/${requestId}/matches/persisted`);
    return normalizeMatches(response.data, requestId);
}
export async function cancelBloodRequest(requestId) {
    const response = await apiClient.patch(`/api/blood-requests/${requestId}/cancel`);
    return response.data;
}
export async function fulfillBloodRequest(requestId) {
    const response = await apiClient.patch(`/api/blood-requests/${requestId}/fulfill`);
    return response.data;
}
