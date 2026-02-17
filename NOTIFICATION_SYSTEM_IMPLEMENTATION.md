# Sistema de Notificaciones en Tiempo Real - Implementación Completa

## ✅ Implementación Completada

Este documento resume la implementación completa del sistema de notificaciones en tiempo real para TUPACK.

## 📋 Backend (Java/Spring Boot)

### 1. Base de Datos ✅
- **Migración**: `V004__create_notifications_table.sql`
  - Tabla `notifications` con índices optimizados
  - Foreign key a tabla `users`
  - Soporte para JSON metadata

### 2. Modelo de Dominio ✅
- **NotificationType** (enum): 8 tipos de notificaciones
- **Notification** (entity): Entidad JPA con todos los campos
- **NotificationRepository**: Queries optimizadas con paginación

### 3. DTOs ✅
- `NotificationDTO`: Respuesta de notificación
- `CreateNotificationDTO`: Crear notificación
- `UnreadCountDTO`: Contador de no leídas

### 4. Servicios ✅
- **OneSignalService**: Envío de push notifications
  - `sendPushNotification()`: Push a un usuario
  - `sendPushNotificationToMultiple()`: Push a múltiples usuarios
  - Integración con API de OneSignal

- **NotificationService**: Lógica de negocio completa
  - `createNotification()`: Crear + enviar push
  - `createNotificationForMultipleUsers()`: Notificar múltiples
  - `getUserNotifications()`: Paginación
  - `getUnreadCount()`: Contador
  - `markAsRead()` / `markAllAsRead()`
  - `deleteNotification()` / `clearAllNotifications()`

### 5. REST API ✅
- **NotificationController**: 6 endpoints
  ```
  GET    /api/notification?page=0&size=20&unreadOnly=false
  GET    /api/notification/count/unread
  PATCH  /api/notification/{id}/read
  PATCH  /api/notification/read-all
  DELETE /api/notification/{id}
  DELETE /api/notification/clear-all
  ```

### 6. Event-Driven System ✅
- **OrderCreatedEvent**: Evento de orden creada
- **OrderStatusChangedEvent**: Evento de cambio de estado
- **OrderEventListener**: Listener asíncrono (@Async)
  - Notifica al creador cuando se crea orden
  - Notifica a todos los ADMINs
  - Notifica cambios de estado
  - Notifica al driver cuando se aprueba

### 7. Modificaciones en OrderService ✅
- **OrderPersistenceService**: Publica `OrderCreatedEvent`
- **OrderStatusService**: Publica `OrderStatusChangedEvent`
- **@EnableAsync**: Habilitado en aplicación principal

### 8. Configuración ✅
- **application.yml**: Config de OneSignal
  ```yaml
  application:
    onesignal:
      app-id: ${ONESIGNAL_APP_ID}
      rest-api-key: ${ONESIGNAL_REST_API_KEY}
  ```

## 🎨 Frontend (Next.js/React)

### 1. TypeScript Types ✅
- **notificationTypes.ts**: Interfaces y enums completos
  - `NotificationType` enum
  - `Notification` interface
  - `NotificationPage`, `UnreadCount`

### 2. API Client ✅
- **notificationApi.ts**: Todos los endpoints implementados
  - Sigue patrón de `orderApi.ts`
  - Usa `apiClient` centralizado

### 3. React Query Hooks ✅
- **useNotifications.ts**: Hooks completos con polling
  - `useNotifications()`: Lista con polling 30s
  - `useUnreadCount()`: Contador con polling 10s + sync Zustand
  - `useMarkAsRead()`: Optimistic updates
  - `useMarkAllAsRead()`, `useDeleteNotification()`, `useClearAllNotifications()`

### 4. Zustand Store ✅
- **notificationStore.ts**: Estado global del contador
  - `unreadCount`
  - `setUnreadCount()`, `incrementUnreadCount()`, etc.

### 5. OneSignal Integration ✅
- **useOneSignalListeners.ts**: Event listeners
  - Listener `foregroundWillDisplay`: Toast + invalidate queries
  - Listener `click`: Navegación a entidad relacionada
  - Auto-sync con Zustand

### 6. UI Components ✅
- **NotificationItem.tsx**: Item individual
  - Badge de color según tipo
  - Indicador de no leída (punto azul)
  - Fondo azul claro si no leída
  - Botón eliminar
  - Click para marcar como leída y navegar
  - Tiempo relativo con date-fns

- **NotificationMenu.tsx**: Dropdown menu
  - Header con título y badge contador
  - Botones "marcar todas" y "eliminar todas"
  - ScrollArea con lista (max height 400px)
  - Footer "Ver todas"
  - Integra todos los hooks

### 7. Integración en NavBar ✅
- **NavBar.tsx**: Reemplazado botón deshabilitado con `<NotificationMenu />`
- Removido código viejo (líneas 178-199)

### 8. OneSignal Init en BaseLayout ✅
- **BaseLayout.tsx**: Inicialización OneSignal
  - `OneSignal.init()` cuando hay usuario
  - `OneSignal.login(userId)` con external_user_id
  - Hook `useOneSignalListeners()` activo

## 🔄 Flujo de Datos Completo

### Ejemplo: Cliente crea orden

1. **Frontend**: Cliente hace POST `/api/order`
2. **Backend**: `OrderPersistenceService.persistOrder()`
   - Guarda orden en BD
   - Publica `OrderCreatedEvent`
3. **Backend**: `OrderEventListener.onOrderCreated()`
   - Crea notificación para cliente
   - Crea notificaciones para ADMINs
   - Envía push via OneSignal
