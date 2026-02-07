import { get, loadImageAsBytes, patch, post, put } from "../apiClient";
import { Order } from "@/lib/types/orderTypes";
import { OrderFilters } from "@/lib/types/orderFilterTypes";
import { Wrapper } from "@/lib/utils";
import { OrderStatus } from "@/lib/utils/enums";

interface PageInfo {
  totalElements: number;
  totalPages: number;
}

interface PaginatedOrders {
  data: Order[];
  pageInfo: PageInfo;
}

interface OrdersByPageParams {
  page: number;
  pageSize: number;
  isAdmin: boolean;
  filters?: OrderFilters;
}

interface CreateOrderParams {
  orderData: Record<string, unknown>;
  type: string;
}

interface ContinueOrderParams {
  orderId: string;
  amount?: number | string;
  gpsLink?: number | string;
  deny: boolean;
}

/**
 * Order API - Refactored to use apiClient
 */

export const createOrder = async ({ orderData, type }: CreateOrderParams) => {
  return post<Wrapper<Order>>(`/order/solve/${type}`, orderData);
};

export const getOrders = async () => {
  return get<{ data: Order[] }>("/order");
};

export const getAvailableSlots = async (date: string) => {
  return get<string[]>(`/order/available-slots?date=${date}`);
};

export const getOrdersByPage = async ({
  page,
  pageSize,
  isAdmin,
  filters,
}: OrdersByPageParams) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(pageSize));
  params.append("isAdmin", String(isAdmin));

  if (filters?.search) params.append("search", filters.search);
  if (filters?.statuses && filters.statuses.length > 0) {
    filters.statuses.forEach((s) => params.append("status", s));
  }
  if (filters?.orderType) params.append("orderType", filters.orderType);
  if (filters?.pickupDateFrom) params.append("pickupDateFrom", filters.pickupDateFrom);
  if (filters?.pickupDateTo) params.append("pickupDateTo", filters.pickupDateTo);

  return get<PaginatedOrders>(`/order?${params.toString()}`);
};

export const getOrderById = async (id: string) => {
  return get<Wrapper<Order>>(`/order/${id}`);
};

export const getOrderStatus = async (id: string) => {
  return get<Wrapper<{ orderStatus: OrderStatus }>>(`/order/${id}/status`);
};

export const updateOrderStatus = async (id: string, status: string) => {
  return patch<Wrapper<Order>>(`/order/${id}/status/${status}`);
};

export const getDistributionImg = async (id: string) => {
  try {
    const response = await loadImageAsBytes(`/order/${id}/image`);
    return response;
  } catch (error) {
    console.error("Error fetching distribution image:", error);
    return null;
  }
};

export const continueOrder = async ({
  orderId,
  amount,
  gpsLink,
  deny,
}: ContinueOrderParams) => {
  const params = new URLSearchParams();
  if (amount !== undefined) params.append("amount", String(amount));
  if (gpsLink !== undefined) params.append("gpsLink", String(gpsLink));
  params.append("denied", String(deny));
  return put<Wrapper<Order>>(`/order/${orderId}/continue?${params.toString()}`);
};
