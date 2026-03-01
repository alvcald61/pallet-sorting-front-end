# Guía de uso de componentes refactorizados

## OrderLayoutWrapper

### Propósito

Componente wrapper que encapsula toda la lógica de navegación y gestión de órdenes para los flujos de bulk y pallet.

### Ubicación

`src/app/order/components/OrderLayoutWrapper.tsx`

### Uso básico

```tsx
import OrderLayoutWrapper from "../components/OrderLayoutWrapper";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderLayoutWrapper
      orderType="BULK" // o "TWO_DIMENSIONAL"
      basePath="bulk" // o "pallet"
      stepsConfig={[
        { label: "First step", description: "Bultos" },
        { label: "Second step", description: "Envio y dirección" },
        { label: "Final step", description: "Resumen" },
      ]}
    >
      {children}
    </OrderLayoutWrapper>
  );
}
```

### Props

| Prop          | Tipo                          | Requerido | Descripción                        |
| ------------- | ----------------------------- | --------- | ---------------------------------- |
| `orderType`   | `"BULK" \| "TWO_DIMENSIONAL"` | ✓         | Tipo de orden a crear              |
| `basePath`    | `"bulk" \| "pallet"`          | ✓         | Ruta base para navegación          |
| `stepsConfig` | `Array<{label, description}>` | ✗         | Configuración de pasos del stepper |
| `children`    | `React.ReactNode`             | ✓         | Contenido a renderizar             |

### Qué hace

- ✅ Gestiona estado de navegación (pasos)
- ✅ Maneja redirecciones entre pasos
- ✅ Crea la orden cuando se completan todos los pasos
- ✅ Muestra notificación de éxito
- ✅ Renderiza stepper con pasos configurables
- ✅ Proporciona botones de navegación (Anterior/Siguiente/Enviar)

---

## OrderFormBase

### Propósito

Componente base para las páginas de formulario de órdenes que encapsula la estructura común (header, formulario, lista de items).

### Ubicación

`src/app/order/components/OrderFormBase.tsx`

### Uso básico

```tsx
import { OrderFormBase } from "../components/OrderFormBase";

const Page = () => {
  const formContent = <form>{/* Tu formulario aquí */}</form>;

  const itemsList = (
    <>
      {items.map((item) => (
        <ItemComponent key={item.id} {...item} />
      ))}
    </>
  );

  return (
    <OrderFormBase
      title="Título de la página"
      description="Descripción de la página"
      formContent={formContent}
      itemsList={itemsList}
      listTitle="Nombre de la lista"
    />
  );
};
```

### Props

| Prop          | Tipo        | Requerido | Descripción                             |
| ------------- | ----------- | --------- | --------------------------------------- |
| `title`       | `string`    | ✓         | Título principal de la página           |
| `description` | `string`    | ✓         | Subtítulo/descripción                   |
| `formContent` | `ReactNode` | ✓         | Contenido del formulario                |
| `itemsList`   | `ReactNode` | ✓         | Lista de items agregados                |
| `listTitle`   | `string`    | ✗         | Título de la lista (default: "Pallets") |

### Qué hace

- ✅ Renderiza estructura estándar de página
- ✅ Incluye breadcrumbs automáticos
- ✅ Aplica estilos consistentes
- ✅ Organiza el layout en 3 secciones: header, formulario, lista

---

## FormFieldInput

### Propósito

Componente reutilizable para campos de entrada numéricos con unidades.

### Ubicación

`src/app/order/components/FormFieldInput.tsx`

### Uso básico

```tsx
import { FormFieldInput } from "../components/FormFieldInput";

<FormFieldInput
  label="Peso"
  name="weight"
  placeholder="e.g., 5"
  value={form.weight}
  onChange={handleChange}
  unit="kg"
/>;
```

### Props

