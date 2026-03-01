import {
  CreateTruckRequest,
  Truck,
  UpdateTruckRequest,
} from "@/lib/types/truckType";
import { get, post, put, apiDelete } from "../apiClient";

export async function getTrucks(): Promise<{ data: Truck[] }> {
  return get<{ data: Truck[] }>("/truck");
}

export async function getTruckById(id: string): Promise<{ data: Truck }> {
  return get<{ data: Truck }>(`/truck/${id}`);
}

export async function createTruck(
  data: CreateTruckRequest
): Promise<{ data: Truck }> {
  return post<{ data: Truck }>("/truck", data);
}

export async function updateTruck(
  id: string,
  data: Omit<UpdateTruckRequest, 'id'>
): Promise<{ data: Truck }> {
  return put<{ data: Truck }>(`/truck/${id}`, data);
}

export async function deleteTruck(id: string): Promise<void> {
  await apiDelete<void>(`/truck/${id}`);
}

