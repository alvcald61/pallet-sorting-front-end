import { apiClient } from "../apiClient";
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

interface UploadDocumentParams {
  orderId: string;
  documentId: number;
  file: File;
}

/**
 * Order API - Refactored to use apiClient
 */

export const createOrder = async ({ orderData, type }: CreateOrderParams) => {
  return apiClient.post<any>(`/order/solve/${type}`, orderData);
};

export const getOrders = async () => {
  return apiClient.get<any[]>("/order");
};

export const getAvailableSlots = async (date: string) => {
  return apiClient.get<string[]>(`/order/available-slots?date=${date}`);
};

export const getOrdersByPage = async ({
  page,
  pageSize,
  isAdmin,
}: OrdersByPageParams) => {
  return apiClient.get<any>(
    `/order?page=${page}&size=${pageSize}&isAdmin=${isAdmin}`
  );
};

export const getOrderById = async (id: string) => {
  return apiClient.get<Wrapper<Order>>(`/order/${id}`);
};

export const getOrderStatus = async (id: string) => {
  return apiClient.get<any>(`/order/${id}/status`);
};

export const getDistributionImg = async (id: string) => {
  try {
    // For image/text response, use fetch directly
    const response = await apiClient.get<any>(`/order/${id}/image`);
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

  return apiClient.put<any>(`/order/${orderId}/continue?${params.toString()}`);
};

export const uploadOrderDocument = async ({
  orderId,
  documentId,
  file,
}: UploadDocumentParams) => {
  const formData = new FormData();
  formData.append("file", file);

  // apiClient doesn't handle FormData well, so we'll use fetch directly
  // but with proper error handling
  const token = localStorage.getItem("jwt");
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_HOST;

  const response = await fetch(
    `${baseURL}/api/order/${orderId}/documents/${documentId}/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
};
