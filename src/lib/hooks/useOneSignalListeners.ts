import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useNotificationStore } from "@/lib/store/notificationStore";
import OneSignal from "react-onesignal";

/**
 * Hook to set up OneSignal event listeners
 * Handles foreground notifications and click events
 */
export function useOneSignalListeners() {
  const queryClient = useQueryClient();
  const { incrementUnreadCount } = useNotificationStore();
  const listenersAdded = useRef(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Prevent duplicate listener registration
    if (listenersAdded.current) return;

    // Wait for OneSignal to be available
    const setupListeners = () => {
      try {
        // Check if OneSignal is ready
        if (!OneSignal?.Notifications) {
          console.log("⏳ Waiting for OneSignal to be ready...");
          setTimeout(setupListeners, 500);
          return;
        }

        console.log("🎧 Adding OneSignal event listeners...");

        // Listener: Notification received in foreground
        const handleForegroundNotification = (event: any) => {
          try {
            const notification = event.notification;
            console.log("📩 Foreground notification received:", notification);

            // Show Mantine toast
            notifications.show({
              title: notification.title || "Nueva Notificación",
              message: notification.body || "",
              color: "blue",
              autoClose: 5000,
            });

            // Invalidate queries to refresh notification list
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });

            // Increment unread count
            incrementUnreadCount();
          } catch (error) {
            console.error("Error handling foreground notification:", error);
          }
        };

        // Listener: Notification clicked
        const handleNotificationClick = (event: any) => {
          try {
            const notification = event.notification;
            const data = notification.additionalData;
            console.log("👆 Notification clicked:", data);

            // Navigate to related entity if data is provided
            if (data?.entityType === "ORDER" && data?.entityId) {
              window.location.href = `/order/${data.entityId}`;
            }
          } catch (error) {
            console.error("Error handling notification click:", error);
          }
        };

        // Add event listeners
        OneSignal.Notifications.addEventListener(
          "foregroundWillDisplay",
          handleForegroundNotification
        );
        OneSignal.Notifications.addEventListener(
          "click",
          handleNotificationClick
        );

        listenersAdded.current = true;
        console.log("✅ OneSignal listeners added successfully");

        // Cleanup function
        return () => {
          try {
            if (OneSignal?.Notifications) {
              OneSignal.Notifications.removeEventListener(
                "foregroundWillDisplay",
                handleForegroundNotification
              );
              OneSignal.Notifications.removeEventListener(
                "click",
                handleNotificationClick
              );
              console.log("🔇 OneSignal listeners removed");
            }
          } catch (error) {
            console.warn("Failed to remove OneSignal listeners:", error);
          }
        };
      } catch (error) {
        console.error("❌ Failed to add OneSignal listeners:", error);
      }
    };

    // Start setup with a small delay to ensure OneSignal is initialized
    const timeoutId = setTimeout(setupListeners, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [queryClient, incrementUnreadCount]);
}
