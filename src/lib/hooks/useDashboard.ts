import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getPendingOrders,
  getOrdersByClient,
  getOrdersByDriver,
  getOrdersByTruck,
  getOrdersByStatus,
  getPerformanceMetrics,
} from "@/lib/api/dashboard/dashboardApi";

/**
 * React Query hooks for Dashboard operations
 */

// Dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};

// Pending orders
export const usePendingOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: ["pending-orders", limit],
    queryFn: () => getPendingOrders(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Orders by client
export const useOrdersByClient = () => {
  return useQuery({
    queryKey: ["orders-by-client"],
    queryFn: getOrdersByClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Orders by driver
export const useOrdersByDriver = () => {
  return useQuery({
    queryKey: ["orders-by-driver"],
    queryFn: getOrdersByDriver,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Orders by truck
export const useOrdersByTruck = () => {
  return useQuery({
    queryKey: ["orders-by-truck"],
    queryFn: getOrdersByTruck,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Orders by status
export const useOrdersByStatus = () => {
  return useQuery({
    queryKey: ["orders-by-status"],
    queryFn: getOrdersByStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Performance metrics
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ["performance-metrics"],
    queryFn: getPerformanceMetrics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
