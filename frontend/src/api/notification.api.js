import apiClient from './client';

function normalizeNotification(item) {
    return {
        ...item,
        read: item.readStatus === true,
        createdAt: item.createdAt ?? null,
        referenceId: item.referenceId ?? null,
    };
}

export async function getNotifications() {
    const items = [];
    for (let page = 0; page < 100; page++) {
        const response = await apiClient.get('/api/notifications', {
            params: { page, size: 50 },
        });
        const data = response.data;
        if (Array.isArray(data)) return data.map(normalizeNotification);
        const content = data?.content ?? [];
        items.push(...content.map(normalizeNotification));
        if (data?.last === true || content.length === 0 ||
            (typeof data?.totalPages === 'number' && page + 1 >= data.totalPages) ||
            (data?.last === undefined && data?.totalPages === undefined && content.length < 50)) break;
    }
    return items;
}

export async function getUnreadNotificationCount() {
    const response = await apiClient.get('/api/notifications/unread-count');
    return typeof response.data === 'number' ? response.data : 0;
}

export async function markNotificationAsRead(notificationId) {
    await apiClient.patch(`/api/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead() {
    await apiClient.patch('/api/notifications/read-all');
}