| Prop          | Tipo                       | Requerido | Descripción                            |
| ------------- | -------------------------- | --------- | -------------------------------------- |
| `label`       | `string`                   | ✓         | Etiqueta del campo                     |
| `name`        | `string`                   | ✓         | Nombre del campo (para formularios)    |
| `placeholder` | `string`                   | ✓         | Texto de ayuda                         |
| `value`       | `number \| string`         | ✓         | Valor actual del campo                 |
| `onChange`    | `(e: ChangeEvent) => void` | ✓         | Manejador de cambios                   |
| `unit`        | `string`                   | ✗         | Unidad a mostrar (ej: "kg", "m", "m3") |
| `disabled`    | `boolean`                  | ✗         | Deshabilitar el campo (default: false) |

### Ejemplo completo

```tsx
const [form, setForm] = useState({
  width: 0,
  height: 0,
  weight: 0,
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

return (
  <div>
    <FormFieldInput
      label="Ancho"
      name="width"
      placeholder="e.g., 1.5"
      value={form.width}
      onChange={handleChange}
      unit="m"
    />
    <FormFieldInput
      label="Alto"
      name="height"
      placeholder="e.g., 2"
      value={form.height}
      onChange={handleChange}
      unit="m"
    />
    <FormFieldInput
      label="Peso"
      name="weight"
      placeholder="e.g., 10"
      value={form.weight}
      onChange={handleChange}
      unit="kg"
    />
  </div>
);
```

---

## Cómo agregar un nuevo tipo de orden

### 1. Crear layout

```tsx
// src/app/order/newtype/layout.tsx
import OrderLayoutWrapper from "../components/OrderLayoutWrapper";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderLayoutWrapper
      orderType="NEW_TYPE" // Agregar tipo en createOrder API
      basePath="newtype"
      stepsConfig={[
        { label: "First step", description: "Crear" },
        { label: "Second step", description: "Dirección" },
        { label: "Final step", description: "Resumen" },
      ]}
    >
      {children}
    </OrderLayoutWrapper>
  );
}
```

### 2. Crear página

```tsx
// src/app/order/newtype/page.tsx
"use client";
import { OrderFormBase } from "../components/OrderFormBase";

export default function Page() {
  // Tu lógica aquí

  const formContent = (
    // Tu formulario aquí
  );

  const itemsList = (
    // Tu lista aquí
  );

  return (
    <OrderFormBase
      title="Título"
      description="Descripción"
      formContent={formContent}
      itemsList={itemsList}
    />
  );
}
```

### 3. Actualizar API

En `src/lib/api/order/orderApi.ts`, asegurate que `createOrder` soporte el nuevo tipo de orden.

---

## Mejores prácticas

### ✅ DO

- Usa `OrderFormBase` para consistencia visual
- Usa `FormFieldInput` para campos numéricos con unidades
- Mantén la configuración de pasos coherente
- Extrae el contenido del formulario en variables para mejor legibilidad

### ❌ DON'T

- No agregues lógica de navegación dentro de las páginas
- No uses estilos inline para campos de formulario
- No dupliques la estructura de `OrderFormBase`
- No crees nuevos layouts sin usar `OrderLayoutWrapper`

---

## Debugging

### Problemas comunes

**El stepper no muestra los pasos correctos**

- Verifica que `stepsConfig` tiene la estructura correcta
- Asegúrate de que los `label` y `description` no estén vacíos

**El formulario no se valida**

- Usa `Formik` directamente con `validationSchema`
- Los mensajes de error se renderizan dentro de `OrderFormBase`

**Los campos de entrada no se ven correctamente**

- Verifica que el `onChange` handler está correctamente vinculado
- Asegúrate de que el estado del formulario se actualiza

---

## Performance

- `OrderLayoutWrapper` usa `usePathname()` para detección de cambios de ruta
- `OrderFormBase` es un componente funcional sin estado innecesario
- `FormFieldInput` es ligero y sin efectos secundarios

No hay problemas de performance conocidos con estos componentes.
