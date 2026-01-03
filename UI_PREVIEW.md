# Vista Previa Visual - Sistema de Autenticación

## 📱 Página de Login

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                     TUPACK                               │
│         Sistema de Gestión de Paletas                    │
│                                                           │
│             Iniciar sesión                               │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                   │    │
│  │  Correo electrónico                              │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ ejemplo@empresa.com                   ✓   │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                   │    │
│  │  Contraseña                                      │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ ••••••••••                           [👁]  │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                   │    │
│  │          ┌─────────────────────────────┐        │    │
│  │          │      Ingresar              │        │    │
│  │          └─────────────────────────────┘        │    │
│  │                                                   │    │
│  │  ¿No tienes cuenta? Regístrate aquí             │    │
│  │                                                   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Características del Login:

- ✅ Fondo con gradiente azul-índigo
- ✅ Tarjeta blanca con sombra suave
- ✅ Encabezado con logo y descripción
- ✅ Validación de email en tiempo real
- ✅ Toggle para mostrar/ocultar contraseña (👁 icon)
- ✅ Botón con gradiente y hover effect
- ✅ Enlace a registro (colores clickeables)
- ✅ Indicadores de error/éxito

---

## 📝 Página de Registro

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                     TUPACK                               │
│         Sistema de Gestión de Paletas                    │
│                                                           │
│             Crear nueva cuenta                           │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                   │    │
│  │  Nombre                │  Apellido               │    │
│  │  ┌──────────────────┐  │  ┌──────────────────┐ │    │
│  │  │ Juan             │  │  │ Pérez            │ │    │
│  │  └──────────────────┘  │  └──────────────────┘ │    │
│  │                                                   │    │
│  │  Correo electrónico                              │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ empresa@example.com                      │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                   │    │
│  │  Razón Social                                    │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ Mi Empresa S.A.C.                        │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                   │    │
│  │  RUC                   │  Teléfono               │    │
│  │  ┌──────────────────┐  │  ┌──────────────────┐ │    │
│  │  │ 20123456789      │  │  │ +51 987654321    │ │    │
│  │  └──────────────────┘  │  └──────────────────┘ │    │
│  │                                                   │    │
│  │  Dirección                                       │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ Calle Principal 123, Lima, Perú          │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │                                                   │    │
│  │  Contraseña                                      │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ ••••••••••                           [👁]  │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │  Mínimo 6 caracteres                             │    │
│  │                                                   │    │
│  │  Confirmar contraseña                            │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │ ••••••••••                           [👁]  │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │  ✓ Las contraseñas coinciden                     │    │
│  │                                                   │    │
│  │          ┌─────────────────────────────┐        │    │
│  │          │      Crear cuenta           │        │    │
│  │          └─────────────────────────────┘        │    │
│  │                                                   │    │
│  │  ¿Ya tienes cuenta? Inicia sesión                │    │
│  │                                                   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Características del Registro:

- ✅ Layout en grid 2 columnas (responsive)
- ✅ 9 campos para información completa
- ✅ Validación en tiempo real
- ✅ Indicadores visuales (✓ verde/✗ rojo)
- ✅ Toggle para mostrar/ocultar contraseñas
- ✅ Botón deshabilitado si contraseñas no coinciden
- ✅ Mensajes de help text
- ✅ Integración con API de cliente

---

## 🎨 Paleta de Colores

```
┌─────────────────────────────────┐
│ PRIMARIO: Azul a Índigo         │
│ ████████████████████████████████│
│ #3B82F6 ──→ #4F46E5            │
│ (Azul)        (Índigo)          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ FONDO: Gradiente                │
│ ████████████████████████████████│
│ #EFF6FF ──→ #E0E7FF            │
│ (Azul 50)    (Índigo 100)       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ TEXTO: Gris Oscuro              │
│ ████████████████████████████████│
│ #374151                         │
│ (Gris 700)                      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ERROR: Rojo                     │
│ ████████████████████████████████│
│ #EF4444                         │
│ (Rojo 500)                      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ÉXITO: Verde                    │
│ ████████████████████████████████│
│ #22C55E                         │
│ (Verde 500)                     │
└─────────────────────────────────┘
```

