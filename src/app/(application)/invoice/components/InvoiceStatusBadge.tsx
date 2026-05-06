"use client";

import { Badge } from "@mantine/core";
import { InvoiceStatus } from "@/lib/types/invoiceTypes";

interface Props {
  status: InvoiceStatus | null;
}

export default function InvoiceStatusBadge({ status }: Props) {
  if (!status) {
    return <Badge color="orange">Sin asignar</Badge>;
  }
  if (status === InvoiceStatus.PAID) {
    return <Badge color="green">Pagado</Badge>;
  }
  return <Badge color="yellow">Pendiente</Badge>;
}
