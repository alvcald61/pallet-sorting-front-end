# ✅ OneSignal - Verificación de Configuración

## 📋 Checklist de Configuración

### 1. Archivos Necesarios

#### ✅ Service Workers en `/public/`
```bash
public/
├── OneSignalSDKWorker.js          # ✅ Creado
└── OneSignalSDKUpdaterWorker.js   # ✅ Creado
```

**Contenido de ambos archivos:**
```javascript
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
```

#### ✅ Variables de Entorno en `.env`
```bash
NEXT_PUBLIC_ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9
NEXT_PUBLIC_ONESIGNAL_KEY=os_v2_app_... # (ya configurado)
```

#### ✅ Dependencia en `package.json`
```json
{
  "dependencies": {
    "react-onesignal": "^3.4.5"  // ✅ Instalado
  }
}
```

---

## 🔧 Configuración Implementada

### 1. Inicialización en BaseLayout.tsx

**Ubicación**: `src/components/layouts/BaseLayout.tsx`

**Características:**
- ✅ Inicializa OneSignal solo cuando hay usuario logueado
- ✅ Evita doble inicialización con flag `oneSignalInitialized`
- ✅ Especifica rutas de Service Workers explícitamente
- ✅ Registra usuario con `external_user_id` (el ID de la BD)
- ✅ Manejo de errores robusto
- ✅ Logs para debugging

**Código clave:**
```typescript
await OneSignal.init({
  appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
  allowLocalhostAsSecureOrigin: true,
  serviceWorkerPath: "/OneSignalSDKWorker.js",
  serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
});

await OneSignal.login(String(user.id)); // external_user_id
```

---

### 2. Event Listeners en useOneSignalListeners.ts

**Ubicación**: `src/lib/hooks/useOneSignalListeners.ts`

**Mejoras implementadas:**
- ✅ Espera a que OneSignal esté completamente inicializado
- ✅ Previene duplicación de listeners con `useRef`
- ✅ Retry automático si OneSignal no está listo
- ✅ Manejo de errores en cada listener
- ✅ Cleanup apropiado al desmontar

**Listeners configurados:**
1. **foregroundWillDisplay**: Notificaciones mientras la app está abierta
   - Muestra toast de Mantine
   - Incrementa contador de no leídas
   - Invalida queries de React Query

2. **click**: Usuario hace click en notificación
   - Navega a la entidad relacionada (ej: `/order/123`)

---

## 🧪 Cómo Verificar la Configuración

### Paso 1: Verificar Service Workers

**En el navegador:**
1. Abrir DevTools (F12)
2. Ir a pestaña **Application**
3. Click en **Service Workers** (sidebar izquierdo)

**Debe mostrar:**
```
✓ Service Worker: OneSignalSDKWorker.js
  Status: Activated and running
  Scope: https://localhost:3000/ (o tu dominio)

✓ Service Worker: OneSignalSDKUpdaterWorker.js
  Status: Activated and running
```

**Screenshot esperado:**
```
┌─────────────────────────────────────────┐
│ Service Workers                         │
├─────────────────────────────────────────┤
│ ✓ OneSignalSDKWorker.js                 │
│   Status: activated and is running      │
│   Source: /OneSignalSDKWorker.js        │
│   Scope: https://localhost:3000/        │
│                                         │
│ ✓ OneSignalSDKUpdaterWorker.js          │
│   Status: activated and is running      │
│   Source: /OneSignalSDKUpdaterWorker.js │
└─────────────────────────────────────────┘
```

---

### Paso 2: Verificar Inicialización en Console

**Logs esperados al hacer login:**
```
🔔 Initializing OneSignal...
OneSignal: Attempting to register service worker with script: /OneSignalSDKWorker.js
OneSignal: Service Worker registered successfully
✅ OneSignal initialized for user: 123
🎧 Setting up OneSignal listeners...
🎧 Adding OneSignal event listeners...
✅ OneSignal listeners added successfully
```

**Si ves errores:**
```javascript
// ❌ Error común: Service Worker no encontrado
❌ Failed to register service worker: Script at 'https://...' not found

// Solución: Verificar que los archivos existan en /public/
```

---

### Paso 3: Verificar Permisos de Notificaciones

**En el navegador:**
1. Click en el **candado** 🔒 en la barra de direcciones
2. Buscar **Notifications**
3. Debe estar en **Allow** (Permitir)

