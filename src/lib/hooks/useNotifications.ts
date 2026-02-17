import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications as mantineNotifications } from "@mantine/notifications";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/lib/api/notification/notificationApi";
import { useNotificationStore } from "@/lib/store/notificationStore";

/**
 * Hook to fetch paginated notifications with polling
 */
export const useNotifications = (
  page: number = 0,
  size: number = 20,
  unreadOnly: boolean = false
) => {
  return useQuery({
    queryKey: ["notifications", page, size, unreadOnly],
    queryFn: () => getNotifications(page, size, unreadOnly),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

/**
 * Hook to get unread count with frequent polling (similar to useOrderStatus)
 */
export const useUnreadCount = () => {
  const { setUnreadCount } = useNotificationStore();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const result = await getUnreadCount();
      // Sync with Zustand store
      setUnreadCount(result.data.count);
      return result;
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 10 * 1000, // Poll every 10 seconds (critical)
  });
};

/**
 * Mutation to mark a notification as read with optimistic updates
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: ["notifications"] });

      // Optimistically update all notification queries
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((n: any) =>
                n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
              ),
            },
          };
        }
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      mantineNotifications.show({
        title: "Error",
        message: "No se pudo marcar la notificación como leída",
        color: "red",
      });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};

/**
 * Mutation to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      mantineNotifications.show({
        title: "Éxito",
        message: "Todas las notificaciones marcadas como leídas",
        color: "green",
      });
    },
    onError: () => {
      mantineNotifications.show({
        title: "Error",
        message: "No se pudieron marcar las notificaciones como leídas",
        color: "red",
      });
    },
  });
};

/**
 * Mutation to delete a notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      mantineNotifications.show({
        title: "Éxito",
        message: "Notificación eliminada",
        color: "green",
      });
    },
    onError: () => {
      mantineNotifications.show({
        title: "Error",
        message: "No se pudo eliminar la notificación",
        color: "red",
      });
    },
  });
};

/**
 * Mutation to clear all notifications
 */
export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      mantineNotifications.show({
        title: "Éxito",
        message: "Todas las notificaciones eliminadas",
        color: "green",
      });
    },
    onError: () => {
      mantineNotifications.show({
        title: "Error",
        message: "No se pudieron eliminar las notificaciones",
        color: "red",
      });
    },
  });
};
