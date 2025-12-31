import { User } from "@/lib/types/authTypes";

/**
 * Obtiene la información del usuario autenticado, incluyendo roles y permisos
 * Este endpoint debe ser llamado después del login para obtener datos completos
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  const data: User = await res.json();
  return data;
};

/**
 * Refresca el token de autenticación
 */
export const refreshToken = async (currentToken: string): Promise<string> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo refrescar el token");
  }

  const data: { accessToken: string } = await res.json();
  return data.accessToken;
};

/**
 * Valida si el token es válido y aún tiene permisos
 */
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/auth/validate`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.ok;
  } catch {
    return false;
  }
};
