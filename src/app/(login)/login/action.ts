"use server";

import { getAuthToken } from "@/lib/api/auth/authApi";
import { getCurrentUser } from "@/lib/api/auth/userApi";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" };
    }

    // Obtener el token
    const authResponse = await getAuthToken(email, password);

    // Guardar el token en la cookie
    (await cookies()).set("session", authResponse.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    });

    // Obtener información del usuario con roles y permisos
    try {
      await getCurrentUser(authResponse.accessToken);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // El usuario se pudo autenticar, permitimos continuar
      // El RBACProvider manejará los datos del usuario
    }

    redirect("/order");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al iniciar sesión",
    };
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}
