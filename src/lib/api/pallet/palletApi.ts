import {
  Pallet,
  CreatePalletRequest,
  UpdatePalletRequest,
} from "@/lib/types/palletType";
import { apiClient } from "../apiClient";

export async function getPallets(): Promise<{ data: Pallet[] }> {
  return apiClient.get<{ data: Pallet[] }>("/api/pallet");
}

export async function getPalletById(id: string): Promise<{ data: Pallet }> {
  return apiClient.get<{ data: Pallet }>(`/api/pallets/${id}`);
}

export async function createPallet(
  data: CreatePalletRequest
): Promise<{ data: Pallet }> {
  return apiClient.post<{ data: Pallet }>("/api/pallets", data);
}

export async function updatePallet(
  id: string,
  data: CreatePalletRequest
): Promise<{ data: Pallet }> {
  return apiClient.put<{ data: Pallet }>(`/api/pallets/${id}`, data);
}

export async function deletePallet(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/pallets/${id}`);
}

