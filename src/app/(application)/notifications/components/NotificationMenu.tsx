"use client";

import { Menu, Badge, ActionIcon, ScrollArea, Text, Button, Group, Loader } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useNotificationStore } from "@/lib/store/notificationStore";
import {
  useNotifications,
  useUnreadCount,
  useMarkAllAsRead,
  useClearAllNotifications,
} from "@/lib/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

export function NotificationMenu() {
  const { unreadCount } = useNotificationStore();
  const { data: notificationsData, isLoading } = useNotifications(0, 20, false);
  const { } = useUnreadCount(); // Polling hook - no need to use data directly
  const markAllAsRead = useMarkAllAsRead();
  const clearAll = useClearAllNotifications();

  const notifications = notificationsData?.data?.data || [];
  const hasNotifications = notifications.length > 0;

  return (
    <Menu shadow="md" width={400} position="bottom-end" offset={10}>
      <Menu.Target>
        <ActionIcon variant="subtle" size="lg" aria-label="Notificaciones">
          <div style={{ position: "relative" }}>
            <IconBell size={24} />
            {unreadCount > 0 && (
              <Badge
                color="red"
                size="xs"
                circle
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {/* Header */}
        <Group justify="space-between" mb="sm" px="sm" pt="sm">
          <Text fw={700} size="lg">
            Notificaciones
          </Text>
          {unreadCount > 0 && (
            <Badge color="blue" variant="filled" size="sm">
              {unreadCount} {unreadCount === 1 ? "nueva" : "nuevas"}
            </Badge>
          )}
        </Group>

        {/* Action buttons */}
        {hasNotifications && (
          <Group gap="xs" mb="sm" px="sm">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => markAllAsRead.mutate()}
              disabled={unreadCount === 0 || markAllAsRead.isPending}
            >
              Marcar todas como leídas
            </Button>
            <Button
              variant="subtle"
              size="xs"
              color="red"
              onClick={() => clearAll.mutate()}
              disabled={clearAll.isPending}
            >
              Eliminar todas
            </Button>
          </Group>
        )}

        <Menu.Divider />

        {/* Notifications list */}
        <ScrollArea h={400} type="auto">
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
              <Loader size="sm" />
            </div>
          ) : !hasNotifications ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <Text c="dimmed" size="sm">
                No hay notificaciones
              </Text>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.5rem" }}>
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {hasNotifications && (
          <>
            <Menu.Divider />
            <div style={{ padding: "0.5rem", textAlign: "center" }}>
              <Button
                variant="subtle"
                size="sm"
                fullWidth
                onClick={() => {
                  // Navigate to notifications page (future enhancement)
                  console.log("Ver todas las notificaciones");
                }}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
