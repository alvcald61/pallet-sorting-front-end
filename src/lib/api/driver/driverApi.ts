import {
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "@/lib/types/driverType";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

export async function getDrivers(): Promise<{ data: Driver[] }> {
  const response = await fetch(`${BASE_URL}/api/driver`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch drivers: ${response.statusText}`);
  }

  return response.json();
}

export async function getDriverById(id: string): Promise<{ data: Driver }> {
  const response = await fetch(`${BASE_URL}/api/driver/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch driver: ${response.statusText}`);
  }

  return response.json();
}

export async function createDriver(
  data: CreateDriverRequest
): Promise<{ data: Driver }> {
  const response = await fetch(`${BASE_URL}/api/driver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create driver: ${response.statusText}`);
  }

  return response.json();
}

export async function updateDriver(
  id: string,
  data: UpdateDriverRequest
): Promise<{ data: Driver }> {
  const response = await fetch(`${BASE_URL}/api/driver/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update driver: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteDriver(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/api/driver/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete driver: ${response.statusText}`);
  }

  return response.json();
}
