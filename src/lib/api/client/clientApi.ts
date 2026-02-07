import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Role,
} from "@/lib/types/clientType";
import { get, post, put, apiDelete } from "../apiClient";

export async function getClients(): Promise<{ data: Client[] }> {
  return get<{ data: Client[] }>("/client");
}

export async function getClientById(id: string): Promise<{ data: Client }> {
  return get<{ data: Client }>(`/client/${id}`);
}

export async function createClient(
  data: CreateClientRequest
): Promise<{ data: Client }> {
  return post<{ data: Client }>("/client", data);
}

export async function updateClient(
  id: string,
  data: UpdateClientRequest
): Promise<{ data: Client }> {
  return put<{ data: Client }>(`/client/${id}`, data);
}

export async function deleteClient(id: string): Promise<void> {
  await apiDelete<void>(`/client/${id}`);
}

export async function getRoles(): Promise<{ data: Role[] }> {
  return get<{ data: Role[] }>("/role");
}

