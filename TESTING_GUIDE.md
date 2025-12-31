# Guía de Pruebas - Sistema de Autenticación y Registro

## Acceso a las Páginas

### Login
- **URL**: `http://localhost:3001/login`
- **Descripción**: Página para iniciar sesión con email y contraseña

### Registro
- **URL**: `http://localhost:3001/sign-up`
- **Descripción**: Página para crear una nueva cuenta de cliente

---

## Casos de Prueba del Login

### Test 1: Login Exitoso
**Precondiciones**: Tener una cuenta existente en el sistema

**Pasos**:
1. Ir a `/login`
2. Ingresar email válido
3. Ingresar contraseña correcta
4. Hacer clic en "Ingresar"

**Resultado esperado**: 
- ✅ Redirección a `/order`
- ✅ Usuario autenticado

---

### Test 2: Email Inválido
**Pasos**:
1. Ir a `/login`
2. Ingresar texto que no es un email (ej: "usuario")
3. Observar el campo de email

**Resultado esperado**:
- ✅ Mensaje de error: "Ingresa un correo válido"
- ✅ El campo cambia de color

---

### Test 3: Campos Vacíos
**Pasos**:
1. Ir a `/login`
2. Dejar campos vacíos
3. Hacer clic en "Ingresar"

**Resultado esperado**:
- ✅ Mensaje de error: "Email y contraseña son requeridos"

---

### Test 4: Credenciales Incorrectas
**Pasos**:
1. Ir a `/login`
2. Ingresar email válido
3. Ingresar contraseña incorrecta
4. Hacer clic en "Ingresar"

**Resultado esperado**:
- ✅ Mensaje de error: "Email o contraseña incorrectos"
- ✅ Permanece en la página de login

---

### Test 5: Toggle de Contraseña
**Pasos**:
1. Ir a `/login`
2. Ingresar algo en el campo de contraseña
3. Hacer clic en el ícono de ojo a la derecha del campo
4. Hacer clic nuevamente

**Resultado esperado**:
- ✅ Primera vez: Se muestra la contraseña en texto plano
- ✅ Segunda vez: Se oculta nuevamente con puntos

---

### Test 6: Link a Registro
**Pasos**:
1. Ir a `/login`
2. Hacer clic en "Regístrate aquí"

**Resultado esperado**:
- ✅ Redirección a `/sign-up`

---

## Casos de Prueba del Registro

### Test 1: Registro Exitoso
**Pasos**:
1. Ir a `/sign-up`
2. Completar todos los campos:
   - Nombre: Juan
   - Apellido: Pérez
   - Email: juan@empresa.com (email no existente)
   - Razón Social: Mi Empresa S.A.C.
   - RUC: 20123456789
   - Teléfono: +51 987654321
   - Dirección: Calle Principal 123, Lima
   - Contraseña: MiPassword123
   - Confirmar: MiPassword123
3. El botón "Crear cuenta" debe estar habilitado
4. Hacer clic en "Crear cuenta"

**Resultado esperado**:
- ✅ Procesamiento en curso (spinner)
- ✅ Redirección a `/order` (autenticación automática)
- ✅ Usuario puede acceder al sistema

---

### Test 2: Contraseñas No Coinciden
**Pasos**:
1. Ir a `/sign-up`
2. Completar todos los campos excepto:
   - Contraseña: MiPassword123
   - Confirmar: OtraPassword456
3. Observar el campo de "Confirmar contraseña"

**Resultado esperado**:
- ✅ Mensaje en rojo: "Las contraseñas no coinciden"
- ✅ Botón "Crear cuenta" deshabilitado (disabled)
- ✅ El botón está opaco y no es clickeable

---

### Test 3: Contraseñas Coinciden
**Pasos**:
1. Ir a `/sign-up`
2. Completar todos los campos con:
   - Contraseña: MiPassword123
   - Confirmar: MiPassword123
3. Observar el campo de "Confirmar contraseña"

**Resultado esperado**:
- ✅ Mensaje en verde con ✓: "Las contraseñas coinciden"
- ✅ Botón "Crear cuenta" habilitado (enabled)
- ✅ Puede hacerse clic en el botón

---

### Test 4: Email Duplicado
**Pasos**:
1. Ir a `/sign-up`
2. Completar todos los campos con un email que ya existe en el sistema
3. Hacer clic en "Crear cuenta"

**Resultado esperado**:
- ✅ Mensaje de error: "Este email ya está registrado"

---

### Test 5: Email Inválido
**Pasos**:
1. Ir a `/sign-up`
2. En el campo de email ingresar: "usuario"
3. Hacer clic en "Crear cuenta"

**Resultado esperado**:
- ✅ Mensaje de error en el servidor
- ✅ El formulario se mantiene con los datos ingresados

---

### Test 6: Campos Vacíos
**Pasos**:
1. Ir a `/sign-up`
2. Hacer clic en "Crear cuenta" sin completar campos

