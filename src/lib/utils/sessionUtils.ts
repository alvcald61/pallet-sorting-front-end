"use server";

import { cookies } from "next/headers";

/**
 * Reads the session token from the httpOnly cookie (server-side only).
 */
export async function getSessionToken(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  return token || null;
}
