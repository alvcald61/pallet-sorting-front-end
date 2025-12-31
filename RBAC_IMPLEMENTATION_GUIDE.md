# Guía de Implementación RBAC (Role-Based Access Control)

## Overview

Se ha implementado un sistema completo de Control de Acceso Basado en Roles (RBAC) que obtiene roles y permisos del backend.

## Componentes Principales

### 1. **Types de Autenticación** (`src/lib/types/authTypes.ts`)

Define las interfaces para:

- `User`: Usuario con roles y permisos
- `Role`: Estructura de roles
- `Permission`: Estructura de permisos
- `RBACContextType`: Tipo del contexto RBAC

### 2. **RBACProvider** (`src/lib/contexts/RBACContext.tsx`)

Contexto que proporciona:

- `user`: Datos del usuario actual
- `roles`: Array de roles del usuario
- `permissions`: Array de permisos del usuario
- `hasRole(roleNames)`: Verifica si tiene uno o más roles
- `hasPermission(resource, action)`: Verifica permiso específico
- `hasAnyPermission(permissions)`: Verifica si tiene cualquiera de los permisos
- `loading`: Estado de carga
- `error`: Mensajes de error

### 3. **Componentes de Protección** (`src/lib/utils/rbacUtils.tsx`)

#### ProtectedElement

Renderiza contenido solo si el usuario tiene acceso:

```tsx
<ProtectedElement requiredRoles="ADMIN" fallback={<p>Sin acceso</p>}>
  <AdminPanel />
</ProtectedElement>
```

#### useCanAccess Hook

Hook para verificar acceso programáticamente:

```tsx
const canEdit = useCanAccess("MANAGER", [
  { resource: "ORDER", action: "UPDATE" },
]);
```

### 4. **Constantes de Roles y Permisos** (`src/lib/const/rbac.ts`)

Define todas las combinaciones de roles y permisos disponibles.

### 5. **API de Autenticación Mejorada** (`src/lib/api/auth/`)

#### authApi.ts

- `getAuthToken(email, password)`: Obtiene el token inicial

#### userApi.ts

- `getCurrentUser(token)`: Obtiene usuario con roles y permisos
- `refreshToken(token)`: Refresca el token
- `validateToken(token)`: Valida el token

### 6. **Middleware Mejorado** (`src/middleware.ts`)

- Valida sesión en cada request
- Redirige a login si no hay sesión
- Valida que el token no esté expirado

## Cómo Usar

### En Componentes (Client Side)

```tsx
"use client";

import { useRBAC, ProtectedElement } from "@/lib/contexts/RBACContext";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { PERMISSIONS } from "@/lib/const/rbac";

export function MyComponent() {
  const { user, hasRole, hasPermission } = useRBAC();
  const canCreateOrder = useCanAccess(
    ["ADMIN", "MANAGER"],
    [PERMISSIONS.ORDER.CREATE],
    false // requireAll = false (tiene almenos uno)
  );

  return (
    <>
      <h1>Bienvenido {user?.firstName}</h1>

      {/* Opción 1: Usar ProtectedElement */}
      <ProtectedElement
        requiredRoles="ADMIN"
        fallback={<p>No tienes permisos</p>}
      >
        <AdminSection />
      </ProtectedElement>

      {/* Opción 2: Usar hook */}
      {canCreateOrder && <button onClick={createOrder}>Crear Orden</button>}

      {/* Opción 3: Verificación directa */}
      {hasRole("MANAGER") && hasPermission("ORDER", "DELETE") && (
        <button onClick={deleteOrder}>Eliminar Orden</button>
      )}
    </>
  );
}
```

### En Layouts

```tsx
// src/app/admin/layout.tsx
"use client";

import { ProtectedElement } from "@/lib/utils/rbacUtils";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedElement requiredRoles="ADMIN" fallback={<AccessDenied />}>
      {children}
    </ProtectedElement>
  );
}

function AccessDenied() {
  return (
    <div className="p-8">
      <h1>Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta sección</p>
    </div>
  );
}
```

## Estructura de Respuesta del Backend

El endpoint `/api/auth/me` debe retornar:

```json
{
  "id": "1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": [
    {
      "id": "1",
      "name": "ADMIN",
      "description": "Administrador del sistema"
    }
  ],
  "permissions": [
    {
      "id": "1",
      "name": "Crear Órdenes",
      "description": "Permite crear nuevas órdenes",
      "resource": "ORDER",
      "action": "CREATE"
    },
    {
      "id": "2",
      "name": "Ver Órdenes",
      "description": "Permite ver órdenes",
      "resource": "ORDER",
      "action": "READ"
    }
  ]
}
```

## Endpoints Requeridos en Backend

1. **POST /api/auth/login**

   - Parámetros: `email`, `password`
   - Respuesta: `{ accessToken: string }`

2. **GET /api/auth/me** (Requiere Bearer token)

   - Respuesta: Usuario completo con roles y permisos

3. **GET /api/auth/validate** (Requiere Bearer token)

   - Respuesta: `{ valid: boolean }`

4. **POST /api/auth/refresh** (Requiere Bearer token)
   - Respuesta: `{ accessToken: string }`

## Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Se obtiene el token en `login action`
3. Token se guarda en httpOnly cookie
4. RBACProvider carga al montar (efecto useEffect)
5. RBACProvider obtiene user completo con roles/permisos de `/api/auth/me`
6. Se proporciona contexto a toda la app
7. Componentes usan hooks para verificar permisos
8. Middleware valida token en cada request

## Mejores Prácticas

1. **Siempre valida en backend** - RBAC en frontend es solo UX, el backend debe validar siempre
2. **Usa constantes** - Importa roles/permisos de `rbac.ts` para evitar typos
3. **Granular permisos** - Define permisos específicos (CREATE, READ, UPDATE, DELETE)
4. **Fallbacks** - Siempre proporciona alternativas cuando se usa ProtectedElement
5. **Manejo de loading** - Los componentes muestran estado de carga mientras se obtienen datos
6. **Logout seguro** - El logout elimina la cookie y redirige a login

## Roadmap Futuro

- [ ] Refresh de token automático
- [ ] Cache de permisos en localStorage
- [ ] Auditoria de acciones
- [ ] Two-factor authentication
- [ ] Integración con sistemas de permisos más complejos
