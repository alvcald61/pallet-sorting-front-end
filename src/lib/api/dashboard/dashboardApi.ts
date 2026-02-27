import { get } from "../apiClient";
import {
  DashboardStats,
  PendingOrder,
  OrdersByGroupItem,
  OrdersByStatusItem,
  PerformanceMetrics,
} from "@/lib/types/dashboardTypes";

export interface DateRangeParams {
  startDate?: string; // ISO format: YYYY-MM-DD
  endDate?: string;   // ISO format: YYYY-MM-DD
}

function buildDateQuery(params?: DateRangeParams): string {
  if (!params?.startDate || !params?.endDate) return "";
  return `?startDate=${params.startDate}&endDate=${params.endDate}`;
}

export const getDashboardStats = async (params?: DateRangeParams) => {
  return get<DashboardStats>(`/dashboard/stats${buildDateQuery(params)}`);
};

export const getPendingOrders = async (limit: number = 10, params?: DateRangeParams) => {
  const dateQuery = params?.startDate && params?.endDate
    ? `&startDate=${params.startDate}&endDate=${params.endDate}`
    : "";
  return get<PendingOrder[]>(`/dashboard/pending-orders?limit=${limit}${dateQuery}`);
};

export const getOrdersByClient = async (params?: DateRangeParams) => {
  return get<OrdersByGroupItem[]>(`/dashboard/orders-by-client${buildDateQuery(params)}`);
};

export const getOrdersByDriver = async (params?: DateRangeParams) => {
  return get<OrdersByGroupItem[]>(`/dashboard/orders-by-driver${buildDateQuery(params)}`);
};

export const getOrdersByTruck = async (params?: DateRangeParams) => {
  return get<OrdersByGroupItem[]>(`/dashboard/orders-by-truck${buildDateQuery(params)}`);
};

export const getOrdersByStatus = async (params?: DateRangeParams) => {
  return get<OrdersByStatusItem[]>(`/dashboard/orders-by-status${buildDateQuery(params)}`);
};

export const getPerformanceMetrics = async (params?: DateRangeParams) => {
  return get<PerformanceMetrics>(`/dashboard/performance-metrics${buildDateQuery(params)}`);
};