**Si está bloqueado:**
```javascript
// Cambiar a "Allow" manualmente
// O resetear los permisos y recargar la página
```

**Programáticamente:**
```typescript
// Verificar estado de permisos
const permission = await OneSignal.Notifications.getPermission();
console.log("Notification permission:", permission);
// Expected: "granted"
```

---

### Paso 4: Verificar Registro de Usuario

**En Console:**
```typescript
// Obtener external_user_id registrado
const externalUserId = await OneSignal.User.getExternalId();
console.log("External User ID:", externalUserId);
// Expected: "123" (tu user.id de la BD)

// Obtener player_id (interno de OneSignal)
const playerId = await OneSignal.User.getPushSubscription().getId();
console.log("Player ID:", playerId);
// Expected: "abc-xyz-123-def-789"
```

---

### Paso 5: Verificar en OneSignal Dashboard

**URL:** https://app.onesignal.com/apps/cc79af88-2135-4f63-a116-8587053ed0a9

1. **Ir a "Audience" → "All Users"**
   - Debes ver tu usuario registrado
   - External User ID: `123` (tu ID)
   - Last Active: Hace pocos segundos
   - Subscribed: Yes

2. **Enviar notificación de prueba:**
   - Click en "Messages" → "New Push"
   - Audience: "Send to Particular Users"
   - External User IDs: `123`
   - Title: "Test"
   - Message: "Probando OneSignal"
   - Click "Send Message"

3. **Verificar que llegue:**
   - Debe aparecer toast en la app
   - Console debe mostrar: `📩 Foreground notification received:`
   - Badge debe incrementarse

---

## 🐛 Troubleshooting

### Problema 1: Service Worker no se registra

**Síntomas:**
```
❌ Failed to register service worker
```

**Soluciones:**
1. Verificar que los archivos existan:
   ```bash
   ls -la public/OneSignal*.js
   ```

2. Verificar que NEXT.js esté sirviendo los archivos:
   ```bash
   # Debe responder HTTP 200
   curl http://localhost:3000/OneSignalSDKWorker.js
   ```

3. Limpiar caché del navegador:
   ```
   DevTools → Application → Clear storage → Clear site data
   ```

4. Reiniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

### Problema 2: "OneSignal is not defined"

**Síntomas:**
```javascript
ReferenceError: OneSignal is not defined
```

**Soluciones:**
1. Verificar que `react-onesignal` esté instalado:
   ```bash
   npm list react-onesignal
   # Expected: react-onesignal@3.4.5
   ```

2. Si no está instalado:
   ```bash
   npm install react-onesignal
   ```

3. Reiniciar servidor

---

### Problema 3: Notificaciones no llegan

**Diagnóstico:**

1. **Verificar permisos:**
   ```typescript
   const permission = await OneSignal.Notifications.getPermission();
   console.log(permission); // Debe ser "granted"
   ```

2. **Verificar suscripción:**
   ```typescript
   const isSubscribed = await OneSignal.User.getPushSubscription().getOptedIn();
   console.log("Subscribed:", isSubscribed); // Debe ser true
   ```

3. **Verificar external_user_id:**
   ```typescript
   const externalId = await OneSignal.User.getExternalId();
   console.log("External ID:", externalId); // Debe ser tu user.id
   ```

4. **Verificar en backend que se está enviando:**
   ```java
   // Revisar logs del backend
   // Debe mostrar: "Push notification sent to user: 123"
   ```

5. **Verificar en OneSignal Dashboard:**
   - Messages → Ver notificación enviada
   - Delivery Status debe ser "Delivered"

---

### Problema 4: Listeners no se activan

**Síntomas:**
```
// No aparece toast cuando llega notificación
```

**Soluciones:**

1. Verificar que los listeners estén registrados:
   ```typescript
   // En console debe aparecer:
   ✅ OneSignal listeners added successfully
   ```

2. Si no aparece, verificar orden de inicialización:
   ```typescript
   // BaseLayout.tsx debe:
   // 1. Inicializar OneSignal primero
   // 2. LUEGO llamar useOneSignalListeners()
   ```

3. Verificar que no haya errores en console

4. Probar manualmente:
   ```typescript
   // En console del navegador
   OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event) => {
     console.log("TEST:", event);
   });
   ```

---

### Problema 5: Doble inicialización

**Síntomas:**
```
Warning: OneSignal SDK is already initialized
```

**Solución:**
- ✅ Ya implementado con flag `oneSignalInitialized` en BaseLayout
- Previene re-inicialización en hot reload de desarrollo

