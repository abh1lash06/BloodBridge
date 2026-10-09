import apiClient from './client';
function normalizeDonorMatches(data) {
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
export async function getDonorProfile() {
    const response = await apiClient.get('/api/donors/profile');
    return response.data;
}
export async function saveDonorProfile(data) {
    const response = await apiClient.put('/api/donors/profile', data);
    return response.data;
}
export async function createDonorProfile(data) {
    const response = await apiClient.post('/api/donors/profile', data);
    return response.data;
}
export async function updateDonorProfile(data) {
    const response = await apiClient.put('/api/donors/profile', data);
    return response.data;
}
export async function updateDonorAvailability(available) {
    const response = await apiClient.patch('/api/donors/profile/availability', { available });
    return response.data;
}
/* =========================================================
   DONOR MATCHES
   ========================================================= */
export async function getDonorMatches() {
    const response = await apiClient.get('/api/donor/matches');
    return normalizeDonorMatches(response.data);
}
export async function acceptDonorMatch(matchId) {
    const response = await apiClient.patch(`/api/donor/matches/${matchId}/accept`);
    return response.data;
}
export async function rejectDonorMatch(matchId) {
    const response = await apiClient.patch(`/api/donor/matches/${matchId}/reject`);
    return response.data;
}
