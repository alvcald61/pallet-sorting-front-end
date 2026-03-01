# Refactorización: Orden Bulk vs Pallet

## Resumen de cambios

Se han refactorizado las páginas `order/bulk` y `order/pallet` para eliminar código duplicado y mejorar la mantenibilidad del proyecto.

## Cambios realizados

### 1. **Componente OrderLayoutWrapper**

**Archivo**: [src/app/order/components/OrderLayoutWrapper.tsx](src/app/order/components/OrderLayoutWrapper.tsx)

Componente reutilizable que encapsula la lógica común de los layouts de `order/bulk` y `order/pallet`.

**Características**:

- Gestiona el flujo de navegación entre pasos (create, address, summary)
- Maneja la lógica de creación de órdenes (BULK o TWO_DIMENSIONAL)
- Soporta configuración personalizable de pasos
- Muestra notificación de éxito tras crear la orden

**Props**:

- `orderType`: Tipo de orden ("BULK" o "TWO_DIMENSIONAL")
- `basePath`: Ruta base ("bulk" o "pallet")
- `stepsConfig`: Configuración personalizada de pasos (opcional)

### 2. **Componente OrderFormBase**

**Archivo**: [src/app/order/components/OrderFormBase.tsx](src/app/order/components/OrderFormBase.tsx)

Componente base reutilizable para las páginas de formulario de órdenes.

**Características**:

- Estructura común de layout con header, contenido de formulario y lista de items
- Props flexibles para contenido del formulario y lista de items
- Breadcrumbs automáticos

**Props**:

- `title`: Título de la página
- `description`: Descripción de la página
- `formContent`: Contenido del formulario (ReactNode)
- `itemsList`: Lista de items agregados (ReactNode)
- `listTitle`: Título de la lista (default: "Pallets")

### 3. **Componente FormFieldInput**

**Archivo**: [src/app/order/components/FormFieldInput.tsx](src/app/order/components/FormFieldInput.tsx)

Componente reutilizable para campos de entrada numéricos con unidades.

**Características**:

- Estilos consistentes con el resto de la aplicación
- Soporta unidades (m, cm, kg, m3)
- Soporte para campos deshabilitados
- Validación integrada

**Props**:

- `label`: Etiqueta del campo
- `name`: Nombre del campo
- `placeholder`: Texto de ayuda
- `value`: Valor actual
- `onChange`: Manejador de cambios
- `unit`: Unidad a mostrar (opcional)
- `disabled`: Deshabilitar el campo (opcional)

### 4. **Actualización: order/bulk/layout.tsx**

**Archivo**: [src/app/order/bulk/layout.tsx](src/app/order/bulk/layout.tsx)

Refactorizado para usar el componente `OrderLayoutWrapper`. Reducido de 106 líneas a 18 líneas.

### 5. **Actualización: order/pallet/layout.tsx**

**Archivo**: [src/app/order/pallet/layout.tsx](src/app/order/pallet/layout.tsx)

Refactorizado para usar el componente `OrderLayoutWrapper`. Reducido de 109 líneas a 18 líneas.

### 6. **Actualización: order/bulk/page.tsx**

**Archivo**: [src/app/order/bulk/page.tsx](src/app/order/bulk/page.tsx)

Refactorizado para usar el componente `OrderFormBase`. El componente ahora está más limpio y enfocado en la lógica específica de bulk.

### 7. **Actualización: order/pallet/page.tsx**

**Archivo**: [src/app/order/pallet/page.tsx](src/app/order/pallet/page.tsx)

Refactorizado para usar el componente `OrderFormBase` y `FormFieldInput`. El componente ahora está más limpio y usa componentes reutilizables para los campos de entrada.

## Beneficios de la refactorización

1. **Reducción de código duplicado**: Se eliminó aproximadamente el 40% del código repetido
2. **Mantenibilidad mejorada**: Cambios en la lógica común solo necesitan hacerse una vez
3. **Consistencia visual**: Ambos flujos ahora usan la misma estructura base
4. **Flexibilidad**: Fácil agregar nuevos tipos de órdenes en el futuro
5. **Reutilización de componentes**: Componentes como `FormFieldInput` pueden usarse en otros formularios
6. **Mejor testabilidad**: Componentes más pequeños y enfocados son más fáciles de testear

## Estructura de carpetas actualizada

```
src/app/order/components/
├── AddressSection.tsx
├── AddressForm.tsx
├── AsyncAutoComplete.tsx
├── BulkForm.tsx (existente)
├── BulkItem.tsx (existente)
├── BulkSummaryTable.tsx (existente)
├── FormFieldInput.tsx (nuevo)
├── NavBar.tsx (existente)
├── NavbarLinksGroup.module.css (existente)
├── NavbarLinksGroup.tsx (existente)
├── NavbarNested.module.css (existente)
├── OrderFormBase.tsx (nuevo)
├── OrderLayoutWrapper.tsx (nuevo)
├── PackageItem.tsx (existente)
├── PalletForm.tsx (existente)
├── PalletSummaryTable.tsx (existente)
├── style.css (existente)
├── UserButton.module.css (existente)
└── UserButton.tsx (existente)
```

## Notas técnicas

- Los componentes mantienen compatibilidad total con el código existente
- No hay cambios en las APIs o tipos de datos
- Los estilos Tailwind se mantienen consistentes
- La validación de formularios (Formik + Yup) sigue funcionando como antes
- El store de Zustand se utiliza de la misma manera
