import {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/lib/types/warehouseType";
import { get, post, put, apiDelete } from "../apiClient";

export async function getWarehouses(): Promise<{ data: Warehouse[] }> {
  return get<{ data: Warehouse[] }>("/warehouse");
}

export async function getWarehouseById(
  id: string
): Promise<{ data: Warehouse }> {
  return get<{ data: Warehouse }>(`/warehouse/${id}`);
}

export async function createWarehouse(
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  return post<{ data: Warehouse }>("/warehouse", data);
}

export async function updateWarehouse(
  id: string,
  data: Omit<UpdateWarehouseRequest, 'id'>
): Promise<{ data: Warehouse }> {
  return put<{ data: Warehouse }>(`/warehouse/${id}`, data);
}

export async function deleteWarehouse(id: string): Promise<void> {
  await apiDelete<void>(`/warehouse/${id}`);
}

