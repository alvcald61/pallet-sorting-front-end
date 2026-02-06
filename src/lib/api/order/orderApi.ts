import { get, loadImageAsBytes, patch, post, put } from "../apiClient";
import { Order } from "@/lib/types/orderTypes";
import { Wrapper } from "@/lib/utils";

interface OrdersByPageParams {
  page: number;
  pageSize: number;
  isAdmin: boolean;
}

interface CreateOrderParams {
  orderData: any;
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
  return post<any>(`/order/solve/${type}`, orderData);
};

export const getOrders = async () => {
  return get<any[]>("/order");
};

export const getAvailableSlots = async (date: string) => {
  return get<string[]>(`/order/available-slots?date=${date}`);
};

export const getOrdersByPage = async ({
  page,
  pageSize,
  isAdmin,
}: OrdersByPageParams) => {
  return get<any>(`/order?page=${page}&size=${pageSize}&isAdmin=${isAdmin}`);
};

export const getOrderById = async (id: string) => {
  return get<Wrapper<Order>>(`/order/${id}`);
};

export const getOrderStatus = async (id: string) => {
  return get<any>(`/order/${id}/status`);
};

export const updateOrderStatus = async (id: string, status: string) => {
  return patch<any>(`/order/${id}/status/${status}`);
};

export const getDistributionImg = async (id: string) => {
  try {
    // For image/text response, use fetch directly
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
  console.log(orderId);
  return put<any>(`/order/${orderId}/continue?${params.toString()}`);
};

