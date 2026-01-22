# Guía de Implementación: Carga de Documentos

## Descripción General

Se ha añadido una funcionalidad de dropzone (arrastrar y soltar) a la página de detalles de orden para permitir que los usuarios carguen documentos cuando el estado de la orden es `APPROVED`.

## Componentes Creados/Modificados

### 1. **DocumentUploadZone Component**

- **Archivo**: `src/app/(application)/order/components/DocumentUploadZone.tsx`
- **Tipo**: Componente cliente ('use client')
- **Funcionalidad**:
  - Renderiza una zona de dropzone para cada documento de la orden
  - Distingue entre documentos requeridos y opcionales con badges
  - Muestra el estado del documento (Completado/Pendiente)
  - Soporta carga de archivos PDF e imágenes
  - Muestra barra de progreso durante la carga
  - Máximo de 50MB por archivo

### 2. **API Function - uploadOrderDocument**

- **Archivo**: `src/lib/api/order/orderApi.ts`
- **Función**: `uploadOrderDocument(orderId: string, documentId: number, file: File)`
- **Endpoint**: `POST /api/order/{orderId}/documents/{documentId}/upload`
- **Descripción**: Sube un archivo de documento al servidor

### 3. **Página de Orden Actualizada**

- **Archivo**: `src/app/(application)/order/[orderId]/page.tsx`
- **Cambios**:
  - Se integró el componente `DocumentUploadZone`
  - Solo se muestra cuando `orderStatus === OrderStatus.APPROVED`
  - Se coloca después de la sección de paquetes

### 4. **Componente OrderDetailsClient (Opcional)**

- **Archivo**: `src/app/(application)/order/components/OrderDetailsClient.tsx`
- **Nota**: Este componente se creó pero actualmente no se está utilizando. Puedes usarlo si necesitas agregar más lógica de cliente en el futuro.

## Cómo Personalizar

### 1. **Cambiar los Documentos Requeridos**

En la página de orden (`[orderId]/page.tsx`), busca esta línea:

```typescript
requiredDocuments={["Factura", "Comprobante de entrega"]}
```

Personaliza el array con los nombres de los documentos que sean requeridos:

```typescript
requiredDocuments={["Documento A", "Documento B", "Documento C"]}
```

El componente automáticamente mostrará como "Requerido" (badge rojo) los que estén en esta lista y "Opcional" (badge gris) los que no.

### 2. **Cambiar Tipos de Archivo Soportados**

En el componente `DocumentUploadZone.tsx`, modifica:

```typescript
accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
```

Ejemplos:

```typescript
// Solo PDF
accept={[...PDF_MIME_TYPE]}

// Solo imágenes
accept={[...IMAGE_MIME_TYPE]}

// Imágenes, PDF y documentos Word
import { WORD_MIME_TYPE } from "@mantine/dropzone";
accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE, ...WORD_MIME_TYPE]}
```

### 3. **Cambiar Tamaño Máximo de Archivo**

Busca esta línea en `DocumentUploadZone.tsx`:

```typescript
maxSize={50 * 1024 * 1024}  // 50MB
```

Cambia a:

```typescript
maxSize={10 * 1024 * 1024}  // 10MB
maxSize={100 * 1024 * 1024} // 100MB
```

### 4. **Cambiar Condición de Visualización**

En la página de orden, actualmente se muestra solo cuando `orderStatus === OrderStatus.APPROVED`. Para cambiar esto:

```typescript
{order.orderStatus === OrderStatus.APPROVED && order.documents && order.documents.length > 0 && (
```

Puedes cambiar `OrderStatus.APPROVED` a otro estado como:

- `OrderStatus.REVIEW`
- `OrderStatus.PENDING`
- O crear una lógica más compleja

## Flujo de Carga

1. El usuario arrastra un archivo al dropzone o hace clic para seleccionar
2. Se valida el tipo de archivo y tamaño
3. Se muestra una barra de progreso
4. Se llamada a `uploadOrderDocument()` que envía el archivo al backend
5. Si tiene éxito, se muestra el nombre del archivo con un checkmark
6. El usuario puede hacer clic en "Cambiar" para cargar un archivo diferente
7. Si hay error, se muestra un mensaje de alerta

## Estructura de Datos

La estructura de documentos viene del tipo `Order`:

```typescript
export interface Document {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
```

Cada documento tiene:

- `id`: Identificador único del documento
- `title`: Nombre/título del documento (usado para distinguir requerido/opcional)
- `completed`: Indica si ya fue completado
- `userId`: ID del usuario que lo cargó

## Notas Importantes

- El componente `DocumentUploadZone` es un componente cliente ('use client'), lo que permite usar hooks como `useState`
- La carga es asincrónica y se maneja con la API que definiste
- Los archivos se validan en el cliente antes de enviar al servidor
- El componente maneja automáticamente errores y éxito de carga
- Los documentos solo se muestran cuando hay documentos en la orden (`order.documents.length > 0`)

## Próximos Pasos

1. Verifica que el endpoint `POST /api/order/{orderId}/documents/{documentId}/upload` esté implementado en tu backend
2. Personaliza la lista de documentos requeridos según tus necesidades
3. Ajusta tipos de archivo y tamaños máximos si es necesario
4. Prueba la funcionalidad en una orden con estado APPROVED
