import {
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "@/lib/types/driverType";
import { apiClient } from "../apiClient";

export async function getDrivers(): Promise<{ data: Driver[] }> {
  return apiClient.get<{ data: Driver[] }>("/api/driver");
}

export async function getDriverById(id: string): Promise<{ data: Driver }> {
  return apiClient.get<{ data: Driver }>(`/api/driver/${id}`);
}

export async function createDriver(
  data: CreateDriverRequest
): Promise<{ data: Driver }> {
  return apiClient.post<{ data: Driver }>("/api/driver", data);
}

export async function updateDriver(
  id: string,
  data: UpdateDriverRequest
): Promise<{ data: Driver }> {
  return apiClient.put<{ data: Driver }>(`/api/driver/${id}`, data);
}

export async function deleteDriver(id: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/api/driver/${id}`);
}

