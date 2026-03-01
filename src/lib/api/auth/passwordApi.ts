export const requestPasswordReset = async (email: string): Promise<void> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/auth/forgot-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Error al enviar el correo");
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/auth/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Error al restablecer la contraseña");
  }
};
