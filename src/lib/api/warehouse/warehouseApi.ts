import {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/lib/types/warehouseType";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

export async function getWarehouses(): Promise<{ data: Warehouse[] }> {
  const response = await fetch(`${BASE_URL}/api/warehouse`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch warehouse: ${response.statusText}`);
  }

  return response.json();
}

export async function getWarehouseById(
  id: string
): Promise<{ data: Warehouse }> {
  const response = await fetch(`${BASE_URL}/api/warehouse/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch warehouse: ${response.statusText}`);
  }

  return response.json();
}

export async function createWarehouse(
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  const response = await fetch(`${BASE_URL}/api/warehouse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create warehouse: ${response.statusText}`);
  }

  return response.json();
}

export async function updateWarehouse(
  id: string,
  data: CreateWarehouseRequest
): Promise<{ data: Warehouse }> {
  const response = await fetch(`${BASE_URL}/api/warehouse/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update warehouse: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteWarehouse(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/warehouse/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete warehouse: ${response.statusText}`);
  }
}
