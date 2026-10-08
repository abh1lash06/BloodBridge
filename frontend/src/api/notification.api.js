import apiClient from './client';
function normalizeNotifications(responseData) {
    let items = [];
    if (Array.isArray(responseData)) {
        items = responseData;
    }
    else if (Array.isArray(responseData.notifications)) {
        items = responseData.notifications;
    }
    else if (Array.isArray(responseData.content)) {
        items = responseData.content;
    }
    else if (Array.isArray(responseData.data)) {
        items = responseData.data;
    }
    else if (Array.isArray(responseData.items)) {
        items = responseData.items;
    }
    return items
        .filter((item) => item && item.id !== undefined && item.id !== null)
        .map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message || '',
        type: item.type,
        read: typeof item.read === 'boolean'
            ? item.read
            : typeof item.isRead === 'boolean'
                ? item.isRead
                : false,
        createdAt: item.createdAt ||
            item.timestamp ||
            new Date().toISOString(),
        referenceId: item.referenceId !== undefined
            ? item.referenceId
            : null,
        referenceType: item.referenceType !== undefined
            ? item.referenceType
            : null,
    }));
}
export async function getNotifications() {
    const response = await apiClient.get('/api/notifications');
    return normalizeNotifications(response.data);
}
export async function getUnreadNotificationCount() {
    const response = await apiClient.get('/api/notifications/unread-count');
    if (typeof response.data === 'number') {
        return response.data;
    }
    if (response.data &&
        typeof response.data.count === 'number') {
        return response.data.count;
    }
    if (response.data &&
        typeof response.data.unreadCount === 'number') {
        return response.data.unreadCount;
    }
    if (response.data &&
        typeof response.data.data === 'number') {
        return response.data.data;
    }
    return 0;
}
export async function markNotificationAsRead(notificationId) {
    await apiClient.patch(`/api/notifications/${notificationId}/read`);
}
export async function markAllNotificationsAsRead() {
    await apiClient.patch('/api/notifications/read-all');
}
