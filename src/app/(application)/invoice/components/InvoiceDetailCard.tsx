"use client";

import { Card, Group, SimpleGrid, Text, Title } from "@mantine/core";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { Invoice } from "@/lib/types/invoiceTypes";

interface Props {
  invoice: Invoice;
}

export default function InvoiceDetailCard({ invoice }: Props) {
  return (
    <Card withBorder radius="md" p="lg" mb="lg">
      <Group justify="space-between" mb="md">
        <Title order={3}>{invoice.invoiceNumber}</Title>
        <InvoiceStatusBadge status={invoice.userId ? invoice.status : null} />
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase">Cliente</Text>
          <Text fw={600}>{invoice.clientBusinessName ?? invoice.clientName}</Text>
          <Text size="sm" c="dimmed">RUC: {invoice.clientRuc}</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase">Fechas</Text>
          <Text size="sm">Emisión: {invoice.issueDate}</Text>
          {invoice.dueDate && <Text size="sm">Vencimiento: {invoice.dueDate}</Text>}
          {invoice.paidAt && (
            <Text size="sm" c="green">
              Pagado el: {new Date(invoice.paidAt).toLocaleDateString("es-PE")}
            </Text>
          )}
        </div>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase">Montos</Text>
          <Text size="sm">Subtotal: {invoice.currency} {Number(invoice.subtotal).toFixed(2)}</Text>
          <Text size="sm">IGV: {invoice.currency} {Number(invoice.igv).toFixed(2)}</Text>
          <Text fw={700}>Total: {invoice.currency} {Number(invoice.total).toFixed(2)}</Text>
        </div>
      </SimpleGrid>
    </Card>
  );
}
