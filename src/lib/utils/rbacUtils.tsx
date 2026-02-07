import { useRBAC } from "@/lib/contexts/RBACContext";
import { Skeleton } from "@mantine/core";
import { ReactNode } from "react";

interface ProtectedElementProps {
  children: ReactNode;
  requiredRoles?: string | string[];
  requiredPermissions?: { resource: string; action: string }[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Componente que renderiza contenido solo si el usuario tiene los roles/permisos necesarios
 * @param children - Contenido a renderizar si se tiene acceso
 * @param requiredRoles - Rol o roles necesarios (si requireAll es true, debe tener todos)
 * @param requiredPermissions - Permisos necesarios
 * @param requireAll - Si true, requiere TODOS los roles/permisos. Si false, requiere AL MENOS UNO
 * @param fallback - Contenido alternativo si no tiene acceso
 */
export function ProtectedElement({
  children,
  requiredRoles,
  requiredPermissions,
  requireAll = true,
  fallback = null,
}: ProtectedElementProps) {
  const { hasRole, hasAnyPermission, loading } = useRBAC();

  if (loading) {
    return (
      <Skeleton animate={false} height={8} mt={6} width="70%" radius="xl" />
    );
  }

  let hasAccess = true;

  if (requiredRoles) {
    if (requireAll) {
      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      hasAccess = roles.every((role) => hasRole(role));
    } else {
      hasAccess = hasRole(requiredRoles);
    }
  }

  if (hasAccess && requiredPermissions) {
    if (requireAll) {
      hasAccess = requiredPermissions.every(
        (p) => hasAnyPermission([p])
      );
    } else {
      hasAccess = hasAnyPermission(requiredPermissions);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook para verificar si el usuario tiene acceso a una sección/característica
 */
export function useCanAccess(
  requiredRoles?: string | string[],
  requiredPermissions?: { resource: string; action: string }[],
  requireAll: boolean = true
): boolean {
  const { hasRole, hasAnyPermission, loading } = useRBAC();

  if (loading) return false;

  let hasAccess = true;

  if (requiredRoles) {
    if (requireAll) {
      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      hasAccess = roles.every((role) => hasRole(role));
    } else {
      hasAccess = hasRole(requiredRoles);
    }
  }

  if (hasAccess && requiredPermissions) {
    if (requireAll) {
      hasAccess = requiredPermissions.every(
        (p) => hasAnyPermission([p])
      );
    } else {
      hasAccess = hasAnyPermission(requiredPermissions);
    }
  }

  return hasAccess;
}
