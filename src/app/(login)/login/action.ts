"use server"

import { getAuthToken } from "@/lib/api/auth/authApi"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { User } from "@/lib/types/authTypes"

export interface LoginFormState {
  error?: string
  success?: boolean
  user?: User
}

export async function login(
  prevState: LoginFormState | undefined,
  formData: FormData,
): Promise<LoginFormState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos" }
  }

  if (!isValidEmail(email)) {
    return { error: "El formato del email no es válido" }
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" }
  }

  try {
    const authResponse = await getAuthToken(email, password)

    const jar = await cookies()
    jar.set("session", authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    jar.set("refresh", authResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return {
      success: true,
      user: {
        id: authResponse.id,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        roles: authResponse.roles,
        permissions: authResponse.permissions ?? [],
      },
    }
  } catch (error) {
    return {
      error:
        error instanceof Error && error.message === "Credenciales incorrectas"
          ? "Email o contraseña incorrectos"
          : "Error al iniciar sesión. Por favor, intenta más tarde",
    }
  }
}

export async function logout() {
  const jar = await cookies()
  jar.delete("session")
  jar.delete("refresh")
  redirect("/login")
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
