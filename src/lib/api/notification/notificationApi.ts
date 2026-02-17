import { get, patch, apiDelete } from "../apiClient";
import type {
  NotificationResponse,
  UnreadCountResponse,
  Notification,
} from "@/lib/types/notificationTypes";

const BASE_URL = "/notification";

export const getNotifications = async (
  page: number = 0,
  size: number = 20,
  unreadOnly: boolean = false
): Promise<NotificationResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    unreadOnly: unreadOnly.toString(),
  });
  return get(`${BASE_URL}?${params}`);
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  return get(`${BASE_URL}/count/unread`);
};

export const markAsRead = async (id: number): Promise<{ data: Notification }> => {
  return patch(`${BASE_URL}/${id}/read`);
};

export const markAllAsRead = async (): Promise<{ data: null }> => {
  return patch(`${BASE_URL}/read-all`);
};

export const deleteNotification = async (id: number): Promise<{ data: null }> => {
  return apiDelete(`${BASE_URL}/${id}`);
};

export const clearAllNotifications = async (): Promise<{ data: null }> => {
  return apiDelete(`${BASE_URL}/clear-all`);
};