---

## 🔄 Flujo de Navegación

```
                    ┌─────────────┐
                    │   Inicio    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   /login    │
                    │             │
                    │ Credenciales│
                    │  Correctas  │
                    └──────┬──────┘
                           │ ✓
            ┌──────────────┼──────────────┐
            │              │              │
            │         ┌────▼────┐         │
            │         │ /order  │         │
            │         └─────────┘         │
            │                             │
      "No tienes      Error o       "Crear
       cuenta?"       Link a           cuenta"
            │         Registro           │
            │              │             │
            └──────────────┼─────────────┘
                           │
                    ┌──────▼────────┐
                    │   /sign-up    │
                    │               │
                    │  Registrarse  │
                    └──────┬────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
      ✓ Válido                      ✗ Error
            │                             │
      ┌─────▼─────┐            ┌─────────▼────┐
      │ Crear      │            │ Mostrar error│
      │ Cuenta     │            │ en formulario│
      └─────┬─────┘            └───────────────┘
            │
      ┌─────▼────────┐
      │ Autenticar   │
      │ Automáticam. │
      └─────┬────────┘
            │
      ┌─────┴────────┐
      │              │
    ✓│              │✗
      │              │
  ┌───▼──┐      ┌────▼─────┐
  │/order│      │/login     │
  │      │      │(registered│
  │      │      │=true)     │
  └──────┘      └───────────┘
```

---

## 📋 Estados de los Formularios

### Login - Estados

```
┌─────────────────────────────────────────────┐
│ 1. REPOSO (Inicial)                         │
│                                              │
│ Email: ┌─────────────┐      Contraseña:     │
│        │             │      ┌─────────────┐ │
│        └─────────────┘      │             │ │
│                              └─────────────┘ │
│ Botón: [       Ingresar        ]  (activo)  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 2. VALIDANDO EMAIL (Usuario tipea)          │
│                                              │
│ Email: ┌─────────────┐  ❌ Email inválido  │
│        │ usuario     │                      │
│        └─────────────┘                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 3. PROCESANDO (Click en Ingresar)          │
│                                              │
│ Email: ┌─────────────┐                      │
│        │ usuario@... │                      │
│        └─────────────┘                      │
│ Botón: [ ⏳ Ingresando... ]  (deshabilitado)│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 4. ERROR (Credenciales incorrectas)        │
│                                              │
│ ❌ Email o contraseña incorrectos          │
│                                              │
│ Email: ┌─────────────┐                      │
│        │ usuario@... │                      │
│        └─────────────┘                      │
│ Botón: [       Ingresar        ]  (activo)  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 5. ÉXITO (Redirigiendo)                    │
│                                              │
│ ✓ Autenticado                               │
│ Redirigiendo a /order...                    │
└─────────────────────────────────────────────┘
```

### Registro - Estados

```
┌──────────────────────────────────────────────┐
│ 1. CONTRASEÑAS DIFERENTES                    │
│                                               │
│ Contraseña: ┌──────────────────┐            │
│             │ MiPassword123     │            │
│             └──────────────────┘            │
│                                               │
│ Confirmar:  ┌──────────────────┐            │
│             │ OtraPassword456   │            │
│             └──────────────────┘            │
│ ❌ Las contraseñas no coinciden              │
│                                               │
│ Botón: [ Crear cuenta ] (deshabilitado - opaco)│
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ 2. CONTRASEÑAS COINCIDEN                    │
│                                               │
│ Contraseña: ┌──────────────────┐            │
│             │ MiPassword123     │            │
│             └──────────────────┘            │
│                                               │
│ Confirmar:  ┌──────────────────┐            │
│             │ MiPassword123     │            │
│             └──────────────────┘            │
│ ✓ Las contraseñas coinciden                  │
│                                               │
│ Botón: [ Crear cuenta ] (habilitado - color) │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ 3. PROCESANDO                                 │
│                                               │
│ ⏳ Registrando...                            │
│                                               │
│ Botón: [ Crear cuenta ] (deshabilitado)      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ 4. ERROR EN REGISTRO                        │
│                                               │
│ ❌ Este email ya está registrado             │
│                                               │
│ [Formulario con los datos rellenados]        │
│                                               │
│ Botón: [ Crear cuenta ] (habilitado)         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ 5. ÉXITO Y AUTENTICACIÓN                    │
│                                               │
│ ✓ Cuenta creada correctamente                │
│ ✓ Autenticando automáticamente...            │
│ Redirigiendo a /order...                     │
└──────────────────────────────────────────────┘
```

