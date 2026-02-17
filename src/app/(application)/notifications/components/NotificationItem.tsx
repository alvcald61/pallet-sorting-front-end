"use client";

import { ActionIcon, Badge, Group, Paper, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Notification, NotificationType } from "@/lib/types/notificationTypes";
import { useMarkAsRead, useDeleteNotification } from "@/lib/hooks/useNotifications";

interface NotificationItemProps {
  notification: Notification;
}

const TYPE_COLORS: Record<NotificationType, string> = {
  [NotificationType.ORDER_CREATED]: "blue",
  [NotificationType.ORDER_STATUS_CHANGED]: "gray",
  [NotificationType.ORDER_APPROVED]: "green",
  [NotificationType.ORDER_DENIED]: "red",
  [NotificationType.ORDER_DOCUMENT_PENDING]: "orange",
  [NotificationType.TRANSPORT_STARTED]: "cyan",
  [NotificationType.TRANSPORT_DELIVERED]: "teal",
  [NotificationType.SYSTEM_ALERT]: "yellow",
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const markAsRead = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleClick = () => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }

    // Navigate to related entity
    if (notification.relatedEntityType === "ORDER" && notification.relatedEntityId) {
      router.push(`/order/${notification.relatedEntityId}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notification.id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Paper
      p="sm"
      withBorder
      style={{
        cursor: "pointer",
        backgroundColor: notification.isRead ? "transparent" : "rgba(34, 139, 230, 0.05)",
        position: "relative",
      }}
      className="hover:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb="xs">
            {!notification.isRead && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--mantine-color-blue-6)",
                }}
              />
            )}
            <Text fw={notification.isRead ? 500 : 700} size="sm">
              {notification.title}
            </Text>
            <Badge color={TYPE_COLORS[notification.type]} size="xs" variant="light">
              {notification.type.replace(/_/g, " ")}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed" mb="xs">
            {notification.message}
          </Text>
          <Text size="xs" c="dimmed">
            {timeAgo}
          </Text>
        </div>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleDelete}
          aria-label="Eliminar notificación"
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
