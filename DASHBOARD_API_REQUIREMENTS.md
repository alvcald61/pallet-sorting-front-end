# Endpoints de API requeridos para Dashboard

El frontend espera los siguientes endpoints en el backend. Estos deben estar en la ruta base `/api/dashboard`.

## 1. GET `/api/dashboard/stats`
**Descripción**: Obtiene estadísticas generales del dashboard.

**Respuesta esperada**:
```json
{
  "totalOrders": 150,
  "pendingOrders": 25,
  "deliveredOrders": 120,
  "totalRevenue": 15000.50
}
```

---

## 2. GET `/api/dashboard/pending-orders?limit=10`
**Descripción**: Obtiene las órdenes pendientes con un límite opcional.

**Parámetros**:
- `limit` (query, opcional): Número máximo de órdenes a retornar. Default: 10

**Respuesta esperada**:
```json
[
  {
    "id": "order-123",
    "clientName": "Empresa XYZ",
    "fromAddress": "Lima, Perú",
    "toAddress": "Arequipa, Perú",
    "pickupDate": "2026-01-15",
    "orderStatus": "PENDING"
  },
  ...
]
```

---

## 3. GET `/api/dashboard/orders-by-client`
**Descripción**: Obtiene el conteo de órdenes agrupadas por cliente.

**Respuesta esperada**:
```json
[
  {
    "id": "client-1",
    "clientName": "Empresa A",
    "businessName": "Empresa A S.A.",
    "count": 25
  },
  {
    "id": "client-2",
    "clientName": "Empresa B",
    "businessName": "Empresa B S.A.",
    "count": 18
  },
  ...
]
```

---

## 4. GET `/api/dashboard/orders-by-driver`
**Descripción**: Obtiene el conteo de órdenes agrupadas por chofer.

**Respuesta esperada**:
```json
[
  {
    "id": "driver-1",
    "driverName": "Juan Pérez",
    "name": "Juan Pérez",
    "count": 45
  },
  {
    "id": "driver-2",
    "driverName": "Carlos García",
    "name": "Carlos García",
    "count": 32
  },
  ...
]
```

---

## 5. GET `/api/dashboard/orders-by-truck`
**Descripción**: Obtiene el conteo de órdenes agrupadas por camión.

**Respuesta esperada**:
```json
[
  {
    "id": "truck-1",
    "truckPlate": "ABC-1234",
    "plate": "ABC-1234",
    "count": 28
  },
  {
    "id": "truck-2",
    "truckPlate": "DEF-5678",
    "plate": "DEF-5678",
    "count": 22
  },
  ...
]
```

---

## 6. GET `/api/dashboard/orders-by-status`
**Descripción**: Obtiene el conteo de órdenes agrupadas por estado.

**Respuesta esperada**:
```json
[
  {
    "status": "PENDING",
    "orderStatus": "PENDING",
    "count": 25,
    "total": 25
  },
  {
    "status": "IN_TRANSIT",
    "orderStatus": "IN_TRANSIT",
    "count": 50,
    "total": 50
  },
  {
    "status": "DELIVERED",
    "orderStatus": "DELIVERED",
    "count": 75,
    "total": 75
  },
  ...
]
```

---

## 7. GET `/api/dashboard/performance-metrics`
**Descripción**: Obtiene métricas de rendimiento (volumen, peso, ingresos, etc).

**Respuesta esperada** (opcional, actualmente no utilizado):
```json
{
  "totalVolume": 5000.00,
  "totalWeight": 15000.50,
  "averageDeliveryTime": 2.5,
  "totalIncome": 150000.00,
  "totalOrders": 150
}
```

---

## Notas de Implementación

1. **Autenticación**: Todos los endpoints requieren el header `Authorization: Bearer <token>`

2. **Responsabilidad del Frontend**: El frontend maneja:
   - Casteo de propiedades alternativas (ej: `driverName || name`)
   - Manejo de errores con notificaciones
   - Carga de datos en paralelo con manejo de fallos graceful

3. **Datos por Defecto**: Si algún endpoint falla, el dashboard mostrará valores vacíos sin bloquear la carga de otros datos.

4. **Campos Opcionales**: Los endpoints pueden incluir campos adicionales, pero deben contener al menos los campos especificados.

5. **Ordenamiento**: Se recomienda retornar los datos ordenados descendentemente por `count` para mostrar los "Top N" más relevantes.

---

## Ejemplo de Solicitud Completa

```bash
curl -X GET "http://localhost:8080/api/dashboard/stats" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```
