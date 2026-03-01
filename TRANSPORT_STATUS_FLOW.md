# Transport Status Flow Implementation

## Overview

Se ha implementado un flujo independiente de `TransportStatus` que maneja el estado del transporte de las órdenes, separado del `OrderStatus`. Este flujo es específico para los choferes (rol DRIVER) y permite que sigan el progreso del viaje paso a paso.

## Transport Status Flow

El flujo completo de transporte es:

```
TRUCK_ASSIGNED (Camión Asignado)
    ↓ (Chofer presiona "Continuar")
EN_ROUTE_TO_WAREHOUSE (En Ruta al Almacén)
    ↓
ARRIVED_AT_WAREHOUSE (Llegó al Almacén)
    ↓
LOADING (Cargando)
    ↓
LOADING_COMPLETED (Carga Completada)
    ↓
EN_ROUTE_TO_DESTINATION (En Ruta al Destino)
    ↓
ARRIVED_AT_DESTINATION (Llegó al Destino)
    ↓
UNLOADING (Descargando)
    ↓
UNLOADING_COMPLETED (Descarga Completada)
    ↓
DELIVERED (Entregado) → También cambia OrderStatus a DELIVERED
```

## Components

### 1. TransportFlow Component

**Ubicación**: `src/app/(application)/order/components/TransportFlow.tsx`

**Responsabilidades**:

- Mostrar el estado actual del transporte
- Visualizar un timeline con todos los estados
- Permitir que los choferes avancen al siguiente estado
- Mostrar modal de confirmación antes de cambiar estado

**Props**:

```typescript
interface TransportFlowProps {
  orderId: string;
  currentTransportStatus?: TransportStatus;
  onStatusUpdate?: () => void;
}
```

**Características**:

- ✅ Solo visible para usuarios con rol DRIVER
- ✅ Timeline visual que muestra estados completados, actual y pendientes
- ✅ Botón "Continuar" para avanzar al siguiente estado
- ✅ Modal de confirmación para cada cambio
- ✅ Descripciones claras de cada estado

### 2. InitiateRouteButton Component

**Ubicación**: `src/app/(application)/order/components/InitiateRouteButton.tsx`

**Responsabilidades**:

- Permitir al chofer iniciar la ruta desde el estado TRUCK_ASSIGNED
- Validar que la orden esté aprobada
- Validar que todos los documentos requeridos estén cargados
- Avanzar el estado a EN_ROUTE_TO_WAREHOUSE

**Props**:

```typescript
interface InitiateRouteButtonProps {
  orderId: string;
  orderStatus: OrderStatus;
  isDocumentPending: boolean;
  documents: Document[];
  currentTransportStatus?: TransportStatus;
}
```

**Comportamiento**:

- Solo se muestra si el usuario es DRIVER
- Solo se muestra si la orden está en estado APPROVED
- Se deshabilita si hay documentos pendientes
- Desaparece una vez que la ruta ha sido iniciada

## API Integration

### Transport API

**Ubicación**: `src/lib/api/transport/transportApi.ts`

**Funciones**:

```typescript
// Actualiza rápidamente el estado del transporte
export async function quickStatusUpdate(
  id: string,
  status: TransportStatus,
): Promise<void>;
```

**Endpoint**: `PATCH /api/order/{id}/transport/status/quick`

**Parámetros**:

- `status`: El nuevo estado de TransportStatus

## Types

### TransportStatus Enum

**Ubicación**: `src/lib/types/trnasportTypes.ts`

```typescript
export enum TransportStatus {
  PENDING = "PENDING",
  TRUCK_ASSIGNED = "TRUCK_ASSIGNED",
  EN_ROUTE_TO_WAREHOUSE = "EN_ROUTE_TO_WAREHOUSE",
  ARRIVED_AT_WAREHOUSE = "ARRIVED_AT_WAREHOUSE",
  LOADING = "LOADING",
  LOADING_COMPLETED = "LOADING_COMPLETED",
  EN_ROUTE_TO_DESTINATION = "EN_ROUTE_TO_DESTINATION",
  ARRIVED_AT_DESTINATION = "ARRIVED_AT_DESTINATION",
  UNLOADING = "UNLOADING",
  UNLOADING_COMPLETED = "UNLOADING_COMPLETED",
  DELIVERED = "DELIVERED",
}
```

### Order Type Updates

Se añadió el campo `transportStatus` al tipo `Order`:

```typescript
export interface Order {
  // ... otros campos ...
  transportStatus?: TransportStatus;
}
```

## Usage in Order Details Page

En la página `[orderId]`, se integran ambos componentes:

```tsx
// Botón para iniciar la ruta (solo en documentos)
<InitiateRouteButton
  orderId={order.id}
  orderStatus={order.orderStatus}
  isDocumentPending={order.documentPending}
  documents={order.documents}
  currentTransportStatus={order.transportStatus}
/>;

// Timeline del transporte (después de iniciado)
{
  order.orderStatus === OrderStatus.APPROVED && order.transportStatus && (
    <TransportFlow
      orderId={order.id}
      currentTransportStatus={order.transportStatus}
    />
  );
}
```

## Permission & Authorization

- **Acción**: Solo choferes (rol DRIVER) pueden cambiar el estado del transporte
- **Validación**: El sistema valida que solo DRIVER pueda ejecutar transiciones
- **Seguridad**: Cada cambio debe confirmarse explícitamente

## Business Logic

1. **Inicio de Ruta**:
   - El chofer puede iniciar la ruta solo si:
     - La orden está en estado APPROVED
     - Todos los documentos requeridos están cargados
     - El transporte está en estado TRUCK_ASSIGNED

2. **Progresión del Transporte**:
   - Cada estado tiene un siguiente estado predefinido
   - El chofer solo puede avanzar al siguiente estado (no puede saltarse estados)
   - Cada cambio requiere confirmación

3. **Finalización**:
   - Cuando se alcanza DELIVERED:
     - El OrderStatus también se actualiza a DELIVERED
     - La orden se marca como completada en el sistema

## UI/UX Flow

```
┌─────────────────────────────────────────┐
│   Documentos Requeridos Section         │
│  ┌─────────────────────────────────────┐│
│  │ Zona de Carga de Documentos         ││
│  │ [Cargar documento]                  ││
│  ├─────────────────────────────────────┤│
│  │ [Iniciar Ruta]  (botón verde)       ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
            ↓ (después de iniciar)
┌─────────────────────────────────────────┐
│   Estado del Transporte Section         │
│  ┌─────────────────────────────────────┐│
│  │ Timeline del Transporte             ││
│  │ ✓ Camión Asignado                   ││
│  │ ⚫ En Ruta al Almacén (actual)      ││
│  │ ○ Llegó al Almacén                  ││
│  │ ○ Cargando                          ││
│  │ ... (más estados)                   ││
│  │                   [Continuar]       ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

## Error Handling

- Validación de documentos pendientes
- Confirmación de cambios de estado
- Manejo de errores de API
- Actualización automática de la página después de cambios

## Future Enhancements

- [ ] Notificaciones en tiempo real del cambio de estado
- [ ] Historial de cambios de estado con timestamps
- [ ] Geolocalización para validar estados (ej: verificar que llegó a destino)
- [ ] Fotos de evidencia en estados clave
- [ ] Estimaciones de tiempo entre estados
