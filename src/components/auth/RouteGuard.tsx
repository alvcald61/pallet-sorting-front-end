import { ReactNode } from "react";
import { redirect } from "next/navigation";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  requiredPermissions?: { resource: string; action: string }[];
}

/**
 * Componente de nivel superior que protege rutas completas
 * Debe usarse en los layouts de rutas que requieren autenticación
 * 
 * Nota: Para la protección en servidor, usa middleware.ts
 * Este componente es para validación adicional en cliente
 */
export async function RouteGuard({
  children,
  allowedRoles,
  requiredPermissions,
}: RouteGuardProps) {
  // Esta lógica se ejecuta en el servidor
  // En producción, la validación principal debe estar en middleware.ts
  
  try {
    // const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/auth/session", {
    //   method: "GET",
    //   headers: {
    //     Cookie: `session=${process.env.SESSION_TOKEN || ""}`,
    //   },
    // });

    // if (!response.ok) {
      redirect("/login");
    // }

    // Aquí puedes validar roles y permisos contra allowedRoles y requiredPermissions
    // Por ahora, si la sesión es válida, permitimos el acceso

  } catch (error) {
    console.error("Error en RouteGuard:", error);
    redirect("/login");
  }

  return <>{children}</>;
}
