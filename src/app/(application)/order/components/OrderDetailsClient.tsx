"use client";

import { useState } from "react";
import DocumentUploadZone from "./DocumentUploadZone";
import { Order } from "@/lib/types/orderTypes";

interface OrderDetailsClientProps {
  order: Order;
  image: string | null;
}

export default function OrderDetailsClient({
  order,
  image,
}: OrderDetailsClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Lista de documentos requeridos - personaliza según tu necesidad
  const requiredDocuments = ["Factura", "Comprobante de entrega"];

  return (
    <DocumentUploadZone
      orderId={order.id}
      documents={order.documents}
      requiredDocuments={requiredDocuments}
      onUploadComplete={() => setRefreshKey((prev) => prev + 1)}
    />
  );
}
