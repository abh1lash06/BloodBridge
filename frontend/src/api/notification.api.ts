import apiClient from './client';
import { getAllPages } from './pagination';
import { AppNotification } from '@/types/notification';

type NotificationApiItem = Partial<AppNotification> & {
  isRead?: boolean;
  read?: boolean;
  readStatus?: boolean;
  timestamp?: string;
  createdAt?: string;
};

type NotificationApiResponse =
  | NotificationApiItem[]
  | {
      content?: NotificationApiItem[];
      notifications?: NotificationApiItem[];
      data?: NotificationApiItem[];
      items?: NotificationApiItem[];
    };

function normalizeNotifications(
  responseData: NotificationApiResponse
): AppNotification[] {
  let items: NotificationApiItem[] = [];

  if (Array.isArray(responseData)) {
    items = responseData;
  } else if (Array.isArray(responseData.notifications)) {
    items = responseData.notifications;
  } else if (Array.isArray(responseData.content)) {
    items = responseData.content;
  } else if (Array.isArray(responseData.data)) {
    items = responseData.data;
  } else if (Array.isArray(responseData.items)) {
    items = responseData.items;
  }

  return items
    .filter((item) => item && item.id !== undefined && item.id !== null)
    .map((item) => ({
      id: item.id as number | string,
      title: item.title,
      message: item.message || '',
      type: item.type,
      read:
        typeof item.read === 'boolean'
          ? item.read
          : typeof item.isRead === 'boolean'
            ? item.isRead
            : item.readStatus ?? false,
      createdAt:
        item.createdAt ||
        item.timestamp ||
        new Date().toISOString(),
      referenceId:
        item.referenceId !== undefined
          ? item.referenceId
          : null,
      referenceType:
        item.referenceType !== undefined
          ? item.referenceType
          : null,
    }));
}

export async function getNotifications(): Promise<AppNotification[]> {
  const items = await getAllPages<NotificationApiItem>('/api/notifications');
  return normalizeNotifications(items);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await apiClient.get<
    number | {
      count?: number;
      unreadCount?: number;
      data?: number;
    }
  >('/api/notifications/unread-count');

  if (typeof response.data === 'number') {
    return response.data;
  }

  if (
    response.data &&
    typeof response.data.count === 'number'
  ) {
    return response.data.count;
  }

  if (
    response.data &&
    typeof response.data.unreadCount === 'number'
  ) {
    return response.data.unreadCount;
  }

  if (
    response.data &&
    typeof response.data.data === 'number'
  ) {
    return response.data.data;
  }

  return 0;
}

export async function markNotificationAsRead(
  notificationId: string | number
): Promise<void> {
  await apiClient.patch(
    `/api/notifications/${notificationId}/read`
  );
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch('/api/notifications/read-all');
}