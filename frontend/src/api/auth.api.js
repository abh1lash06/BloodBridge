import apiClient from './client';
export async function login(data) {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
}
export async function register(data) {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
}