---

## 📊 Testing Completo

### Test 1: Notificación de Orden Creada

**Pasos:**
1. Login como CLIENT
2. Crear una orden nueva
3. Verificar:
   - ✅ Toast aparece: "Orden Creada"
   - ✅ Badge muestra "1"
   - ✅ Console muestra: `📩 Foreground notification received:`
   - ✅ Menú de notificaciones muestra la nueva notificación

**Expected backend logs:**
```
Published OrderCreatedEvent for order: 123
Notification created for user: 456
Push notification sent to user: 456
```

**Expected OneSignal dashboard:**
```
Message: "Orden Creada"
Recipients: 1
Delivered: 1
Clicks: 0
```

---

### Test 2: Notificación de Orden Aprobada

**Pasos:**
1. Login como ADMIN
2. Aprobar una orden
3. Verificar que el CLIENT recibe notificación
4. Click en notificación
5. Verificar navegación a `/order/123`

**Expected:**
- ✅ Toast: "Orden Aprobada"
- ✅ Badge +1
- ✅ Navegación correcta
- ✅ OneSignal registra click (CTR aumenta)

---

### Test 3: Múltiples Dispositivos

**Pasos:**
1. Login en Chrome (Desktop)
2. Login en Safari (iPhone) con mismo usuario
3. Crear orden desde Chrome
4. Verificar que ambos dispositivos reciben notificación

**Expected:**
- ✅ Chrome: Toast + Badge
- ✅ Safari: Notificación nativa + Badge
- ✅ OneSignal dashboard: 2 deliveries

---

### Test 4: Polling + Push (Sistema Híbrido)

**Pasos:**
1. Login como CLIENT
2. Deshabilitar notificaciones en el navegador
3. Crear orden desde otra sesión
4. Esperar máximo 10 segundos
5. Verificar que el badge se actualiza (por polling)

**Expected:**
- ❌ No toast (notificaciones bloqueadas)
- ✅ Badge se actualiza después de 10s (polling)
- ✅ Notificación visible en menú

**Esto prueba que el sistema funciona INCLUSO si OneSignal falla**

---

## 🎯 Checklist Final

Antes de dar por completa la configuración, verificar:

- [ ] `react-onesignal` instalado en package.json
- [ ] Variables de entorno configuradas en `.env`
- [ ] `OneSignalSDKWorker.js` existe en `/public/`
- [ ] `OneSignalSDKUpdaterWorker.js` existe en `/public/`
- [ ] BaseLayout inicializa OneSignal correctamente
- [ ] useOneSignalListeners configurado
- [ ] Service Workers registrados (DevTools → Application)
- [ ] Permisos de notificaciones otorgados
- [ ] External User ID registrado en OneSignal
- [ ] Test de notificación manual exitoso (OneSignal Dashboard)
- [ ] Toast aparece al recibir notificación
- [ ] Badge se actualiza correctamente
- [ ] Click en notificación navega correctamente
- [ ] Polling funciona (backup de OneSignal)

---

## 📝 Notas Adicionales

### Desarrollo vs Producción

**Desarrollo (localhost):**
```typescript
OneSignal.init({
  appId: "...",
  allowLocalhostAsSecureOrigin: true, // ← Necesario para localhost
});
```

**Producción (HTTPS):**
```typescript
OneSignal.init({
  appId: "...",
  // allowLocalhostAsSecureOrigin: false o no incluir
});
```

### HTTPS Requerido en Producción

⚠️ **IMPORTANTE**: Service Workers requieren HTTPS en producción.

**Excepciones:**
- ✅ localhost (desarrollo)
- ✅ 127.0.0.1
- ❌ IPs locales (192.168.x.x) - requiere HTTPS

**Soluciones para desarrollo en red local:**
1. Usar ngrok: `ngrok http 3000`
2. Usar certificado SSL local: `mkcert localhost`
3. Usar OneSignal Custom Code Setup (más complejo)

---

## 🔗 Enlaces Útiles

- [OneSignal Dashboard](https://app.onesignal.com/apps/cc79af88-2135-4f63-a116-8587053ed0a9)
- [OneSignal Documentation](https://documentation.onesignal.com/)
- [React OneSignal SDK](https://github.com/OneSignal/react-onesignal)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

*Última actualización: 17 de febrero de 2026*
*OneSignal SDK Version: v16*
*react-onesignal: 3.4.5*