---

## 📱 Responsividad

### Desktop (1024px+)

```
┌─────────────────────────────────────────────┐
│                                              │
│          ┌─────────────────────┐            │
│          │   Tarjeta Login     │            │
│          │  (max-w-md)         │            │
│          │                     │            │
│          │  Campos de entrada  │            │
│          │                     │            │
│          │  Botón              │            │
│          └─────────────────────┘            │
│                                              │
└─────────────────────────────────────────────┘

Registro en GRID 2 COLUMNAS:
┌─────────────────────────────────────────────┐
│  Nombre      │  Apellido                    │
│  ──────────────────────                     │
│  Email (Full width)                        │
│  ──────────────────────                     │
│  RUC         │  Teléfono                    │
│  ──────────────────────                     │
│  Contraseña (Full width)                   │
│  ──────────────────────                     │
└─────────────────────────────────────────────┘
```

### Mobile (< 640px)

```
┌──────────────┐
│              │
│ Tarjeta      │
│ Login        │
│              │
│ Campos       │
│              │
│ Botón        │
│              │
└──────────────┘

Registro en STACK VERTICAL:
┌──────────────┐
│ Nombre       │
│ ──────────   │
│ Apellido     │
│ ──────────   │
│ Email        │
│ ──────────   │
│ RUC          │
│ ──────────   │
│ Teléfono     │
│ ──────────   │
│ Dirección    │
│ ──────────   │
│ Contraseña   │
│ ──────────   │
│ Confirmar    │
│ ──────────   │
│ Botón        │
│              │
└──────────────┘
```

---

## 🔐 Indicadores de Seguridad

```
┌────────────────────────────────────────────────┐
│ CONTRASEÑA SEGURA                              │
│                                                 │
│ [•••••••••] [👁]  ← Toggle de visibilidad     │
│  (oculta)   (ícono para mostrar)              │
│                                                 │
│ Al hacer clic: [••••••••] → [MiPassword123]   │
│                                                 │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ VALIDACIÓN DE CONTRASEÑA EN REGISTRO           │
│                                                 │
│ Contraseña:   [••••••••]        [👁]          │
│               (6+ caracteres)                  │
│                                                 │
│ Confirmar:    [••••••••]        [👁]          │
│                                                 │
│ ✓ Las contraseñas coinciden ← Feedback visual │
│ (verde, con ícono de check)                    │
│                                                 │
│ Botón disponible solo cuando ✓                 │
│                                                 │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ VALIDACIÓN DE EMAIL                            │
│                                                 │
│ usuario       ❌ Email inválido (realtime)    │
│ usuario@      ❌ Email inválido               │
│ usuario@emp   ❌ Email inválido               │
│ usuario@emp.  ❌ Email inválido               │
│ usuario@emp.c ✓ Email válido (verde)         │
│ usuario@emp.c ✓ Email válido                 │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 🎯 Iconografía

```
🔓 Ojo abierto (Eye)
  ├─ Indica que se puede mostrar contraseña
  └─ Reemplazado por ojo cerrado cuando se muestra

🔒 Ojo cerrado (EyeOff)
  ├─ Indica que contraseña está oculta
  └─ Reemplazado por ojo abierto cuando se oculta

⚠️ Alerta (AlertCircle)
  ├─ Indica error en el formulario
  └─ Muestra junto a mensaje de error

✓ Check (CheckCircle2)
  ├─ Indica validación exitosa
  └─ Muestra en verde para éxito

⏳ Spinner
  ├─ Animado en botón durante carga
  └─ Indica procesamiento en curso
```

---

**Versión**: 1.0.0  
**Fecha**: 31 de diciembre de 2025
