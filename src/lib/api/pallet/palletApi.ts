import {
  Pallet,
  CreatePalletRequest,
  UpdatePalletRequest,
} from "@/lib/types/palletType";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

export async function getPallets(): Promise<{ data: Pallet[] }> {
  const response = await fetch(`${BASE_URL}/api/pallet`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pallets: ${response.statusText}`);
  }

  return response.json();
}

export async function getPalletById(id: string): Promise<{ data: Pallet }> {
  const response = await fetch(`${BASE_URL}/api/pallets/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pallet: ${response.statusText}`);
  }

  return response.json();
}

export async function createPallet(
  data: CreatePalletRequest
): Promise<{ data: Pallet }> {
  const response = await fetch(`${BASE_URL}/api/pallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create pallet: ${response.statusText}`);
  }

  return response.json();
}

export async function updatePallet(
  id: string,
  data: CreatePalletRequest
): Promise<{ data: Pallet }> {
  const response = await fetch(`${BASE_URL}/api/pallets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update pallet: ${response.statusText}`);
  }

  return response.json();
}

export async function deletePallet(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/pallets/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete pallet: ${response.statusText}`);
  }
}
