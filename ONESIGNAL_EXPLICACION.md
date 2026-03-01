# 🔔 OneSignal - Explicación Completa

## Índice
1. [¿Qué es OneSignal?](#qué-es-onesignal)
2. [Flujo Completo de una Notificación](#flujo-completo-de-una-notificación)
3. [Diagrama del Flujo](#diagrama-del-flujo)
4. [Conceptos Clave](#conceptos-clave)
5. [¿Por Qué Usar OneSignal?](#por-qué-usar-onesignal)
6. [Ejemplo Práctico Completo](#ejemplo-práctico-completo)
7. [Configuración Necesaria](#configuración-necesaria)
8. [Casos de Uso en TUPACK](#casos-de-uso-en-tupack)
9. [FAQ - Preguntas Frecuentes](#faq---preguntas-frecuentes)

---

## ¿Qué es OneSignal?

OneSignal es un **servicio de terceros (SaaS)** que maneja toda la infraestructura de push notifications. Actúa como un **intermediario** entre tu backend y los navegadores/dispositivos de los usuarios.

### Características principales:
- ✅ Soporte multi-plataforma (Web, iOS, Android, etc.)
- ✅ API REST simple para enviar notificaciones
- ✅ Gestión automática de tokens y dispositivos
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Segmentación avanzada de usuarios
- ✅ Reintentos automáticos en caso de fallo
- ✅ Plan gratuito generoso (hasta 10,000 usuarios)

---

## Flujo Completo de una Notificación

### 1️⃣ Registro Inicial del Usuario (Frontend)

Cuando un usuario hace login en TUPACK, el frontend ejecuta:

```typescript
// En BaseLayout.tsx
import OneSignal from "react-onesignal";

// Inicializar OneSignal SDK
await OneSignal.init({
  appId: "cc79af88-2135-4f63-a116-8587053ed0a9",
  allowLocalhostAsSecureOrigin: true
});

// Registrar usuario con su ID
await OneSignal.login(String(user.id)); // Ej: "123"
```

#### ¿Qué pasa internamente?

1. **OneSignal SDK** se comunica con los **servidores de OneSignal**
2. Le dice: *"Este navegador pertenece al usuario con ID 123"*
3. OneSignal genera un **Player ID** único para este navegador específico
4. OneSignal crea el mapeo:
   ```
   external_user_id: "123" → player_id: "abc-xyz-789"
   ```
5. El navegador queda **suscrito** para recibir notificaciones

#### Service Worker

OneSignal instala automáticamente un **Service Worker** (`OneSignalSDKWorker.js`) en el navegador que:
- Corre en segundo plano 24/7
- Puede recibir notificaciones **incluso si la pestaña está cerrada**
- Solo requiere que el navegador esté abierto

**Verificar instalación:**
```
DevTools → Application → Service Workers → OneSignalSDKWorker.js
```

---

### 2️⃣ Creación de Orden (Backend)

Cuando un cliente crea una orden en TUPACK:

```java
// OrderPersistenceService.java
@Transactional
public Order persistOrder(Order order, String packingType, SolvePackingRequest request) {
    // 1. Guardar orden en base de datos
    Order savedOrder = orderRepository.save(order);

    // 2. Registrar estado inicial
    orderStatusService.recordStatus(savedOrder);

    // 3. Guardar pallets/bulks...
    savePallets(request, savedOrder);

    // 4. 🚀 PUBLICAR EVENTO
    eventPublisher.publishEvent(new OrderCreatedEvent(this, savedOrder));
    log.info("Published OrderCreatedEvent for order: {}", savedOrder.getId());

    return savedOrder;
}
```

**Nota importante**: El evento se publica de forma **asíncrona** gracias a `@EnableAsync`, por lo que no bloquea la respuesta al cliente.

---

### 3️⃣ Listener Recibe Evento (Backend)

El listener procesa el evento de forma asíncrona:

```java
// OrderEventListener.java
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final NotificationService notificationService;

    @Async  // ← Procesamiento asíncrono
    @EventListener
    public void onOrderCreated(OrderCreatedEvent event) {
        try {
            var order = event.getOrder();
            log.info("Order created event received for order: {}", order.getId());

            // 1. Notificar al creador de la orden
            if (order.getCreatedBy() != null) {
                CreateNotificationDTO creatorNotification = CreateNotificationDTO.builder()
                    .title("Orden Creada")
                    .message("Tu orden #" + order.getId() + " ha sido creada exitosamente")
                    .type(NotificationType.ORDER_CREATED)
                    .relatedEntityType("ORDER")
                    .relatedEntityId(order.getId())
                    .userId(order.getCreatedBy()) // ID del usuario creador
                    .metadata(buildOrderMetadata(order))
                    .build();

                // 🔥 AQUÍ SE ENVÍA LA NOTIFICACIÓN
                notificationService.createNotification(creatorNotification);
            }

            // 2. Notificar a todos los ADMINs
            List<String> adminIds = notificationService.getUserIdsByRole("ROLE_ADMIN");
            if (!adminIds.isEmpty()) {
                CreateNotificationDTO adminNotification = CreateNotificationDTO.builder()
                    .title("Nueva Orden Pendiente")
                    .message("Nueva orden #" + order.getId() + " requiere aprobación")
                    .type(NotificationType.ORDER_CREATED)
                    .relatedEntityType("ORDER")
                    .relatedEntityId(order.getId())
                    .metadata(buildOrderMetadata(order))
                    .build();

                notificationService.createNotificationForMultipleUsers(adminIds, adminNotification);
            }

            log.info("Notifications sent for order created: {}", order.getId());
        } catch (Exception e) {
            log.error("Error processing OrderCreatedEvent: {}", e.getMessage(), e);
        }
    }
}
```

---

### 4️⃣ Backend Envía Push a OneSignal

```java
// NotificationService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final OneSignalService oneSignalService;

    @Transactional
    public NotificationDTO createNotification(CreateNotificationDTO dto) {
        // 1. Crear notificación en base de datos
        Notification notification = Notification.builder()
                .title(dto.getTitle())
                .message(dto.getMessage())
                .type(dto.getType())
                .relatedEntityType(dto.getRelatedEntityType())
                .relatedEntityId(dto.getRelatedEntityId())
                .userId(dto.getUserId())
                .isRead(false)
                .metadata(dto.getMetadata())
                .build();

        Notification saved = notificationRepository.save(notification);

        // 2. 🚀 ENVIAR PUSH NOTIFICATION VIA ONESIGNAL
        Map<String, Object> pushData = new HashMap<>();
        if (dto.getRelatedEntityType() != null) {
            pushData.put("entityType", dto.getRelatedEntityType());
        }
        if (dto.getRelatedEntityId() != null) {
            pushData.put("entityId", dto.getRelatedEntityId());
        }

        oneSignalService.sendPushNotification(
            dto.getUserId(),    // "456" (external_user_id)
            dto.getTitle(),     // "Orden Creada"
            dto.getMessage(),   // "Tu orden #123 ha sido creada exitosamente"
            pushData            // { entityType: "ORDER", entityId: "123" }
        );

        log.info("Notification created for user: {}", dto.getUserId());
        return toDTO(saved);
    }
}
```

#### OneSignalService - La Magia Ocurre Aquí

```java
// OneSignalService.java
@Service
@Slf4j
public class OneSignalService {

    private static final String ONESIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

    @Value("${application.onesignal.app-id}")
    private String appId;

    @Value("${application.onesignal.rest-api-key}")
    private String restApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Enviar push notification a un usuario usando external_user_id
     */
    public void sendPushNotification(String userId, String title, String message, Map<String, Object> data) {
        try {
            if (restApiKey == null || restApiKey.isEmpty()) {
                log.warn("OneSignal REST API key not configured. Skipping push notification.");
                return;
            }

            // 1. Construir payload para OneSignal API
            Map<String, Object> payload = new HashMap<>();
            payload.put("app_id", appId);

            // 🔑 CLAVE: Usar external_user_id en lugar de player_id
            payload.put("include_external_user_ids", List.of(userId)); // ["456"]

            // Título de la notificación
            Map<String, String> headings = new HashMap<>();
            headings.put("en", title);
            payload.put("headings", headings);

            // Contenido de la notificación
            Map<String, String> contents = new HashMap<>();
            contents.put("en", message);
            payload.put("contents", contents);

            // Datos adicionales (para navegación)
            if (data != null && !data.isEmpty()) {
                payload.put("data", data);
            }

            // 2. Configurar headers HTTP
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + restApiKey);

            // 3. 🌐 HACER HTTP POST A ONESIGNAL
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForObject(ONESIGNAL_API_URL, request, Map.class);

            log.info("Push notification sent to user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending push notification to user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Enviar push notification a múltiples usuarios
     */
    public void sendPushNotificationToMultiple(List<String> userIds, String title, String message, Map<String, Object> data) {
        try {
            if (restApiKey == null || restApiKey.isEmpty()) {
                log.warn("OneSignal REST API key not configured. Skipping push notification.");
                return;
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("app_id", appId);
            payload.put("include_external_user_ids", userIds); // ["123", "456", "789"]

            Map<String, String> headings = new HashMap<>();
            headings.put("en", title);
            payload.put("headings", headings);

            Map<String, String> contents = new HashMap<>();
            contents.put("en", message);
            payload.put("contents", contents);

            if (data != null && !data.isEmpty()) {
                payload.put("data", data);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + restApiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForObject(ONESIGNAL_API_URL, request, Map.class);

            log.info("Push notification sent to {} users", userIds.size());
        } catch (Exception e) {
            log.error("Error sending push notification to multiple users: {}", e.getMessage());
        }
    }
}
```

#### Ejemplo de Payload Enviado a OneSignal

```json
POST https://onesignal.com/api/v1/notifications
Authorization: Basic OS_YOUR_REST_API_KEY
Content-Type: application/json

{
  "app_id": "cc79af88-2135-4f63-a116-8587053ed0a9",
  "include_external_user_ids": ["456"],
  "headings": {
    "en": "Orden Creada"
  },
  "contents": {
    "en": "Tu orden #123 ha sido creada exitosamente"
  },
  "data": {
    "entityType": "ORDER",
    "entityId": "123"
  }
}
```

---

### 5️⃣ OneSignal Procesa la Notificación

**En los servidores de OneSignal** (esto ocurre automáticamente):

1. **Recibe el HTTP POST** del backend de TUPACK
2. **Valida** el `app_id` y `rest_api_key`
3. **Busca en su base de datos**:
   ```sql
   SELECT player_ids
   FROM subscriptions
   WHERE app_id = 'cc79af88-...'
     AND external_user_id = '456'
     AND active = true
   ```
4. **Encuentra** todos los dispositivos registrados del usuario:
   ```
   - Chrome en Windows → player_id: "abc-123"
   - Safari en iPhone → player_id: "xyz-789"
   - Firefox en Mac → player_id: "def-456"
   ```
5. **Envía la notificación** a través de los servicios nativos correspondientes:
   - **Web Push API** (para Chrome, Firefox, Edge)
   - **Firebase Cloud Messaging - FCM** (para Android)
   - **Apple Push Notification Service - APNs** (para iOS/Safari)
6. **Registra estadísticas**:
   - Enviadas: 3
   - Entregadas: 2 (Safari estaba offline)
   - Clicks: 0 (aún no ha hecho click)

---

### 6️⃣ El Navegador Recibe la Notificación

#### Caso A: Usuario está en la aplicación (foreground)

```typescript
// useOneSignalListeners.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useNotificationStore } from "@/lib/store/notificationStore";
import OneSignal from "react-onesignal";

export function useOneSignalListeners() {
  const queryClient = useQueryClient();
  const { incrementUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Listener: Notificación recibida en foreground
    const handleForegroundNotification = (event: any) => {
      const notification = event.notification;

      // 1. 🎨 Mostrar toast de Mantine
      notifications.show({
        title: notification.title,      // "Orden Creada"
        message: notification.body,     // "Tu orden #123..."
        color: "blue",
        autoClose: 5000,
      });

      // 2. 📊 Invalidar queries para refrescar lista
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // 3. 🔔 Incrementar contador en badge
      incrementUnreadCount(); // 0 → 1
    };

    // Registrar listener
    OneSignal.Notifications?.addEventListener(
      "foregroundWillDisplay",
      handleForegroundNotification
    );

    // Cleanup
    return () => {
      OneSignal.Notifications?.removeEventListener(
        "foregroundWillDisplay",
        handleForegroundNotification
      );
    };
  }, [queryClient, incrementUnreadCount]);
}
```

**Resultado visual:**
- ✅ Toast aparece en la esquina superior derecha
- ✅ Badge del botón de notificaciones cambia de `0` a `1`
- ✅ La lista de notificaciones se actualiza automáticamente

#### Caso B: Usuario NO está en la aplicación (background)

Si el navegador está:
- ✅ Abierto pero en otra pestaña
- ✅ Minimizado
- ✅ En segundo plano

**Aparece una notificación NATIVA del navegador:**

```
┌─────────────────────────────────────┐
│  🔵 TUPACK                          │
│                                     │
│  Orden Creada                       │
│  Tu orden #123 ha sido creada...   │
│                                     │
│  hace 2 segundos                    │
└─────────────────────────────────────┘
```

Esta notificación:
- Es manejada por el **Service Worker**
- Aparece como las de Gmail, WhatsApp, etc.
- Funciona **incluso con la pestaña cerrada** (pero el navegador abierto)

---

### 7️⃣ Usuario Hace Click en la Notificación

```typescript
// useOneSignalListeners.ts
useEffect(() => {
  // Listener: Click en notificación
  const handleNotificationClick = (event: any) => {
    const notification = event.notification;
    const data = notification.additionalData;

    // 🧭 Navegación basada en los datos enviados desde el backend
    if (data?.entityType === "ORDER" && data?.entityId) {
      // Navegar a la orden específica
      window.location.href = `/order/${data.entityId}`; // /order/123
    }
  };

  OneSignal.Notifications?.addEventListener("click", handleNotificationClick);

  return () => {
    OneSignal.Notifications?.removeEventListener("click", handleNotificationClick);
  };
}, []);
```

**Flujo completo:**
1. Usuario ve la notificación nativa
2. Usuario hace click en ella
3. El navegador abre/enfoca la pestaña de TUPACK
4. El listener detecta el click
5. Navega automáticamente a `/order/123`
6. OneSignal registra el click en sus estadísticas

---

## Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUJO COMPLETO - ONESIGNAL                      │
└─────────────────────────────────────────────────────────────────────────┘

1. REGISTRO INICIAL (una sola vez por dispositivo)
   ┌─────────────┐
   │   CLIENTE   │ Login
   │  (Browser)  │────────────────────┐
   └─────────────┘                    │
                                      │ OneSignal.login("123")
                                      ▼
                           ┌──────────────────────┐
                           │  ONESIGNAL SERVERS   │
                           │  Mapeo:              │
                           │  "123" → "abc-xyz"   │
                           └──────────────────────┘


2. CREACIÓN DE ORDEN
   ┌─────────────┐
   │   CLIENTE   │ Crea orden
   │  (Browser)  │────────────────┐
   └─────────────┘                │
                                  │ POST /api/order
                                  ▼
                       ┌──────────────────────┐
                       │  BACKEND (TUPACK)    │
                       │  OrderService        │
                       │  - Guarda en BD      │
                       └──────────┬───────────┘
                                  │
                       Publica OrderCreatedEvent
                                  │
                                  ▼


3. PROCESAMIENTO DE EVENTO
                       ┌──────────────────────┐
                       │  OrderEventListener  │
                       │  @Async              │
                       │  - Crea en BD        │
                       └──────────┬───────────┘
                                  │
                       NotificationService.createNotification()
                                  │
                                  ▼


4. ENVÍO A ONESIGNAL
                       ┌──────────────────────┐
                       │  OneSignalService    │
                       │  HTTP POST           │
                       └──────────┬───────────┘
                                  │
    POST https://onesignal.com/api/v1/notifications
    Authorization: Basic REST_API_KEY
    {
      "app_id": "cc79af88-...",
      "include_external_user_ids": ["123"],
      "headings": { "en": "Orden Creada" },
      "contents": { "en": "Tu orden #123..." },
      "data": { "entityType": "ORDER", "entityId": "123" }
    }
                                  │
                                  ▼


5. PROCESAMIENTO EN ONESIGNAL
                       ┌──────────────────────┐
                       │  ONESIGNAL SERVERS   │
                       │  - Busca "123"       │
                       │  - Encuentra 3 devs  │
                       │  - Envía a c/u       │
                       └──────────┬───────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
   Web Push API          Firebase Cloud Msg        Apple Push (APNs)
   (Chrome/Firefox)           (Android)              (iOS/Safari)


6. RECEPCIÓN EN NAVEGADOR
                       ┌──────────────────────┐
                       │   CLIENTE (Browser)  │
                       │   Service Worker     │
                       └──────────┬───────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
   FOREGROUND              BACKGROUND               NOTIFICATION CLICK
   - Toast Mantine         - Notif nativa          - Navega a /order/123
   - Badge +1              - Aparece popup          - Marca como leída
   - Lista actualizada     - Service Worker         - OneSignal stats++
```

---

## Conceptos Clave

### 🔑 external_user_id

**¿Qué es?**
- Es **TU** ID del usuario en el sistema TUPACK
- Ejemplo: `"456"` (el ID de la tabla `users` en MySQL)
- Lo defines tú cuando haces `OneSignal.login(userId)`

**¿Para qué sirve?**
- Permite enviar notificaciones sin conocer el `player_id` interno de OneSignal
- Facilita la integración: solo necesitas tu ID de usuario

**Ejemplo:**
```typescript
// Frontend
await OneSignal.login("456"); // Tu ID de usuario
```

```java
// Backend
oneSignalService.sendPushNotification(
    "456",  // ← external_user_id
    "Orden Aprobada",
    "Tu orden ha sido aprobada"
);
```

OneSignal automáticamente traduce `"456"` → todos los `player_ids` asociados.

---

### 🎯 player_id

**¿Qué es?**
- Es el ID **interno de OneSignal** para cada dispositivo/navegador específico
- Generado automáticamente por OneSignal
- Ejemplo: `"abc-xyz-123-def-789"`

**Relación con external_user_id:**
```
external_user_id: "456" (un usuario)
    ├─ player_id: "abc-123" (Chrome en Windows)
    ├─ player_id: "xyz-789" (Safari en iPhone)
    └─ player_id: "def-456" (Firefox en Mac)
```

**¿Cuándo usarlo?**
- Casi nunca en TUPACK
- OneSignal lo maneja internamente
- Solo lo verías en el dashboard de OneSignal

---

### 🛠️ Service Worker

**¿Qué es?**
- Script JavaScript que corre en **segundo plano** en el navegador
- Independiente de la página web
- Puede ejecutarse incluso con la pestaña cerrada

**Características:**
- ✅ Recibe notificaciones push 24/7
- ✅ Funciona offline
- ✅ No tiene acceso al DOM
- ✅ Se ejecuta en un thread separado

**En TUPACK:**
```javascript
// OneSignalSDKWorker.js (instalado automáticamente)
self.addEventListener('push', function(event) {
  // Recibe notificación
  const data = event.data.json();

  // Muestra notificación nativa
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/icon.png',
    badge: '/badge.png',
    data: data.additionalData
  });
});

self.addEventListener('notificationclick', function(event) {
  // Usuario hizo click
  event.notification.close();

  // Abrir/enfocar la aplicación
  clients.openWindow('/order/' + event.notification.data.entityId);
});
```

**Verificar en DevTools:**
```
Chrome DevTools → Application → Service Workers

Estado: Activated and running
Script: OneSignalSDKWorker.js
Scope: https://tupack.com/
```

---

### 📡 Web Push API

**¿Qué es?**
- API estándar del navegador para recibir push notifications
- Soportada por Chrome, Firefox, Edge, Safari (desde iOS 16.4)

**¿Cómo funciona?**
1. Usuario da permiso para recibir notificaciones
2. Navegador genera un **endpoint único** (URL)
3. OneSignal registra este endpoint
4. Cuando llega una notificación, OneSignal hace POST al endpoint
5. Service Worker del navegador la procesa

**Permisos:**
```javascript
// El usuario ve este popup:
┌──────────────────────────────────────┐
│  tupack.com quiere                   │
│  Mostrar notificaciones              │
│                                      │
│  [Bloquear]  [Permitir]              │
└──────────────────────────────────────┘
```

---

## ¿Por Qué Usar OneSignal?

### ❌ Opción 1: Sin OneSignal (implementación directa)

**Arquitectura:**
```
BACKEND TUPACK
    ├─→ Web Push API (para Chrome/Firefox)
    ├─→ Firebase Cloud Messaging (para Android)
    ├─→ Apple Push Notification Service (para iOS)
    └─→ ... otros servicios
```

**Problemas:**
- ❌ Debes implementar integración con 3+ servicios diferentes
- ❌ Gestionar tokens de cada dispositivo manualmente
- ❌ Manejar reintentos y errores por ti mismo
- ❌ Mantener base de datos de dispositivos
- ❌ Configurar certificados SSL para APNs
- ❌ Gestionar expiración de tokens
- ❌ Implementar estadísticas desde cero

**Código necesario (estimado):**
```java
// Web Push API
WebPushService webPushService = new WebPushService();
webPushService.send(endpoint, payload, vapidKeys);

// FCM para Android
FirebaseMessaging.getInstance().send(message);

// APNs para iOS
ApnsClient apnsClient = new ApnsClient(cert, password);
apnsClient.send(pushNotification);

// Gestionar tokens
deviceTokenRepository.save(token);
deviceTokenRepository.findExpired().forEach(this::delete);

// Estadísticas
notificationStatsRepository.save(stats);
```

**Tiempo de desarrollo:** 2-4 semanas

---

### ✅ Opción 2: Con OneSignal

**Arquitectura:**
```
BACKEND TUPACK
    └─→ OneSignal API (1 endpoint)
            └─→ OneSignal se encarga de:
                ├─→ Web Push API
                ├─→ FCM
                ├─→ APNs
                └─→ Estadísticas, reintentos, etc.
```

**Ventajas:**
- ✅ **Una sola API**: Un endpoint para todo
- ✅ **Gestión automática**: OneSignal maneja tokens, expiración, etc.
- ✅ **Reintentos automáticos**: Si falla, OneSignal reintenta
- ✅ **Dashboard con estadísticas**: Enviadas, entregadas, clicks
- ✅ **Segmentación**: Enviar a usuarios por tags, localización, etc.
- ✅ **A/B Testing**: Probar diferentes mensajes
- ✅ **Scheduling**: Programar notificaciones futuras
- ✅ **In-App Messages**: Mensajes dentro de la app
- ✅ **Email & SMS**: Canales adicionales
- ✅ **Plantillas**: Reutilizar diseños

**Código necesario:**
```java
// ¡Solo esto!
oneSignalService.sendPushNotification(
    userId,
    title,
    message,
    data
);
```

**Tiempo de desarrollo:** 1-2 días

---

### 💰 Costo Comparativo

| Concepto | Sin OneSignal | Con OneSignal |
|----------|---------------|---------------|
| Desarrollo inicial | $8,000 - $15,000 | $500 - $1,000 |
| Infraestructura mensual | $100 - $300 | $0 (plan gratuito) |
| Mantenimiento mensual | $1,000 - $2,000 | $0 |
| Tiempo al mercado | 2-4 semanas | 1-2 días |
| **TOTAL (primer año)** | **$20,200 - $42,600** | **$500 - $1,000** |

---

### 📊 Plan Gratuito de OneSignal

**Límites del plan gratuito:**
- ✅ **10,000 usuarios** registrados
- ✅ **Notificaciones ilimitadas**
- ✅ **Todos los canales** (Web, Mobile, Email, SMS*)
- ✅ **Segmentación básica**
- ✅ **Estadísticas completas**
- ✅ **API completa**

*SMS tiene cargos adicionales

**Para TUPACK:**
- Si tienes < 10,000 usuarios → **100% gratis**
- Si superas 10,000 → Plan Growth ($9/mes) o Professional ($99/mes)

---

## Ejemplo Práctico Completo

### Escenario: Admin aprueba orden #123 creada por usuario ID 456

#### 1. Admin aprueba la orden (Frontend)

```typescript
// Frontend - OrderDetailsPage.tsx
const handleApprove = async () => {
  await updateOrderStatus.mutateAsync({
    orderId: "123",
    status: "APPROVED"
  });
};
```

---

#### 2. Backend actualiza el estado (OrderStatusService)

```java
// OrderStatusService.java
@Transactional
public GenericResponse updateOrderStatus(Long orderId, String status) {
    // 1. Buscar orden
    Order order = orderRepository.getOrderById(orderId)
        .orElseThrow(() -> new OrderNotFoundException(orderId));

    // 2. Guardar estado anterior
    OrderStatus oldStatus = order.getOrderStatus();

    // 3. Actualizar a APPROVED
    OrderStatus newStatus = OrderStatus.valueOf(status); // APPROVED
    order.setOrderStatus(newStatus);

    // 4. Guardar en BD
    orderRepository.save(order);
    recordStatus(order);

    // 5. 🚀 PUBLICAR EVENTO
    eventPublisher.publishEvent(
        new OrderStatusChangedEvent(this, order, oldStatus, newStatus)
    );

    log.info("Published OrderStatusChangedEvent for order: {} from {} to {}",
             orderId, oldStatus, newStatus);

    return GenericResponse.success("Order status updated successfully");
}
```

---

#### 3. Listener procesa el evento (OrderEventListener)

```java
// OrderEventListener.java
@Async
@EventListener
public void onOrderStatusChanged(OrderStatusChangedEvent event) {
    try {
        var order = event.getOrder();
        var newStatus = event.getNewStatus(); // APPROVED

        log.info("Order status changed event received for order: {} to status: {}",
                 order.getId(), newStatus);

        // Determinar tipo de notificación
        NotificationType notificationType = NotificationType.ORDER_APPROVED;
        String title = "Orden Aprobada";
        String message = "Tu orden #" + order.getId() + " ha sido aprobada";

        // 1. Notificar al creador de la orden (usuario 456)
        if (order.getCreatedBy() != null) {
            CreateNotificationDTO creatorNotification = CreateNotificationDTO.builder()
                .title(title)
                .message(message)
                .type(notificationType)
                .relatedEntityType("ORDER")
                .relatedEntityId(order.getId())
                .userId(order.getCreatedBy()) // "456"
                .metadata(buildOrderMetadata(order))
                .build();

            // 🔥 ENVIAR NOTIFICACIÓN AL CREADOR
            notificationService.createNotification(creatorNotification);
        }

        // 2. Si hay driver asignado, notificarlo también
        if (newStatus == OrderStatus.APPROVED && order.getDriver() != null) {
            CreateNotificationDTO driverNotification = CreateNotificationDTO.builder()
                .title("Nueva Orden Asignada")
                .message("Se te ha asignado la orden #" + order.getId())
                .type(NotificationType.ORDER_APPROVED)
                .relatedEntityType("ORDER")
                .relatedEntityId(order.getId())
                .userId(String.valueOf(order.getDriver().getId()))
                .metadata(buildOrderMetadata(order))
                .build();

            // 🔥 ENVIAR NOTIFICACIÓN AL DRIVER
            notificationService.createNotification(driverNotification);
        }

        log.info("Notifications sent for order status change: {}", order.getId());
    } catch (Exception e) {
        log.error("Error processing OrderStatusChangedEvent: {}", e.getMessage(), e);
    }
}
```

---

#### 4. NotificationService guarda y envía (NotificationService)

```java
// NotificationService.java
@Transactional
public NotificationDTO createNotification(CreateNotificationDTO dto) {
    // 1. Crear y guardar en BD
    Notification notification = Notification.builder()
        .title(dto.getTitle())          // "Orden Aprobada"
        .message(dto.getMessage())      // "Tu orden #123 ha sido aprobada"
        .type(dto.getType())            // ORDER_APPROVED
        .relatedEntityType("ORDER")
        .relatedEntityId("123")
        .userId("456")                  // external_user_id
        .isRead(false)
        .metadata(dto.getMetadata())
        .build();

    Notification saved = notificationRepository.save(notification);

    // 2. 🚀 ENVIAR PUSH VIA ONESIGNAL
    Map<String, Object> pushData = new HashMap<>();
    pushData.put("entityType", "ORDER");
    pushData.put("entityId", "123");

    oneSignalService.sendPushNotification(
        "456",                          // userId (external_user_id)
        "Orden Aprobada",               // title
        "Tu orden #123 ha sido aprobada", // message
        pushData                        // { entityType: "ORDER", entityId: "123" }
    );

    log.info("Notification created and push sent for user: 456");
    return toDTO(saved);
}
```

---

#### 5. OneSignalService hace HTTP POST (OneSignalService)

```java
// OneSignalService.java
public void sendPushNotification(String userId, String title, String message, Map<String, Object> data) {
    // Construir payload
    Map<String, Object> payload = new HashMap<>();
    payload.put("app_id", "cc79af88-2135-4f63-a116-8587053ed0a9");
    payload.put("include_external_user_ids", List.of("456"));
    payload.put("headings", Map.of("en", "Orden Aprobada"));
    payload.put("contents", Map.of("en", "Tu orden #123 ha sido aprobada"));
    payload.put("data", Map.of("entityType", "ORDER", "entityId", "123"));

    // Configurar autenticación
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Basic " + restApiKey);

    // 🌐 HACER HTTP POST A ONESIGNAL
    HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

    ResponseEntity<Map> response = restTemplate.postForObject(
        "https://onesignal.com/api/v1/notifications",
        request,
        Map.class
    );

    log.info("OneSignal response: {}", response);
    // Response: { "id": "notif-uuid", "recipients": 1 }
}
```

**Payload JSON enviado:**
```json
POST https://onesignal.com/api/v1/notifications
Authorization: Basic OS_YOUR_REST_API_KEY
Content-Type: application/json

{
  "app_id": "cc79af88-2135-4f63-a116-8587053ed0a9",
  "include_external_user_ids": ["456"],
  "headings": {
    "en": "Orden Aprobada"
  },
  "contents": {
    "en": "Tu orden #123 ha sido aprobada"
  },
  "data": {
    "entityType": "ORDER",
    "entityId": "123"
  }
}
```

---

#### 6. OneSignal procesa y envía (Servidores de OneSignal)

```
ONESIGNAL SERVERS

1. Validar request
   ✓ app_id válido
   ✓ Authorization válida
   ✓ Payload correcto

2. Buscar dispositivos
   Query DB: SELECT player_ids
            FROM subscriptions
            WHERE app_id = 'cc79af88-...'
              AND external_user_id = '456'
              AND active = true

   Resultado:
   ├─ player_id: "abc-123" (Chrome Windows, online)
   ├─ player_id: "xyz-789" (Safari iPhone, offline)
   └─ player_id: "def-456" (Firefox Mac, online)

3. Enviar a cada dispositivo
   - Chrome Windows → Web Push API → ✓ Entregada
   - Safari iPhone → APNs → ⏳ Pendiente (dispositivo offline)
   - Firefox Mac → Web Push API → ✓ Entregada

4. Registrar estadísticas
   ├─ Enviadas: 3
   ├─ Entregadas: 2
   ├─ Pendientes: 1
   └─ Clicks: 0

5. Responder a TUPACK
   HTTP 200 OK
   {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "recipients": 2
   }
```

---

#### 7. Frontend recibe la notificación (Usuario 456 en Chrome)

```typescript
// useOneSignalListeners.ts - Hook ejecutándose en background

// El Service Worker detecta la notificación entrante
OneSignal.Notifications?.addEventListener("foregroundWillDisplay", (event) => {
  const notification = event.notification;

  console.log("📩 Notificación recibida:");
  console.log("  Title:", notification.title);        // "Orden Aprobada"
  console.log("  Body:", notification.body);          // "Tu orden #123..."
  console.log("  Data:", notification.additionalData); // { entityType: "ORDER", entityId: "123" }

  // 1. 🎨 Mostrar toast de Mantine
  notifications.show({
    title: "Orden Aprobada",
    message: "Tu orden #123 ha sido aprobada",
    color: "green",
    autoClose: 5000,
    icon: <IconCheck />
  });

  // 2. 📊 Refrescar datos
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
  queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });

  // 3. 🔔 Actualizar badge
  incrementUnreadCount(); // Zustand store: 0 → 1
});
```

**Resultado visual en pantalla:**

```
┌───────────────────────────────────────┐
│  ✓ Orden Aprobada                     │
│  Tu orden #123 ha sido aprobada       │
└───────────────────────────────────────┘

NavBar:
  [🔔 1]  ← Badge ahora muestra "1"
```

---

#### 8. Usuario hace click en la notificación

```typescript
// useOneSignalListeners.ts

OneSignal.Notifications?.addEventListener("click", (event) => {
  const notification = event.notification;
  const data = notification.additionalData;

  console.log("👆 Usuario hizo click en notificación");
  console.log("  Data:", data); // { entityType: "ORDER", entityId: "123" }

  // 🧭 Navegar a la orden
  if (data?.entityType === "ORDER" && data?.entityId) {
    window.location.href = `/order/${data.entityId}`;
    // Navega a: http://localhost:3000/order/123
  }
});
```

**Flujo completo:**
1. Usuario ve el toast: "Orden Aprobada"
2. Usuario hace click en él
3. El listener detecta el click
4. Navega automáticamente a `/order/123`
5. La página de detalles de la orden se abre
6. OneSignal registra +1 click en estadísticas

---

#### 9. Estadísticas en OneSignal Dashboard

```
OneSignal Dashboard
https://app.onesignal.com/apps/cc79af88-.../notifications

Notificación: "Orden Aprobada - 17/02/2026 14:30"
├─ 📤 Enviadas: 3
├─ ✓ Entregadas: 2 (66.7%)
├─ 👆 Clicks: 1 (50% CTR)
├─ ⏱️ Tiempo promedio de entrega: 0.8s
└─ 📊 Plataformas:
    ├─ Web (Chrome): 1 entregada, 1 click
    ├─ Web (Firefox): 1 entregada, 0 clicks
    └─ iOS (Safari): 0 entregadas (offline)
```

---

### Resultado Final

**Base de datos TUPACK (tabla `notifications`):**
```sql
SELECT * FROM notifications WHERE user_id = '456' ORDER BY created_at DESC LIMIT 1;

| id  | title           | message                          | type            | user_id | is_read | created_at          |
|-----|-----------------|----------------------------------|-----------------|---------|---------|---------------------|
| 842 | Orden Aprobada  | Tu orden #123 ha sido aprobada   | ORDER_APPROVED  | 456     | false   | 2026-02-17 14:30:15 |
```

**OneSignal Dashboard:**
```
Notification ID: 550e8400-e29b-41d4-a716-446655440000
Status: Delivered
Recipients: 2/3
Clicks: 1
CTR: 50%
```

**Frontend (Browser del usuario 456):**
```
✓ Toast mostrado
✓ Badge: 1 notificación nueva
✓ Lista de notificaciones actualizada
✓ Navegó a /order/123
```

---

## Configuración Necesaria

### 🔧 Backend Configuration

**Archivo: `application.yml`**
```yaml
application:
  onesignal:
    app-id: ${ONESIGNAL_APP_ID:cc79af88-2135-4f63-a116-8587053ed0a9}
    rest-api-key: ${ONESIGNAL_REST_API_KEY}
```

**Variables de entorno (`.env` o sistema):**
```bash
# OneSignal App ID (público)
ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9

# OneSignal REST API Key (PRIVADO - NO COMPARTIR)
ONESIGNAL_REST_API_KEY=os_v2_app_xxxxxxxxxxxxxxxxxxxxxxxxx
```

**¿Dónde obtener el REST API Key?**
1. Ir a https://app.onesignal.com/
2. Seleccionar tu aplicación
3. Settings → Keys & IDs
4. Copiar **"REST API Key"**

⚠️ **IMPORTANTE**: El REST API Key es **secreto**. NUNCA lo expongas en:
- Frontend
- Repositorio Git (usar variables de entorno)
- Código cliente

---

### 🎨 Frontend Configuration

**Archivo: `.env.local`**
```bash
# OneSignal App ID (público - es seguro exponerlo)
NEXT_PUBLIC_ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9
```

**Inicialización en BaseLayout:**
```typescript
// src/components/layouts/BaseLayout.tsx
import OneSignal from "react-onesignal";

useEffect(() => {
  if (user?.id) {
    const initOneSignal = async () => {
      try {
        // Inicializar SDK
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true, // Solo para desarrollo
        });

        // Login con external_user_id
        await OneSignal.login(String(user.id));

        console.log("✅ OneSignal initialized for user:", user.id);
      } catch (error) {
        console.error("❌ Failed to initialize OneSignal:", error);
      }
    };

    initOneSignal();
  }
}, [user?.id]);
```

---

### 🌐 Configuración Web (OneSignal Dashboard)

1. **Crear aplicación en OneSignal:**
   - Ir a https://app.onesignal.com/
   - Click en "New App/Website"
   - Nombre: "TUPACK Pallet Sorting"
   - Plataforma: Web Push
   - Click "Next"

2. **Configurar sitio web:**
   - Site Name: "TUPACK"
   - Site URL: `https://tupack.com` (o `http://localhost:3000` para desarrollo)
   - Auto Resubscribe: Enabled
   - Default Notification Icon: (subir logo)
   - Click "Save"

3. **Configurar permisos:**
   - Prompt Settings → Permission Prompt
   - Tipo: "Slide Prompt" (menos intrusivo)
   - Mensaje: "Recibe notificaciones de tus órdenes"
   - Click "Save"

4. **Obtener credenciales:**
   - Settings → Keys & IDs
   - Copiar:
     - ✅ App ID: `cc79af88-2135-4f63-a116-8587053ed0a9`
     - ✅ REST API Key: `os_v2_app_xxxxx...`

---

## Casos de Uso en TUPACK

### 1. Cliente Crea Orden

**Trigger:** `OrderCreatedEvent`

**Notificaciones enviadas:**
- ✉️ **Al creador (CLIENT)**:
  - Título: "Orden Creada"
  - Mensaje: "Tu orden #123 ha sido creada exitosamente"
  - Tipo: `ORDER_CREATED`
  - Color: Azul

- ✉️ **A todos los ADMINs**:
  - Título: "Nueva Orden Pendiente"
  - Mensaje: "Nueva orden #123 requiere aprobación"
  - Tipo: `ORDER_CREATED`
  - Color: Azul

---

### 2. Admin Aprueba Orden

**Trigger:** `OrderStatusChangedEvent` (APPROVED)

**Notificaciones enviadas:**
- ✉️ **Al creador (CLIENT)**:
  - Título: "Orden Aprobada"
  - Mensaje: "Tu orden #123 ha sido aprobada"
  - Tipo: `ORDER_APPROVED`
  - Color: Verde

- ✉️ **Al driver asignado**:
  - Título: "Nueva Orden Asignada"
  - Mensaje: "Se te ha asignado la orden #123"
  - Tipo: `ORDER_APPROVED`
  - Color: Verde

---

### 3. Admin Deniega Orden

**Trigger:** `OrderStatusChangedEvent` (DENIED)

**Notificaciones enviadas:**
- ✉️ **Al creador (CLIENT)**:
  - Título: "Orden Denegada"
  - Mensaje: "Tu orden #123 ha sido denegada"
  - Tipo: `ORDER_DENIED`
  - Color: Rojo

---

### 4. Transporte Iniciado

**Trigger:** `OrderStatusChangedEvent` (IN_TRANSIT)

**Notificaciones enviadas:**
- ✉️ **Al creador (CLIENT)**:
  - Título: "Transporte Iniciado"
  - Mensaje: "Tu orden #123 está en tránsito"
  - Tipo: `TRANSPORT_STARTED`
  - Color: Cyan

---

### 5. Orden Entregada

**Trigger:** `OrderStatusChangedEvent` (DELIVERED)

**Notificaciones enviadas:**
- ✉️ **Al creador (CLIENT)**:
  - Título: "Orden Entregada"
  - Mensaje: "Tu orden #123 ha sido entregada"
  - Tipo: `TRANSPORT_DELIVERED`
  - Color: Teal

---

### 6. Documentos Pendientes

**Trigger:** `OrderStatusChangedEvent` (DOCUMENT_PENDING)

**Notificaciones enviadas:**
- ✉️ **Al creador (CLIENT)**:
  - Título: "Documentos Pendientes"
  - Mensaje: "Tu orden #123 requiere documentación"
  - Tipo: `ORDER_DOCUMENT_PENDING`
  - Color: Naranja

---

## FAQ - Preguntas Frecuentes

### ❓ ¿Funciona si el usuario cierra la pestaña?

**Sí**, pero con condiciones:

✅ **Funciona si:**
- El navegador está abierto (otras pestañas)
- El usuario dio permiso para notificaciones
- El Service Worker está activo

❌ **NO funciona si:**
- El navegador está completamente cerrado
- El usuario bloqueó las notificaciones
- El navegador no soporta Service Workers (muy raro)

**Solución para navegador cerrado:**
- La notificación queda **pendiente** en OneSignal
- Se entrega cuando el usuario abre el navegador
- OneSignal reintenta automáticamente

---

### ❓ ¿Qué pasa si el usuario tiene múltiples dispositivos?

**Recibe la notificación en TODOS sus dispositivos:**

Ejemplo: Usuario ID "456" tiene:
- 💻 Laptop (Chrome)
- 📱 iPhone (Safari)
- 🖥️ PC de oficina (Firefox)

**Resultado:**
```
Backend envía 1 notificación → OneSignal envía a 3 dispositivos
```

OneSignal automáticamente:
1. Busca todos los `player_ids` con `external_user_id = "456"`
2. Envía la notificación a cada uno
3. Sincroniza el estado (si lee en uno, marca como leída en todos)*

*Requiere configuración adicional en OneSignal

---

### ❓ ¿Cuánto demora en llegar una notificación?

**Latencia típica:**
- ⚡ Backend → OneSignal: **< 200ms**
- ⚡ OneSignal → Navegador: **< 1s**
- ⚡ **Total: ~1-2 segundos**

**Factores que afectan:**
- Calidad de conexión del usuario
- Carga de servidores de OneSignal (raro)
- Si el dispositivo está en modo ahorro de batería

**En TUPACK con polling:**
- Push notification: 1-2s
- Polling de contador: hasta 10s
- Polling de lista: hasta 30s

Por eso usamos **ambos sistemas** (push + polling).

---

### ❓ ¿Qué pasa si OneSignal está caído?

**Mecanismos de respaldo:**

1. **Las notificaciones se guardan en BD TUPACK** (siempre)
   - El usuario puede verlas en el menú de notificaciones
   - Accesibles vía API REST

2. **Polling de React Query funciona** (independiente de OneSignal)
   - Cada 10s actualiza el contador
   - Cada 30s actualiza la lista

3. **OneSignal tiene 99.9% uptime**
   - Múltiples data centers
   - Reintentos automáticos
   - Cola de mensajes pendientes

**Resultado:**
- ❌ Usuario NO recibe push (toast)
- ✅ Usuario VE la notificación en el menú (por polling)
- ✅ Cuando OneSignal se recupera, envía pendientes

---

### ❓ ¿Se puede enviar notificaciones sin guardar en BD?

**Sí, pero NO es recomendable:**

```java
// Solo push (NO recomendado)
oneSignalService.sendPushNotification(userId, title, message, data);
// Usuario solo ve toast, no queda registro
```

```java
// Push + BD (RECOMENDADO)
notificationService.createNotification(dto);
// Guarda en BD + envía push automáticamente
```

**Ventajas de guardar en BD:**
- ✅ Historial completo
- ✅ Usuario puede revisar después
- ✅ Funciona aunque falle OneSignal
- ✅ Auditoría y estadísticas
- ✅ Recuperación ante errores

---

### ❓ ¿Se puede enviar notificaciones programadas?

**Sí, OneSignal lo soporta:**

```java
Map<String, Object> payload = new HashMap<>();
payload.put("app_id", appId);
payload.put("include_external_user_ids", List.of(userId));
payload.put("headings", Map.of("en", title));
payload.put("contents", Map.of("en", message));

// 🕐 Programar para el futuro
payload.put("send_after", "2026-02-20 15:00:00 GMT-0500");

restTemplate.postForObject(ONESIGNAL_API_URL, payload, Map.class);
```

**Casos de uso:**
- Recordatorios de órdenes pendientes
- Notificaciones de mantenimiento programado
- Alertas de vencimiento de documentos

---

### ❓ ¿Se puede personalizar el diseño de la notificación?

**Limitado, pero sí:**

```java
Map<String, Object> payload = new HashMap<>();
payload.put("app_id", appId);
payload.put("include_external_user_ids", List.of(userId));
payload.put("headings", Map.of("en", "Orden Aprobada"));
payload.put("contents", Map.of("en", "Tu orden #123..."));

// 🎨 Personalización
payload.put("large_icon", "https://tupack.com/icons/order-approved.png");
payload.put("big_picture", "https://tupack.com/images/order-123.jpg");
payload.put("ios_badgeType", "Increase");
payload.put("ios_badgeCount", 1);
payload.put("android_accent_color", "FF00FF00"); // Verde

// 🔊 Sonido
payload.put("android_sound", "notification");
payload.put("ios_sound", "notification.wav");

// ⏰ Prioridad
payload.put("priority", 10); // Alta prioridad

restTemplate.postForObject(ONESIGNAL_API_URL, payload, Map.class);
```

**Limitaciones:**
- El diseño final depende del navegador/OS
- Chrome, Firefox, Safari tienen estilos propios
- No puedes usar HTML/CSS personalizado

---

### ❓ ¿Cómo pruebo las notificaciones en desarrollo?

**Opción 1: Localhost (más fácil)**
```typescript
OneSignal.init({
  appId: "...",
  allowLocalhostAsSecureOrigin: true // ← Permitir localhost
});
```

**Opción 2: ngrok (más realista)**
```bash
# 1. Instalar ngrok
npm install -g ngrok

# 2. Exponer localhost:3000
ngrok http 3000

# Output: https://abc123.ngrok.io → localhost:3000

# 3. Configurar en OneSignal
# Site URL: https://abc123.ngrok.io
```

**Opción 3: HTTPS local (avanzado)**
```bash
# Generar certificado SSL local
mkcert -install
mkcert localhost

# Iniciar Next.js con HTTPS
next dev --experimental-https
```

---

### ❓ ¿Cómo veo las notificaciones enviadas?

**OneSignal Dashboard:**
1. Ir a https://app.onesignal.com/
2. Seleccionar app "TUPACK"
3. Click en "Notifications" (sidebar)
4. Ver lista completa con estadísticas

**Detalles disponibles:**
- 📤 Enviadas
- ✓ Entregadas
- 👆 Clicks
- ⏱️ Tiempo promedio de entrega
- 📊 Plataformas (Web, iOS, Android)
- 🌍 Países
- 🕐 Gráficas por hora

**API de TUPACK:**
```bash
# Ver notificaciones de un usuario
GET http://localhost:8080/api/notification?userId=456

# Ver contador de no leídas
GET http://localhost:8080/api/notification/count/unread
```

---

### ❓ ¿Cuánto cuesta OneSignal?

**Plan Free (TUPACK actual):**
- ✅ 10,000 usuarios
- ✅ Notificaciones ilimitadas
- ✅ Todos los canales (Web, Mobile)
- ✅ API completa
- ✅ Estadísticas básicas
- ✅ Email support

**Plan Growth ($9/mes):**
- ✅ 30,000 usuarios
- ✅ Todo del plan Free +
- ✅ A/B Testing
- ✅ Scheduling
- ✅ Segmentación avanzada

**Plan Professional ($99/mes):**
- ✅ 100,000 usuarios
- ✅ Todo del plan Growth +
- ✅ Priority support
- ✅ Data export
- ✅ Custom integrations

**Plan Enterprise (contactar ventas):**
- ✅ Usuarios ilimitados
- ✅ SLA garantizado
- ✅ Dedicated support
- ✅ Custom infrastructure

**Para TUPACK:**
- Si tienes < 10,000 usuarios → **$0/mes** 🎉
- Si tienes 10k-30k usuarios → **$9/mes**

---

## 📚 Recursos Adicionales

### Documentación Oficial
- 📖 [OneSignal Web Push Quickstart](https://documentation.onesignal.com/docs/web-push-quickstart)
- 📖 [OneSignal REST API](https://documentation.onesignal.com/reference/create-notification)
- 📖 [External User IDs](https://documentation.onesignal.com/docs/external-user-ids)
- 📖 [Web Push SDK](https://documentation.onesignal.com/docs/web-push-sdk)

### Tutoriales
- 🎥 [OneSignal Web Push Tutorial](https://www.youtube.com/watch?v=xxx)
- 📝 [OneSignal + React Guide](https://documentation.onesignal.com/docs/react-web-push)
- 📝 [OneSignal + Spring Boot](https://www.baeldung.com/spring-onesignal)

### Herramientas
- 🛠️ [OneSignal Dashboard](https://app.onesignal.com/)
- 🛠️ [OneSignal API Reference](https://documentation.onesignal.com/reference)
- 🛠️ [Postman Collection](https://www.postman.com/onesignal-team)

---

## 🎯 Resumen Final

### Flujo Simplificado

```
1. Usuario registra navegador → OneSignal mapea userId
2. Backend crea orden → Publica evento
3. Listener crea notificación → Llama OneSignalService
4. OneSignalService → HTTP POST a OneSignal API
5. OneSignal → Envía a todos los dispositivos del usuario
6. Navegador recibe → Toast + Badge +1
7. Usuario click → Navega a orden
```

### Beneficios Clave

✅ **Simplicidad**: 1 línea de código para enviar notificación
✅ **Confiabilidad**: 99.9% uptime, reintentos automáticos
✅ **Multiplataforma**: Web, iOS, Android con 1 API
✅ **Escalable**: Hasta 10,000 usuarios gratis
✅ **Estadísticas**: Dashboard completo
✅ **Sin infraestructura**: OneSignal maneja todo

### Código Mínimo Necesario

**Backend:**
```java
oneSignalService.sendPushNotification(userId, title, message, data);
```

**Frontend:**
```typescript
await OneSignal.init({ appId: "..." });
await OneSignal.login(userId);
```

**¡Eso es todo!** 🚀

---

## 📞 Soporte

**OneSignal:**
- 📧 Email: support@onesignal.com
- 💬 Chat: https://onesignal.com/contact
- 📚 Docs: https://documentation.onesignal.com/

**TUPACK:**
- 📧 Email: dev@tupack.com
- 📱 Slack: #notificaciones

---

*Documento generado el 17 de febrero de 2026*
*Versión: 1.0*
*Sistema de Notificaciones TUPACK - OneSignal Integration*
