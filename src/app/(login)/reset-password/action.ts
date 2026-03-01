"use server";

import { resetPassword } from "@/lib/api/auth/passwordApi";

export interface ResetPasswordFormState {
  error?: string;
  success?: boolean;
}

export async function resetPasswordAction(
  prevState: ResetPasswordFormState | undefined,
  formData: FormData
): Promise<ResetPasswordFormState> {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token) {
      return { error: "Token de recuperación inválido o expirado" };
    }

    if (!password || !confirmPassword) {
      return { error: "Ambos campos son requeridos" };
    }

    if (password.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    if (password !== confirmPassword) {
      return { error: "Las contraseñas no coinciden" };
    }

    await resetPassword(token, password);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error al restablecer la contraseña. Por favor, intenta más tarde",
    };
  }
}