**Resultado esperado**:
- ✅ Mensaje de error: "Todos los campos son requeridos"

---

### Test 7: Contraseña Muy Corta
**Pasos**:
1. Ir a `/sign-up`
2. En los campos de contraseña ingresar: "123"
3. Hacer clic en "Crear cuenta"

**Resultado esperado**:
- ✅ Mensaje de error: "La contraseña debe tener al menos 6 caracteres"

---

### Test 8: RUC Inválido
**Pasos**:
1. Ir a `/sign-up`
2. En el campo RUC ingresar: "123"
3. Hacer clic en "Crear cuenta"

**Resultado esperado**:
- ✅ Mensaje de error: "El RUC debe tener al menos 10 caracteres"

---

### Test 9: Teléfono Inválido
**Pasos**:
1. Ir a `/sign-up`
2. En el campo Teléfono ingresar: "123"
3. Hacer clic en "Crear cuenta"

**Resultado esperado**:
- ✅ Mensaje de error: "El formato del teléfono no es válido"

---

### Test 10: Toggle de Contraseña
**Pasos**:
1. Ir a `/sign-up`
2. En el campo de contraseña ingresar: "MiPassword123"
3. Hacer clic en el ícono de ojo
4. Repetir para "Confirmar contraseña"

**Resultado esperado**:
- ✅ Las contraseñas se muestran en texto plano
- ✅ Al hacer clic nuevamente, se ocultan

---

### Test 11: Link a Login
**Pasos**:
1. Ir a `/sign-up`
2. Hacer clic en "Inicia sesión"

**Resultado esperado**:
- ✅ Redirección a `/login`

---

## Pruebas de Validación Visual

### Test 1: Validación Email (Login)
**Pasos**:
1. Ir a `/login`
2. Ingresar en el email: "usuario"
3. Observar en tiempo real

**Resultado esperado**:
- ✅ Texto de error aparece bajo el campo
- ✅ El campo puede cambiar de color
- ✅ El error desaparece al ingresar un email válido

---

### Test 2: Indicadores de Contraseña (Registro)
**Pasos**:
1. Ir a `/sign-up`
2. Ingresar en ambos campos de contraseña: "abc123"
3. Observar el indicador

**Resultado esperado**:
- ✅ Mensaje verde con ✓ aparece bajo el campo de confirmar
- ✅ Indicador dice "Las contraseñas coinciden"

---

## Pruebas Responsivas

### Test 1: Vista Móvil (Login)
**Pasos**:
1. Abrir DevTools (F12)
2. Activar modo dispositivo móvil
3. Ir a `/login`

**Resultado esperado**:
- ✅ La tarjeta se adapta al ancho de pantalla
- ✅ Todos los elementos son legibles
- ✅ Los botones son fáciles de hacer clic

---

### Test 2: Vista Móvil (Registro)
**Pasos**:
1. Abrir DevTools (F12)
2. Activar modo dispositivo móvil
3. Ir a `/sign-up`
4. Scroll hacia abajo

**Resultado esperado**:
- ✅ Los campos se apilan verticalmente
- ✅ La tarjeta es responsive
- ✅ Todo el contenido es accesible

---

## Pruebas de Rendimiento

### Test 1: Carga de Página
**Pasos**:
1. Abrir DevTools (Network)
2. Ir a `/login`
3. Observar el tiempo de carga

**Resultado esperado**:
- ✅ La página carga en menos de 2 segundos
- ✅ Los estilos se aplican correctamente
- ✅ No hay errores en la consola

---

### Test 2: Envío de Formulario
**Pasos**:
1. Ir a `/login`
2. Ingresar credenciales
3. Hacer clic en "Ingresar"
4. Observar el spinner

**Resultado esperado**:
- ✅ El spinner se muestra inmediatamente
- ✅ El botón se deshabilita durante el procesamiento
- ✅ La redirección ocurre después de recibir respuesta

---

## Notas Importantes

1. **Datos de Prueba**: Usa emails reales pero inventados para pruebas
2. **Backend**: Asegúrate que el backend esté corriendo
3. **Variables de Entorno**: Verifica que `NEXT_PUBLIC_BACKEND_HOST` esté configurado
4. **Console**: Abre la consola del navegador (F12) para ver logs

---

## Checklist Final

- [ ] Login funciona con credenciales correctas
- [ ] Login rechaza credenciales incorrectas
- [ ] Registro crea nuevas cuentas exitosamente
- [ ] Validaciones funcionan en cliente y servidor
- [ ] Navegación entre login y registro funciona
- [ ] Toggles de contraseña funcionan
- [ ] Indicadores visuales aparecen correctamente
- [ ] Mensajes de error son claros
- [ ] La página es responsive en móvil
- [ ] No hay errores en la consola

---

**Última actualización**: 31 de diciembre de 2025
