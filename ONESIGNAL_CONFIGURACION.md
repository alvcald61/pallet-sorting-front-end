# Configuración de OneSignal - Guía Completa

## 📋 Índice
1. [Configuración en el Dashboard de OneSignal](#1-configuración-en-el-dashboard-de-onesignal)
2. [Obtener Credenciales](#2-obtener-credenciales)
3. [Configuración en el Backend](#3-configuración-en-el-backend)
4. [Configuración en el Frontend](#4-configuración-en-el-frontend)
5. [Configuración de Web Push](#5-configuración-de-web-push)
6. [Pruebas](#6-pruebas)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Configuración en el Dashboard de OneSignal

### 1.1. Crear Cuenta (si no tienes)
1. Ve a [https://onesignal.com](https://onesignal.com)
2. Click en **"Get Started Free"**
3. Crea una cuenta con email o Google

### 1.2. Crear Aplicación (si no tienes)
1. En el Dashboard, click en **"New App/Website"**
2. Nombre: **"TUPACK Pallet Sorting"** (o el que prefieras)
3. Selecciona plan: **Free** (hasta 10,000 usuarios)
4. Click en **"Create"**

---

## 2. Obtener Credenciales

### 2.1. App ID y REST API Key

1. En el Dashboard de OneSignal, ve a tu aplicación
2. Click en **Settings** (⚙️) en el menú izquierdo
3. Click en **Keys & IDs**

Verás dos credenciales importantes:

#### 📌 App ID
```
cc79af88-2135-4f63-a116-8587053ed0a9
```
✅ **Ya configurado en tu proyecto** (frontend y backend)

#### 📌 REST API Key
```
Ejemplo: OWFiZDMwYjctNmE3Yi00YjA0LWE5MjItOTQ5ODFkNzJhZTI5
```
⚠️ **FALTA configurar en el backend** - Necesitas copiar esta clave

### 2.2. Copiar REST API Key
1. En la sección **Keys & IDs**, busca **"REST API Key"**
2. Click en el icono de **copiar** 📋
3. Guarda esta clave (la necesitarás en el paso 3)

---

## 3. Configuración en el Backend

### 3.1. Variables de Entorno

Tienes **2 opciones** para configurar la REST API Key:

#### **Opción 1: Archivo .env (Recomendado para desarrollo)**

Crea un archivo `.env` en la raíz del proyecto backend:

**Ubicación:** `D:\Proyectos\TUPACK\pallet-sorting-api\.env`

```properties
ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9
ONESIGNAL_REST_API_KEY=TU_REST_API_KEY_AQUI
```

Reemplaza `TU_REST_API_KEY_AQUI` con la clave que copiaste del dashboard.

#### **Opción 2: Variables de Sistema (Producción)**

En producción, configura la variable de entorno en tu servidor:

```bash
# Linux/Mac
export ONESIGNAL_REST_API_KEY="TU_REST_API_KEY_AQUI"

# Windows (CMD)
set ONESIGNAL_REST_API_KEY=TU_REST_API_KEY_AQUI

# Windows (PowerShell)
$env:ONESIGNAL_REST_API_KEY="TU_REST_API_KEY_AQUI"
```

### 3.2. Verificar application.yml

Ya está configurado correctamente:

```yaml
application:
  onesignal:
    app-id: ${ONESIGNAL_APP_ID:cc79af88-2135-4f63-a116-8587053ed0a9}
    rest-api-key: ${ONESIGNAL_REST_API_KEY:}
```

✅ Lee la variable de entorno `ONESIGNAL_REST_API_KEY`

---

## 4. Configuración en el Frontend

### 4.1. Verificar .env

Tu archivo `.env` ya tiene las credenciales:

**Ubicación:** `D:\Proyectos\TUPACK\pallet-sorting-front\.env`

```properties
NEXT_PUBLIC_ONESIGNAL_APP_ID=cc79af88-2135-4f63-a116-8587053ed0a9
NEXT_PUBLIC_ONESIGNAL_KEY=os_v2_app_zr427cbbgvhwhiiwqwdqkpwqvhmcmt54fveu6enqr2nd4qjld6nmv7jzw7sxy5btshlvuojlouwp4xiadcm3mei7p2ddr4cxdvzufzy
```

✅ **Ya configurado correctamente**

### 4.2. Service Workers

Los Service Workers ya están creados en `public/`:
- ✅ `OneSignalSDKWorker.js`
- ✅ `OneSignalSDKUpdaterWorker.js`

---

## 5. Configuración de Web Push

Para que las notificaciones push funcionen en el navegador, necesitas configurar el dominio permitido en OneSignal.

### 5.1. Configurar Web Push en OneSignal

1. En el Dashboard de OneSignal, ve a **Settings** → **Platforms**
2. Click en **Web Push** (o **Add a Web Platform** si no está configurado)

### 5.2. Configuración de Desarrollo (localhost)

Para desarrollo local:

```
Site Name: TUPACK Pallet Sorting (Dev)
Site URL: http://localhost:3000

✅ Auto Resubscribe: ON
✅ Default Notification Icon: (opcional - sube un icono 256x256px)
```

Click en **Save**

### 5.3. Configuración de Producción

Para producción, agrega tu dominio real:

```
Site Name: TUPACK Pallet Sorting
Site URL: https://tupack.com  (tu dominio real)

✅ Auto Resubscribe: ON
✅ Default Notification Icon: (sube tu logo 256x256px)
```

### 5.4. Permitir localhost (Importante para desarrollo)

1. En **Web Push Configuration**, busca **"Local Testing"**
2. Activa **"My site is not fully HTTPS"** (solo para desarrollo)
3. Agrega `http://localhost:3000` a la lista de dominios permitidos

---

## 6. Pruebas

### 6.1. Verificar Configuración del Backend

1. Inicia el backend:
```bash
cd D:\Proyectos\TUPACK\pallet-sorting-api
./mvnw spring-boot:run
```

2. Verifica los logs al iniciar - NO debe aparecer:
```
WARN  OneSignal REST API key not configured. Skipping push notification.
```

3. Si ves el warning, significa que falta la REST API Key en el `.env`

### 6.2. Verificar Configuración del Frontend

1. Inicia el frontend:
```bash
cd D:\Proyectos\TUPACK\pallet-sorting-front
npm run dev
```

2. Abre el navegador en `http://localhost:3000`

3. Abre **DevTools** (F12) → **Console**

4. Busca mensajes de OneSignal:
```
[OneSignal] Initializing...
[OneSignal] Service Worker registered
```

### 6.3. Verificar Service Worker

1. En DevTools, ve a **Application** → **Service Workers**
2. Debes ver:
   - ✅ `OneSignalSDKWorker.js` - **Activated and Running**

### 6.4. Prueba de Suscripción

1. Haz login en la aplicación
2. El navegador debería mostrar un popup pidiendo permiso para notificaciones
3. Click en **"Permitir"** / **"Allow"**
4. En la consola deberías ver:
```
[OneSignal] User subscribed successfully
[OneSignal] External User ID set: <userId>
```

### 6.5. Prueba de Notificación Completa

#### **Paso 1: Crear una orden**
1. Login como **CLIENT**
2. Ve a **Crear Orden**
3. Llena el formulario y guarda

#### **Paso 2: Verificar en Backend**
Revisa los logs del backend:
```
INFO  Order created event received for order: 123
INFO  Push notification sent to user: <userId>
INFO  Push notification sent to 3 users (ADMINs)
```

#### **Paso 3: Verificar Notificación en Frontend**
- ✅ Debería aparecer un **toast de Mantine** con "Orden creada exitosamente"
- ✅ El **badge en el navbar** debería mostrar **"1"**
- ✅ Si tienes la ventana en segundo plano, debería aparecer una **notificación del navegador**

#### **Paso 4: Login como ADMIN**
1. Logout y login como **ADMIN**
2. El **badge** debería mostrar **"1"** (nueva orden pendiente)
3. Click en el **icono de campana**
4. Debería aparecer el menú con la notificación: **"Nueva Orden Pendiente"**

---

## 7. Troubleshooting

### ❌ No aparece el popup de permisos

**Causa:** El navegador ya tiene permisos guardados (permitidos o bloqueados)

**Solución:**
1. En Chrome, ve a `chrome://settings/content/notifications`
2. Busca `localhost:3000`
3. Si está en "Blocked", cámbialo a "Allow"
4. Recarga la página

### ❌ Warning: "OneSignal REST API key not configured"

**Causa:** Falta la REST API Key en el backend

**Solución:**
1. Verifica que el archivo `.env` exista en la raíz del backend
2. Verifica que contenga: `ONESIGNAL_REST_API_KEY=TU_CLAVE_AQUI`
3. Reinicia el backend

### ❌ Error: "ServiceWorker registration failed"

**Causa:** Los Service Workers no están en `public/`

**Solución:**
Ya están creados, pero verifica que existan:
```bash
ls D:\Proyectos\TUPACK\pallet-sorting-front\public\OneSignal*
```

Deberías ver:
- `OneSignalSDKWorker.js`
- `OneSignalSDKUpdaterWorker.js`

### ❌ Error 403 en OneSignal API

**Causa:** REST API Key incorrecta o expirada

**Solución:**
1. Ve al Dashboard de OneSignal
2. Settings → Keys & IDs
3. Copia nuevamente la **REST API Key**
4. Actualiza el `.env` del backend
5. Reinicia el backend

### ❌ Notificación no llega al frontend

**Posibles causas:**

1. **Usuario no suscrito:**
   - Verifica en DevTools → Console que se ejecutó `OneSignal.login(userId)`

2. **Backend no envía push:**
   - Verifica los logs del backend - debe aparecer: `"Push notification sent to user: X"`

3. **OneSignal no puede alcanzar al usuario:**
   - Ve al Dashboard de OneSignal → **Audience** → **All Users**
   - Busca tu userId en **External User ID**
   - Verifica que tenga al menos 1 dispositivo suscrito

4. **Permisos del navegador bloqueados:**
   - Verifica en `chrome://settings/content/notifications`

### ❌ Badge no se actualiza

**Causa:** Polling no está funcionando

**Solución:**
1. Abre DevTools → Network
2. Busca requests a `/api/notification/count/unread`
3. Deberían aparecer cada 10 segundos
4. Si no aparecen, verifica que `useUnreadCount()` esté siendo usado en el componente

---

## 📌 Checklist Final

Antes de considerar la configuración completa, verifica:

### Backend
- [ ] Archivo `.env` existe en la raíz del backend
- [ ] Variable `ONESIGNAL_REST_API_KEY` está configurada
- [ ] Backend inicia sin warnings de OneSignal
- [ ] Logs muestran "Push notification sent to user" al crear orden

### Frontend
- [ ] `.env` tiene `NEXT_PUBLIC_ONESIGNAL_APP_ID`
- [ ] Service Workers existen en `public/`
- [ ] Console muestra "[OneSignal] Service Worker registered"
- [ ] Usuario se suscribe al hacer login

### OneSignal Dashboard
- [ ] Web Push está configurado
- [ ] `http://localhost:3000` está en dominios permitidos
- [ ] En **Audience** aparece tu userId con 1+ dispositivos

### Prueba End-to-End
- [ ] Crear orden genera notificación
- [ ] Toast de Mantine aparece
- [ ] Badge muestra "1"
- [ ] Menú de notificaciones muestra la notificación
- [ ] Click en notificación navega a la orden

---

## 🎯 Resumen de Credenciales

| Dónde | Qué configurar | Valor |
|-------|---------------|-------|
| **OneSignal Dashboard** | Crear app y obtener credenciales | - |
| **Backend `.env`** | `ONESIGNAL_REST_API_KEY` | Copiar de Dashboard → Keys & IDs |
| **Frontend `.env`** | `NEXT_PUBLIC_ONESIGNAL_APP_ID` | ✅ Ya configurado |
| **OneSignal Web Push** | Site URL | `http://localhost:3000` (dev) |

---

## 📚 Recursos Adicionales

- [OneSignal Web Push Quickstart](https://documentation.onesignal.com/docs/web-push-quickstart)
- [OneSignal REST API Reference](https://documentation.onesignal.com/reference/create-notification)
- [Troubleshooting Web Push](https://documentation.onesignal.com/docs/troubleshooting-web-push)

---

**¡Listo!** 🚀 Con esta configuración, tu sistema de notificaciones debería funcionar completamente.
