import { get } from "../apiClient";
import {
  DashboardStats,
  PendingOrder,
  OrdersByGroupItem,
  OrdersByStatusItem,
  PerformanceMetrics,
} from "@/lib/types/dashboardTypes";

/**
 * Dashboard API - Refactored to use apiClient
 */

export const getDashboardStats = async () => {
  return get<DashboardStats>("/dashboard/stats");
};

export const getPendingOrders = async (limit: number = 10) => {
  return get<PendingOrder[]>(`/dashboard/pending-orders?limit=${limit}`);
};

export const getOrdersByClient = async () => {
  return get<OrdersByGroupItem[]>("/dashboard/orders-by-client");
};

export const getOrdersByDriver = async () => {
  return get<OrdersByGroupItem[]>("/dashboard/orders-by-driver");
};

export const getOrdersByTruck = async () => {
  return get<OrdersByGroupItem[]>("/dashboard/orders-by-truck");
};

export const getOrdersByStatus = async () => {
  return get<OrdersByStatusItem[]>("/dashboard/orders-by-status");
};

export const getPerformanceMetrics = async () => {
  return get<PerformanceMetrics>("/dashboard/performance-metrics");
};
