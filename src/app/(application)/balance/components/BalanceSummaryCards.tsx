"use client";

import { Card, Group, SimpleGrid, Skeleton, Text, Title } from "@mantine/core";
import { IconCash, IconCheck, IconClock } from "@tabler/icons-react";
import { InvoiceBalance } from "@/lib/types/invoiceTypes";

interface Props {
  balance: InvoiceBalance | undefined;
  isLoading: boolean;
  currency?: string;
}

export default function BalanceSummaryCards({ balance, isLoading, currency = "S/." }: Props) {
  const fmt = (v: number | undefined) =>
    v !== undefined ? `${currency} ${Number(v).toFixed(2)}` : `${currency} 0.00`;

  const cards = [
    {
      label: "Total Facturado",
      value: balance?.totalBilled,
      icon: <IconCash size={20} />,
      color: "#228be6",
    },
    {
      label: "Total Pagado",
      value: balance?.totalPaid,
      icon: <IconCheck size={20} />,
      color: "#40c057",
    },
    {
      label: "Saldo Pendiente",
      value: balance?.pending,
      icon: <IconClock size={20} />,
      color: "#fab005",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
      {cards.map((card) => (
        <Card key={card.label} withBorder radius="md" p="lg">
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" tt="uppercase">
              {card.label}
            </Text>
            <span style={{ color: card.color }}>{card.icon}</span>
          </Group>
          {isLoading ? (
            <Skeleton height={28} />
          ) : (
            <Title order={3} style={{ color: card.color }}>
              {fmt(card.value)}
            </Title>
          )}
        </Card>
      ))}
    </SimpleGrid>
  );
}
