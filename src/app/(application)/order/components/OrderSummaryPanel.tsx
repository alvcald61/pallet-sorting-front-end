"use client";

import { Paper, Title, Text, Group, Badge, Divider, Stack, Box, Button, ScrollArea } from "@mantine/core";
import { IconPackage, IconWeight, IconRuler, IconTrash, IconCopy } from "@tabler/icons-react";
import useOrderStore from "@/lib/store/OrderStore";
import { Bulk } from "@/lib/types/bulkType";
import { Pallet } from "@/lib/types/palletType";

interface OrderSummaryPanelProps {
  orderType: "bulk" | "pallet";
  showPricing?: boolean;
}

export function OrderSummaryPanel({
  orderType,
  showPricing = false,
}: OrderSummaryPanelProps) {
  const { bulkOrder, palletOrder, address, deleteItem } = useOrderStore();

  const items = orderType === "bulk" ? bulkOrder : palletOrder;

  // Calculate totals
  const totals = items.reduce(
    (acc, item) => {
      const itemWeight = item.weight * (item.quantity || 1);
      // Check if it's a Bulk (has volume) or Pallet (has length/width/height)
      const itemVolume = 'volume' in item
        ? item.volume
        : (item.length * item.width * item.height);

      return {
        totalWeight: acc.totalWeight + itemWeight,
        totalVolume: acc.totalVolume + (itemVolume * (item.quantity || 1)),
        totalItems: acc.totalItems + (item.quantity || 1),
      };
    },
    { totalWeight: 0, totalVolume: 0, totalItems: 0 }
  );

  // Estimate pricing (basic calculation)
  const estimatedCost = useMemo(() => {
    if (!showPricing) return 0;

    // Base rate: $50 per m³ + $10 per 100kg
    const volumeCost = totals.totalVolume * 50;
    const weightCost = (totals.totalWeight / 100) * 10;
    const baseCost = volumeCost + weightCost;

    // Distance multiplier (simplified - would need actual distance from API)
    const distanceMultiplier = 1.2;

    return Math.round(baseCost * distanceMultiplier);
  }, [totals, showPricing]);

  const handleDuplicateItem = (item: Bulk | Pallet) => {
    const { addBulk, addPallet } = useOrderStore.getState();
    const duplicated = { ...item, tempId: crypto.randomUUID() };

    if (orderType === "bulk") {
      addBulk(duplicated as Bulk);
    } else {
      addPallet(duplicated as Pallet);
    }
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder style={{ height: "100%", maxHeight: "calc(100vh - 100px)" }}>
      <Title order={4} mb="md">
        Resumen del Pedido
      </Title>

      {/* Totals Summary */}
      <Stack gap="xs" mb="md">
        <Group justify="apart">
          <Text size="sm" c="dimmed">Total de items:</Text>
          <Badge size="lg" variant="filled" color="blue">
            {totals.totalItems}
          </Badge>
        </Group>

        <Group justify="apart">
          <Group gap="xs">
            <IconWeight size={16} />
            <Text size="sm" c="dimmed">Peso total:</Text>
          </Group>
          <Text fw={600}>{totals.totalWeight.toFixed(2)} kg</Text>
        </Group>

        <Group justify="apart">
          <Group gap="xs">
            <IconRuler size={16} />
            <Text size="sm" c="dimmed">Volumen total:</Text>
          </Group>
          <Text fw={600}>{totals.totalVolume.toFixed(2)} m³</Text>
        </Group>

        {showPricing && estimatedCost > 0 && (
          <>
            <Divider my="xs" />
            <Group justify="apart">
              <Text size="sm" fw={700}>Costo estimado:</Text>
              <Text size="lg" fw={700} c="blue">
                ${estimatedCost.toLocaleString()}
              </Text>
            </Group>
            <Text size="xs" c="dimmed" ta="center">
              *Precio estimado, sujeto a confirmación
            </Text>
          </>
        )}
      </Stack>

      <Divider my="md" />

      {/* Address Summary */}
      {address.fromAddress?.address && (
        <Box mb="md">
          <Text size="sm" fw={600} mb="xs">Dirección de recojo:</Text>
          <Text size="xs" c="dimmed" lineClamp={2}>
            {address.fromAddress.address}
          </Text>

          {address.toAddress?.address && (
            <>
              <Text size="sm" fw={600} mt="sm" mb="xs">Dirección de entrega:</Text>
              <Text size="xs" c="dimmed" lineClamp={2}>
                {address.toAddress.address}
              </Text>
            </>
          )}

          {address.date && (
            <>
              <Text size="sm" fw={600} mt="sm" mb="xs">Fecha de recojo:</Text>
              <Text size="xs" c="dimmed">
                {address.date} {address.time && `a las ${address.time}`}
              </Text>
            </>
          )}
        </Box>
      )}

      <Divider my="md" />

      {/* Items List */}
      <Text size="sm" fw={600} mb="xs">
        Items ({items.length}):
      </Text>

      <ScrollArea style={{ maxHeight: 300 }}>
        <Stack gap="xs">
          {items.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No hay items agregados
            </Text>
          ) : (
            items.map((item, index) => (
              <Paper key={item.tempId} p="xs" withBorder radius="sm">
                <Group justify="space-between" mb="xs">
                  <Badge size="sm" variant="dot">
                    {orderType === "bulk" ? "Bulto" : "Pallet"} #{index + 1}
                  </Badge>
                  <Group gap={4}>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="blue"
                      onClick={() => handleDuplicateItem(item)}
                      px={8}
                    >
                      <IconCopy size={14} />
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => deleteItem(item.tempId)}
                      px={8}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </Group>
                </Group>

                <Stack gap={4}>
                  <Group gap="xs">
                    <IconPackage size={14} />
                    <Text size="xs">Cantidad: {item.quantity || 1}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconWeight size={14} />
                    <Text size="xs">Peso: {item.weight} kg</Text>
                  </Group>
                  {orderType === "pallet" && "length" in item && "width" in item && "height" in item && (
                    <Group gap="xs">
                      <IconRuler size={14} />
                      <Text size="xs">
                        {(item as any).length}m × {(item as any).width}m × {(item as any).height}m
                      </Text>
                    </Group>
                  )}
                  {orderType === "bulk" && "volume" in item && (
                    <Group gap="xs">
                      <IconRuler size={14} />
                      <Text size="xs">Volumen: {(item as any).volume} m³</Text>
                    </Group>
                  )}
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}

// Add useMemo import
import { useMemo } from "react";
