/**
 * Ejemplo de cómo usar RBAC en la NavBar del orden
 */

"use client";

import { useRBAC, ProtectedElement } from "@/lib/contexts/RBACContext";
import { ROLES, PERMISSIONS } from "@/lib/const/rbac";
import { useCanAccess } from "@/lib/utils/rbacUtils";

/**
 * Este es un ejemplo de implementación en NavBar.tsx
 * Mostraría diferentes botones según los permisos del usuario
 */
export function NavBarRBACExample() {
  const { user, hasRole, hasPermission } = useRBAC();
  const canCreateOrder = useCanAccess("MANAGER", [PERMISSIONS.ORDER.CREATE]);
  const canManageDriver = useCanAccess("ADMIN");

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>TUPACK</h1>
      </div>

      <div className="navbar-menu">
        {/* Link de órdenes - visible para todos los roles autenticados */}
        <a href="/order">Órdenes</a>

        {/* Link de choferes - solo para ADMIN y MANAGER */}
        <ProtectedElement
          requiredRoles={["ADMIN", "MANAGER"]}
          requireAll={false}
        >
          <a href="/driver">Choferes</a>
        </ProtectedElement>

        {/* Link de camiones - solo si tiene permiso */}
        <ProtectedElement requiredPermissions={[PERMISSIONS.TRUCK.LIST]}>
          <a href="/truck">Camiones</a>
        </ProtectedElement>

        {/* Link de configuración - solo ADMIN */}
        <ProtectedElement requiredRoles={ROLES.ADMIN}>
          <a href="/settings">Configuración</a>
        </ProtectedElement>

        {/* Botón de crear orden - con acceso basado en permisos */}
        {canCreateOrder && (
          <button className="btn-primary">+ Nueva Orden</button>
        )}

        {/* Sección del usuario */}
        <div className="user-section">
          <span>
            {user?.firstName} {user?.lastName}
          </span>
          <p className="user-role">
            {user?.roles.map((r) => r).join(", ")}
          </p>
        </div>
      </div>
    </nav>
  );
}

/**
 * Ejemplo de uso en una tabla de órdenes
 */
export function OrderTableWithRBAC() {
  const { hasPermission } = useRBAC();
  const canEdit = hasPermission("ORDER", "UPDATE");
  const canDelete = hasPermission("ORDER", "DELETE");

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Estado</th>
          {(canEdit || canDelete) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ORD-001</td>
          <td>Cliente A</td>
          <td>Pendiente</td>
          {(canEdit || canDelete) && (
            <td>
              {canEdit && <button>Editar</button>}
              {canDelete && <button>Eliminar</button>}
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
}

/**
 * Ejemplo de protección de sección administrativo
 */
export function AdminSection() {
  return (
    <ProtectedElement
      requiredRoles="ADMIN"
      fallback={
        <div className="alert alert-warning">
          Necesitas permisos de administrador para acceder a esta sección
        </div>
      }
    >
      <div className="admin-panel">
        <h2>Panel Administrativo</h2>
        {/* Contenido solo para admins */}
      </div>
    </ProtectedElement>
  );
}
