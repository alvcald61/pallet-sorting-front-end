import {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/lib/types/warehouseType";
import { get, post, put, apiDelete } from "../apiClient";

export async function getWarehouses(): Promise<{ data: Warehouse[] }> {
  return get<{ data: Warehouse[] }>("/api/warehouse");
}

export async function getWarehouseById(
  id: string
): Promise<{ data: Warehouse }> {
  return get<{ data: Warehouse }>(`/api/warehouse/${id}`);
}

export async function createWarehouse(
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  return post<{ data: Warehouse }>("/api/warehouse", data);
}

export async function updateWarehouse(
  id: string,
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  return put<{ data: Warehouse }>(`/api/warehouse/${id}`, data);
}

export async function deleteWarehouse(id: string): Promise<void> {
  await apiDelete<void>(`/api/warehouse/${id}`);
}

