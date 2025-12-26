"use server";

import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/pallet";

export const getAllPallets = async (): Promise<any> => {
  const token = await getTokenFromLocalStorage();
  const res = await fetch(`${API_BASE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export async function getTokenFromLocalStorage(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  console.log("token", token);
  return token || null;
  // if (typeof window !== "undefined") {
  //   return localStorage.getItem("jwt");
  // }
  // return null;
}
