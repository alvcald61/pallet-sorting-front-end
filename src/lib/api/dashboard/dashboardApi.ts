import { get } from "../apiClient";

/**
 * Dashboard API - Refactored to use apiClient
 */

export const getDashboardStats = async () => {
  return get<any>("/dashboard/stats");
};

export const getPendingOrders = async (limit: number = 10) => {
  return get<any>(`/dashboard/pending-orders?limit=${limit}`);
};

export const getOrdersByClient = async () => {
  return get<any>("/dashboard/orders-by-client");
};

export const getOrdersByDriver = async () => {
  return get<any>("/dashboard/orders-by-driver");
};

export const getOrdersByTruck = async () => {
  return get<any>("/dashboard/orders-by-truck");
};

export const getOrdersByStatus = async () => {
  return get<any>("/dashboard/orders-by-status");
};

export const getPerformanceMetrics = async () => {
  return get<any>("/dashboard/performance-metrics");
};
