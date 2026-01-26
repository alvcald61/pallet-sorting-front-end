import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Role,
} from "@/lib/types/clientType";
import { apiClient } from "../apiClient";

export async function getClients(): Promise<{ data: Client[] }> {
  return apiClient.get<{ data: Client[] }>("/api/client");
}

export async function getClientById(id: string): Promise<{ data: Client }> {
  return apiClient.get<{ data: Client }>(`/api/client/${id}`);
}

export async function createClient(
  data: CreateClientRequest
): Promise<{ data: Client }> {
  return apiClient.post<{ data: Client }>("/api/client", data);
}

export async function updateClient(
  id: string,
  data: UpdateClientRequest
): Promise<{ data: Client }> {
  return apiClient.put<{ data: Client }>(`/api/client/${id}`, data);
}

export async function deleteClient(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/client/${id}`);
}

export async function getRoles(): Promise<{ data: Role[] }> {
  return apiClient.get<{ data: Role[] }>("/api/role");
}

