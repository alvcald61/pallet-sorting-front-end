import {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/lib/types/warehouseType";
import { apiClient } from "../apiClient";

export async function getWarehouses(): Promise<{ data: Warehouse[] }> {
  return apiClient.get<{ data: Warehouse[] }>("/api/warehouse");
}

export async function getWarehouseById(
  id: string
): Promise<{ data: Warehouse }> {
  return apiClient.get<{ data: Warehouse }>(`/api/warehouse/${id}`);
}

export async function createWarehouse(
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  return apiClient.post<{ data: Warehouse }>("/api/warehouse", data);
}

export async function updateWarehouse(
  id: string,
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  return apiClient.put<{ data: Warehouse }>(`/api/warehouse/${id}`, data);
}

export async function deleteWarehouse(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/warehouse/${id}`);
}

