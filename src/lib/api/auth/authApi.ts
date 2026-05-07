"use server";

import { LoginResponse } from "@/lib/types/authTypes";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

export const getAuthToken = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      console.log("Error response data:", BASE_URL);
      throw new Error(errorData.message || "Credenciales incorrectas");
    }
    throw new Error("Credenciales incorrectas");
  }

  return await res.json();
};
