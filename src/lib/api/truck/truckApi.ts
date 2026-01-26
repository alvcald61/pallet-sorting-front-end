import {
  CreateTruckRequest,
  Truck,
  UpdateTruckRequest,
} from "@/lib/types/truckType";
import { apiClient } from "../apiClient";

export async function getTrucks(): Promise<{ data: Truck[] }> {
  return apiClient.get<{ data: Truck[] }>("/api/truck");
}

export async function getTruckById(id: string): Promise<{ data: Truck }> {
  return apiClient.get<{ data: Truck }>(`/api/truck/${id}`);
}

export async function createTruck(
  data: CreateTruckRequest
): Promise<{ data: Truck }> {
  return apiClient.post<{ data: Truck }>("/api/truck", data);
}

export async function updateTruck(
  id: string,
  data: CreateTruckRequest
): Promise<{ data: Truck }> {
  return apiClient.put<{ data: Truck }>(`/api/truck/${id}`, data);
}

export async function deleteTruck(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/truck/${id}`);
}

