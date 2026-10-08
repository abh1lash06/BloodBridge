import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, } from '@/api/notification.api';
import { useAuth } from './useAuth';
export function useNotifications() {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const notificationsQuery = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled: isAuthenticated,
        refetchInterval: 15000, // Poll every 15s for updates
    });
    const unreadCountQuery = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: getUnreadNotificationCount,
        enabled: isAuthenticated,
        refetchInterval: 15000,
    });
    const markReadMutation = useMutation({
        mutationFn: (id) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
    const markAllReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
    return {
        notifications: notificationsQuery.data || [],
        isLoading: notificationsQuery.isLoading,
        isError: notificationsQuery.isError,
        unreadCount: unreadCountQuery.data ?? 0,
        refetch: notificationsQuery.refetch,
        markAsRead: markReadMutation.mutate,
        markAllAsRead: markAllReadMutation.mutate,
        isMarkingAllRead: markAllReadMutation.isPending,
    };
}
