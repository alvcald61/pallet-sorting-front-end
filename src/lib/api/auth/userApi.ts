import { User } from "@/lib/types/authTypes";
import { get, post } from "../apiClient";

/**
 * Obtiene la información del usuario autenticado, incluyendo roles y permisos
 * Este endpoint debe ser llamado después del login para obtener datos completos
 */
export const getCurrentUser = async (): Promise<User> => {
  return get<User>("/auth/me");
};

/**
 * Refresca el token de autenticación
 */
export const refreshToken = async (): Promise<string> => {
  const data = await post<{ accessToken: string }>("/auth/refresh");
  return data.accessToken;
};

/**
 * Valida si el token es válido y aún tiene permisos
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    await get<void>("/auth/validate");
    return true;
  } catch {
    return false;
  }
};
