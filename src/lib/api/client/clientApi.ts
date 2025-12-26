import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Role,
} from "@/lib/types/clientType";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

export async function getClients(): Promise<{ data: Client[] }> {
  const response = await fetch(`${BASE_URL}/api/client`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch client: ${response.statusText}`);
  }

  return response.json();
}

export async function getClientById(id: string): Promise<{ data: Client }> {
  const response = await fetch(`${BASE_URL}/api/client/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch client: ${response.statusText}`);
  }

  return response.json();
}

export async function createClient(
  data: CreateClientRequest
): Promise<{ data: Client }> {
  const response = await fetch(`${BASE_URL}/api/client`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create client: ${response.statusText}`);
  }

  return response.json();
}

export async function updateClient(
  id: string,
  data: UpdateClientRequest
): Promise<{ data: Client }> {
  const response = await fetch(`${BASE_URL}/api/client/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update client: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/client/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete client: ${response.statusText}`);
  }
}

export async function getRoles(): Promise<{ data: Role[] }> {
  const response = await fetch(`${BASE_URL}/api/role`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }

  return response.json();
}
