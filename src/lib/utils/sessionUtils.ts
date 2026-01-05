"use server";

import { cookies } from "next/headers";

export async function getTokenFromLocalStorage(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  return token || null;
  // if (typeof window !== "undefined") {
  //   return localStorage.getItem("jwt");
  // }
  // return null;
}
