"use server";

import { requestPasswordReset } from "@/lib/api/auth/passwordApi";

export interface ForgotPasswordFormState {
  error?: string;
  success?: boolean;
}

export async function forgotPassword(
  prevState: ForgotPasswordFormState | undefined,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return { error: "El correo es requerido" };
    }

    if (!isValidEmail(email)) {
      return { error: "El formato del email no es válido" };
    }

    await requestPasswordReset(email);

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    // Always return success to prevent email enumeration
    return { success: true };
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
