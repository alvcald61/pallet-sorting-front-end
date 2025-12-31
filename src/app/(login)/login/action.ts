"use server";

import { getAuthToken } from "@/lib/api/auth/authApi";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validación básica
    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" };
    }

    if (!isValidEmail(email)) {
      return { error: "El formato del email no es válido" };
    }

    if (password.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    // Obtener el token
    const authResponse = await getAuthToken(email, password);

    // Guardar el token en la cookie
    (await cookies()).set("session", authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    });

    redirect("/order");
  } catch (error) {
    console.error("Login error:", error);
    return {
      error:
        error instanceof Error && error.message === "Credenciales incorrectas"
          ? "Email o contraseña incorrectos"
          : "Error al iniciar sesión. Por favor, intenta más tarde",
    };
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
