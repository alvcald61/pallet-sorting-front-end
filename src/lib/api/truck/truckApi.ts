import {
  CreateTruckRequest,
  Truck,
  UpdateTruckRequest,
} from "@/lib/types/truckType";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

// export async function getTokenFromLocalStorage(): Promise<string | null> {
//   const token = (await cookies()).get("session")?.value;
//   console.log("token", token);
//   return token || null;
//   // if (typeof window !== "undefined") {
//   //   return localStorage.getItem("jwt");
//   // }
//   // return null;
// }

export async function getTrucks(): Promise<{ data: Truck[] }> {
  const response = await fetch(`${BASE_URL}/api/truck`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trucks: ${response.statusText}`);
  }

  return response.json();
}

export async function getTruckById(id: string): Promise<{ data: Truck }> {
  const response = await fetch(`${BASE_URL}/api/truck/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch truck: ${response.statusText}`);
  }

  return response.json();
}

export async function createTruck(
  data: CreateTruckRequest
): Promise<{ data: Truck }> {
  const response = await fetch(`${BASE_URL}/api/truck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create truck: ${response.statusText}`);
  }

  return response.json();
}

export async function updateTruck(
  id: string,
  data: CreateTruckRequest
): Promise<{ data: Truck }> {
  const response = await fetch(`${BASE_URL}/api/truck/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update truck: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteTruck(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/truck/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete truck: ${response.statusText}`);
  }
}
