import {
  Pallet,
  CreatePalletRequest,
  UpdatePalletRequest,
} from "@/lib/types/palletType";
import { get, post, put, apiDelete } from "../apiClient";

export async function getPallets(): Promise<{ data: Pallet[] }> {
  return get<{ data: Pallet[] }>("/pallet");
}

export async function getPalletById(id: string): Promise<{ data: Pallet }> {
  return get<{ data: Pallet }>(`/pallet/${id}`);
}

export async function createPallet(
  data: CreatePalletRequest
): Promise<{ data: Pallet }> {
  return post<{ data: Pallet }>("/pallet", data);
}

export async function updatePallet(
  id: string,
  data: Omit<UpdatePalletRequest, 'id'>
): Promise<{ data: Pallet }> {
  return put<{ data: Pallet }>(`/pallet/${id}`, data);
}

export async function deletePallet(id: string): Promise<void> {
  await apiDelete<void>(`/pallet/${id}`);
}

