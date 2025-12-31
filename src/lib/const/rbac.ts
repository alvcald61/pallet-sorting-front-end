/**
 * Definición de constantes de roles y permisos
 * Usa estos valores para mantener consistencia en toda la aplicación
 */

export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  DRIVER: "DRIVER",
  WAREHOUSE: "WAREHOUSE",
  CLIENT: "CLIENT",
} as const;

export const PERMISSIONS = {
  // Órdenes
  ORDER: {
    CREATE: { resource: "ORDER", action: "CREATE" },
    READ: { resource: "ORDER", action: "READ" },
    UPDATE: { resource: "ORDER", action: "UPDATE" },
    DELETE: { resource: "ORDER", action: "DELETE" },
    LIST: { resource: "ORDER", action: "LIST" },
  },
  // Camiones
  TRUCK: {
    CREATE: { resource: "TRUCK", action: "CREATE" },
    READ: { resource: "TRUCK", action: "READ" },
    UPDATE: { resource: "TRUCK", action: "UPDATE" },
    DELETE: { resource: "TRUCK", action: "DELETE" },
    LIST: { resource: "TRUCK", action: "LIST" },
  },
  // Choferes
  DRIVER: {
    CREATE: { resource: "DRIVER", action: "CREATE" },
    READ: { resource: "DRIVER", action: "READ" },
    UPDATE: { resource: "DRIVER", action: "UPDATE" },
    DELETE: { resource: "DRIVER", action: "DELETE" },
    LIST: { resource: "DRIVER", action: "LIST" },
  },
  // Clientes
  CLIENT: {
    CREATE: { resource: "CLIENT", action: "CREATE" },
    READ: { resource: "CLIENT", action: "READ" },
    UPDATE: { resource: "CLIENT", action: "UPDATE" },
    DELETE: { resource: "CLIENT", action: "DELETE" },
    LIST: { resource: "CLIENT", action: "LIST" },
  },
  // Almacén
  WAREHOUSE: {
    CREATE: { resource: "WAREHOUSE", action: "CREATE" },
    READ: { resource: "WAREHOUSE", action: "READ" },
    UPDATE: { resource: "WAREHOUSE", action: "UPDATE" },
    DELETE: { resource: "WAREHOUSE", action: "DELETE" },
    LIST: { resource: "WAREHOUSE", action: "LIST" },
  },
  // Reportes
  REPORTS: {
    VIEW: { resource: "REPORTS", action: "VIEW" },
    EXPORT: { resource: "REPORTS", action: "EXPORT" },
  },
  // Configuración
  SETTINGS: {
    MANAGE: { resource: "SETTINGS", action: "MANAGE" },
  },
} as const;

export type Role = keyof typeof ROLES;
export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];
