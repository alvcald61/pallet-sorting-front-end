"use server";

import { get, post, patch } from "@/lib/api/apiClient";
import { Dispatcher } from "@/lib/types/orderTypes";

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const getDispatchersByClient = async (
  clientId: number
): Promise<ApiResponse<Dispatcher[]>> => {
  return get<ApiResponse<Dispatcher[]>>(`dispatcher?clientId=${clientId}`);
};

export const createDispatcher = async (data: {
  firstName: string;
  lastName: string;
  phone: string;
  clientId: number;
}): Promise<ApiResponse<Dispatcher>> => {
  return post<ApiResponse<Dispatcher>>("dispatcher", data);
};

export const assignDispatcherToOrder = async (
  orderId: string,
  dispatcherId: number
): Promise<ApiResponse<Dispatcher>> => {
  return patch<ApiResponse<Dispatcher>>(
    `order/${orderId}/dispatcher/${dispatcherId}`
  );
};
