# Comparativa: Antes vs Después de la Refactorización

## 📊 Estadísticas de reducción de código

| Archivo                 | Antes          | Después        | Reducción |
| ----------------------- | -------------- | -------------- | --------- |
| order/bulk/layout.tsx   | 106 líneas     | 22 líneas      | 79% ↓     |
| order/pallet/layout.tsx | 109 líneas     | 22 líneas      | 80% ↓     |
| order/bulk/page.tsx     | 183 líneas     | 141 líneas     | 23% ↓     |
| order/pallet/page.tsx   | 272 líneas     | 192 líneas     | 29% ↓     |
| **Total**               | **670 líneas** | **377 líneas** | **44% ↓** |

## 🔍 Comparativa de layouts

### ANTES: order/bulk/layout.tsx (106 líneas)

```tsx
"use client";
import React, { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { Notification } from "@mantine/core";
import { Button, Group, Stepper } from "@mantine/core";
import useOrderStore from "@/lib/store/OrderStore";
import { createOrder } from "@/lib/api/order/orderApi";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const steps = ["", "address", "summary"];
  const [active, setActive] = useState(0);
  const { bulkOrder, address, userId } = useOrderStore();
  const [notificationVisible, setNotificationVisible] = useState(false);

  const callOrderApi = async () => {
    try {
      const response = await createOrder(
        {
          pallets: bulkOrder,
          ...address,
          zoneId: 1,
          deliveryDate: `${address.date} ${address.time}`,
          userId: userId || "",
        },
        "BULK"
      );
      // ... código de notificación
    } catch (error) {
      // ... manejo de error
    }
  };

  // ... más código de navegación y lógica

  return <div className="...">{/* JSX */}</div>;
}
```

### DESPUÉS: order/bulk/layout.tsx (22 líneas)

```tsx
import OrderLayoutWrapper from "../components/OrderLayoutWrapper";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderLayoutWrapper
      orderType="BULK"
      basePath="bulk"
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

## 🔍 Comparativa de páginas

### ANTES: order/pallet/page.tsx (parcial)

```tsx
// Múltiples campos de entrada duplicados
<label className="flex flex-col min-w-40 flex-1">
  <p className="text-base font-medium leading-normal pb-2">Largo</p>
  <div className="relative flex items-center">
    <input
      disabled={selectedPallet !== "custom"}
      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal disabled:opacity-50"
      placeholder="e.g., 20"
      value={form.length}
      onChange={handleChange}
      name="length"
    />
    <span className="absolute right-4 text-gray-500 dark:text-gray-400">m</span>
  </div>
</label>

// ... repetido para ancho, altura, peso, cantidad
```

### DESPUÉS: order/pallet/page.tsx (parcial)

```tsx
// Componente reutilizable
<FormFieldInput
  label="Largo"
  name="length"
  placeholder="e.g., 20"
  value={form.length}
  onChange={handleChange}
  unit="m"
  disabled={selectedPallet !== "custom"}
/>

<FormFieldInput
  label="Ancho"
  name="width"
  placeholder="e.g., 20"
  value={form.width}
  onChange={handleChange}
  unit="m"
  disabled={selectedPallet !== "custom"}
/>
```

## 💡 Beneficios clave

### 1. **Mantenibilidad**

- ✅ Cambios en lógica común: 1 lugar en lugar de 2
- ✅ Cambios en estilos de campos: 1 lugar en lugar de 5+

### 2. **Consistencia**

- ✅ Ambos flujos (bulk/pallet) tienen el mismo comportamiento
- ✅ Mismos estilos y componentes visuales

### 3. **Reutilización**

- ✅ `OrderLayoutWrapper` puede usarse para nuevos tipos de órdenes
- ✅ `FormFieldInput` puede usarse en otros formularios
- ✅ `OrderFormBase` puede adaptarse para otras estructuras similares

### 4. **Testing**

- ✅ Menos código = menos superficies de ataque para bugs
- ✅ Componentes independientes más fáciles de testear

## 🎯 Próximos pasos opcionales

1. **Extraer validación de formularios**: Crear un hook reutilizable para las schemas de Yup
2. **Componente para el selector de pallets**: Extraer la lógica de selección en un componente
3. **Hooks personalizados**: Crear `useOrderForm` para la lógica del formulario
4. **Tests unitarios**: Agregar tests para los nuevos componentes

## 📝 Notas técnicas

- Los cambios son 100% compatibles hacia atrás
- No hay cambios en las APIs públicas
- Todas las funcionalidades se mantienen igual
- Los tipos de datos son iguales
- La compatibilidad con Zustand se mantiene
