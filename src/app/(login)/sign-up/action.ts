"use server";

import { createClient } from "@/lib/api/client/clientApi";
import { getAuthToken } from "@/lib/api/auth/authApi";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface RegisterFormState {
  error?: string;
  success?: boolean;
}

export async function register(prevState: RegisterFormState | undefined, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const businessName = formData.get("businessName") as string;
    const ruc = formData.get("ruc") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    // Validaciones
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !businessName ||
      !ruc ||
      !phone ||
      !address
    ) {
      return { error: "Todos los campos son requeridos" };
    }

    if (!isValidEmail(email)) {
      return { error: "El formato del email no es válido" };
    }

    if (password.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    if (password !== confirmPassword) {
      return { error: "Las contraseñas no coinciden" };
    }

    if (!isValidPhone(phone)) {
      return { error: "El formato del teléfono no es válido" };
    }

    if (ruc.length < 10) {
      return { error: "El RUC debe tener al menos 10 caracteres" };
    }

    // Crear cliente con rol por defecto
    try {
      const response = await createClient({
        firstName,
        lastName,
        email,
        password,
        businessName,
        ruc,
        phone,
        address,
        roles: ["2"], // Rol por defecto para nuevos clientes
      });

      // Intentar autenticar automáticamente
      try {
        const authResponse = await getAuthToken(email, password);
        (await cookies()).set("session", authResponse.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        redirect("/order");
      } catch (authError) {
        // Si la autenticación falla, redirigir al login para que inicie sesión manualmente
        redirect("/login?registered=true");
      }
    } catch (apiError) {
      const errorMessage =
        apiError instanceof Error ? apiError.message : "Error al crear cuenta";

      if (errorMessage.includes("409") || errorMessage.includes("already")) {
        return { error: "Este email ya está registrado" };
      }

      return {
        error: errorMessage || "Error al crear la cuenta. Intenta más tarde",
      };
    }
  } catch (error) {
    console.error("Register error:", error);
    return {
      error: "Error al registrarse. Por favor, intenta más tarde",
    };
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
}