4. **Frontend (Cliente)**:
   - OneSignal recibe push → Toast
   - `incrementUnreadCount()` → Badge +1
   - Polling detecta nueva notificación
5. **Frontend (Admin)**:
   - Polling (10s) detecta nueva → Badge +1
   - Abre menu → Ve "Nueva orden pendiente #123"

## 🧪 Pasos para Testing

### Backend

1. **Iniciar Backend**:
   ```bash
   cd /d/Proyectos/TUPACK/pallet-sorting-api
   ./mvnw spring-boot:run
   ```

2. **Verificar Migración**:
   - Conectar a MySQL
   - Verificar que tabla `notifications` existe
   - Verificar índices

3. **Probar Endpoints con Postman**:
   ```
   GET http://localhost:8080/api/notification
   GET http://localhost:8080/api/notification/count/unread
   ```

4. **Crear Orden y Verificar**:
   - Crear orden desde API
   - Verificar que se insertan notificaciones en BD
   - Verificar logs de OneSignal

### Frontend

1. **Instalar Dependencias** (si es necesario):
   ```bash
   npm install react-onesignal date-fns
   ```

2. **Iniciar Frontend**:
   ```bash
   npm run dev
   ```

3. **Login como CLIENT**:
   - Verificar console: "OneSignal initialized for user: X"
   - Crear una orden
   - Verificar:
     - Toast aparece
     - Badge muestra "1"
     - Abrir menu → ver notificación

4. **Login como ADMIN**:
   - Verificar badge muestra "1"
   - Abrir menu → ver "Nueva orden pendiente"
   - Click en notificación → navega a `/order/{id}`
   - Marcar como leída → badge decrementa

5. **Aprobar Orden (como ADMIN)**:
   - CLIENT recibe notificación "Orden aprobada"
   - DRIVER recibe notificación "Nueva orden asignada"

### OneSignal Push

1. **Verificar Service Worker**:
   - DevTools → Application → Service Workers
   - Verificar `OneSignalSDKWorker.js` registrado

2. **Probar Push Real**:
   - Crear orden desde otro dispositivo/pestaña
   - Verificar notificación del navegador aparece

## 🔧 Configuración Requerida

### Backend (.env o application-dev.yml)
```yaml
ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9
ONESIGNAL_REST_API_KEY=<TU_REST_API_KEY>
```

### Frontend (.env.local)
```
NEXT_PUBLIC_ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9
```

**IMPORTANTE**: Necesitas obtener el `ONESIGNAL_REST_API_KEY` desde el dashboard de OneSignal:
1. Ir a https://app.onesignal.com/
2. Seleccionar tu app
3. Settings → Keys & IDs
4. Copiar "REST API Key"

## 📊 Rendimiento

- **Polling intervals**:
  - Unread count: 10s (crítico)
  - Notifications list: 30s (moderado)
- **Índices de BD**: Optimizados para queries frecuentes
- **Paginación**: Default 20 items
- **React Query cache**:
  - staleTime: 30s (lista), 10s (contador)
  - gcTime: 10 minutos

## 🎯 Características Implementadas

✅ Notificaciones en BD persistentes
✅ Push notifications con OneSignal
✅ Polling con React Query (10s/30s)
✅ Event-driven (OrderCreatedEvent, OrderStatusChangedEvent)
✅ Optimistic updates en UI
✅ Badge con contador en tiempo real
✅ Menu dropdown funcional
✅ Marcar como leída / Eliminar
✅ Navegación a entidad relacionada
✅ Notificaciones para múltiples roles (CLIENT, ADMIN, DRIVER)
✅ Colores según tipo de notificación
✅ Tiempo relativo (hace X minutos)

## 🚀 Mejoras Futuras

### Fase 2
- Filtros por tipo de notificación
- Preferencias de usuario (silenciar tipos)
- Página dedicada de notificaciones (`/notifications`)
- Infinite scroll

### Fase 3
- WebSockets para latencia < 1s
- Email notifications
- Notificaciones grupales (broadcast)
- Estadísticas de notificaciones
- Cleanup job (eliminar > 30 días)

## 📝 Archivos Creados/Modificados

### Backend (15 archivos)
- ✅ V004__create_notifications_table.sql
- ✅ NotificationType.java
- ✅ Notification.java
- ✅ NotificationRepository.java
- ✅ NotificationDTO.java
- ✅ CreateNotificationDTO.java
- ✅ UnreadCountDTO.java
- ✅ OneSignalService.java
- ✅ NotificationService.java
- ✅ NotificationController.java
- ✅ OrderCreatedEvent.java
- ✅ OrderStatusChangedEvent.java
- ✅ OrderEventListener.java
- ✅ OrderPersistenceService.java (modificado)
- ✅ OrderStatusService.java (modificado)
- ✅ UserRepository.java (modificado)
- ✅ PalletSortingApiApplication.java (modificado)
- ✅ application.yml (modificado)

### Frontend (8 archivos)
- ✅ notificationTypes.ts
- ✅ notificationApi.ts
- ✅ useNotifications.ts
- ✅ notificationStore.ts
- ✅ useOneSignalListeners.ts
- ✅ NotificationItem.tsx
- ✅ NotificationMenu.tsx
- ✅ NavBar.tsx (modificado)
- ✅ BaseLayout.tsx (modificado)

## 🎉 Status: IMPLEMENTACIÓN COMPLETA

El sistema de notificaciones está 100% implementado y listo para testing.
