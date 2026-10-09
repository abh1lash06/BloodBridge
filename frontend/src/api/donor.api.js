import apiClient from './client';

function isMissingDonorProfile(error) {
    return error?.response?.status === 400 &&
        /donor profile not found/i.test(error?.response?.data?.message ?? '');
}

export async function getDonorProfile() {
    try {
        const response = await apiClient.get('/api/donors/profile');
        return response.data;
    } catch (error) {
        if (isMissingDonorProfile(error)) {
            return {
                needsCreation: true,
                bloodGroup: null,
                dateOfBirth: null,
                gender: null,
                address: '',
                available: false,
                verificationStatus: 'PENDING',
            };
        }
        throw error;
    }
}

export async function createDonorProfile(data) {
    const response = await apiClient.post('/api/donors/profile', data);
    return response.data;
}

export async function updateDonorProfile(data) {
    const response = await apiClient.put('/api/donors/profile', data);
    return response.data;
}

export async function saveDonorProfile(data) {
    try {
        return await updateDonorProfile(data);
    } catch (error) {
        if (isMissingDonorProfile(error)) {
            return createDonorProfile(data);
        }
        throw error;
    }
}

export async function updateDonorAvailability(available) {
    const response = await apiClient.patch('/api/donors/profile/availability', {
        available: Boolean(available),
    });
    return response.data;
}

export async function searchVerifiedDonors(bloodGroup) {
    const response = await apiClient.get('/api/donors/search', {
        params: { bloodGroup, page: 0, size: 50 },
    });
    return response.data.content ?? [];
}

export async function getDonorMatches() {
    const matches = [];
    for (let page = 0; page < 100; page++) {
        const response = await apiClient.get('/api/donor/matches', {
            params: { page, size: 50 },
        });
        const data = response.data;
        if (Array.isArray(data)) return data;
        const records = data?.content ?? [];
        matches.push(...records.map((item) => ({
            ...item,
            id: item.matchId,
            status: item.matchStatus,
        })));
        if (data?.last === true || records.length === 0 ||
            (typeof data?.totalPages === 'number' && page + 1 >= data.totalPages) ||
            (data?.last === undefined && data?.totalPages === undefined && records.length < 50)) break;
    }
    return matches;
}

export async function acceptDonorMatch(matchId) {
    await apiClient.patch(`/api/donor/matches/${matchId}/accept`);
}

export async function rejectDonorMatch(matchId) {
    await apiClient.patch(`/api/donor/matches/${matchId}/reject`);
}
