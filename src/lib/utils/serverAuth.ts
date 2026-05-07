"use server"

import { cookies } from "next/headers"
import { User } from "@/lib/types/authTypes"
import { getCurrentUser } from "@/lib/api/auth/userApi"

export async function getServerUser(): Promise<User | null> {
  const token = (await cookies()).get("session")?.value
  if (!token) return null

  try {
    return await getCurrentUser()
  } catch {
    return null
  }
}

export function hasRoleServer(
  user: User | null,
  roleNames: string | string[]
): boolean {
  if (!user) return false
  const roles = Array.isArray(roleNames) ? roleNames : [roleNames]
  return roles.some((name) =>
    user.roles.some((r) => r.toLowerCase() === name.toLowerCase())
  )
}

export function hasPermissionServer(
  user: User | null,
  resource: string,
  action: string
): boolean {
  if (!user) return false
  return user.permissions.some(
    (p) =>
      p.resource.toLowerCase() === resource.toLowerCase() &&
      p.action.toLowerCase() === action.toLowerCase()
  )
}
