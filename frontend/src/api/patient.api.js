import apiClient from './client';

async function getAllPages(url, params = {}) {
    const results = [];
    let page = 0;
    while (page < 100) {
        const response = await apiClient.get(url, { params: { ...params, page, size: 50 } });
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (!data || !Array.isArray(data.content)) return results;
        results.push(...data.content);
        if (data.last === true || data.content.length === 0 ||
            (typeof data.totalPages === 'number' && page + 1 >= data.totalPages) ||
            (data.last === undefined && data.totalPages === undefined && data.content.length < 50)) break;
        page++;
    }
    return results;
}

function normalizeMatches(items, requestId, persisted) {
    return items.map((item) => ({
        ...item,
        id: item.matchId ?? item.donorProfileId ?? item.userId,
        donorId: item.donorProfileId ?? item.donorUserId ?? item.userId,
        donorName: item.donorName ?? item.fullName ?? 'Unknown Donor',
        donorEmail: item.donorEmail ?? null,
        donorPhone: item.donorPhone ?? null,
        bloodGroup: item.bloodGroup ?? '',
        verificationStatus: item.verificationStatus ?? 'PENDING',
        isAvailable: item.donorAvailable ?? item.available ?? false,
        status: persisted ? (item.status ?? 'PENDING') : 'ELIGIBLE',
        matchedAt: item.matchedAt ?? null,
        requestId: item.bloodRequestId ?? requestId,
    }));
}

export async function getPatientBloodRequests() {
    return getAllPages('/api/blood-requests/my');
}

export async function getBloodRequestById(requestId) {
    const response = await apiClient.get(`/api/blood-requests/${requestId}`);
    return response.data;
}

export async function createBloodRequest(data) {
    const response = await apiClient.post('/api/blood-requests', {
        ...data,
        unitsRequired: Number(data.unitsRequired),
        bloodGroup: data.bloodGroup,
    });
    return response.data;
}

export async function getMatchingDonors(requestId) {
    return normalizeMatches(await getAllPages(`/api/blood-requests/${requestId}/matches`), requestId, false);
}

export async function getPersistedMatches(requestId) {
    return normalizeMatches(await getAllPages(`/api/blood-requests/${requestId}/matches/persisted`), requestId, true);
}

export async function cancelBloodRequest(requestId) {
    await apiClient.patch(`/api/blood-requests/${requestId}/cancel`);
}

export async function fulfillBloodRequest(requestId) {
    await apiClient.patch(`/api/blood-requests/${requestId}/fulfill`);
}
