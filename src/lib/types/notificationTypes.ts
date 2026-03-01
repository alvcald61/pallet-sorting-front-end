export enum NotificationType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_STATUS_CHANGED = "ORDER_STATUS_CHANGED",
  ORDER_APPROVED = "ORDER_APPROVED",
  ORDER_DENIED = "ORDER_DENIED",
  ORDER_DOCUMENT_PENDING = "ORDER_DOCUMENT_PENDING",
  TRANSPORT_STARTED = "TRANSPORT_STARTED",
  TRANSPORT_DELIVERED = "TRANSPORT_DELIVERED",
  SYSTEM_ALERT = "SYSTEM_ALERT",
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  readAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationPage {
  data: Notification[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface UnreadCount {
  count: number;
}

export interface NotificationResponse {
  data: NotificationPage;
  message: string;
  success: boolean;
}

export interface UnreadCountResponse {
  data: UnreadCount;
  message: string;
  success: boolean;
}
