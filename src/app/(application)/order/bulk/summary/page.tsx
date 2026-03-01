"use client";

import { ImprovedOrderLayout } from "../../components/ImprovedOrderLayout";
import { useOrderDraft } from "@/lib/hooks/useOrderDraft";
import { Paper, Title, Stack, Group, Button, Divider, Alert, Badge, Text } from "@mantine/core";
import { IconCheck, IconAlertCircle, IconReceipt } from "@tabler/icons-react";
import useOrderStore from "@/lib/store/OrderStore";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/lib/hooks/useOrder";
import { useState } from "react";

export default function BulkSummaryPage() {
  const router = useRouter();
  const { clearDraft } = useOrderDraft("bulk");
  const { bulkOrder, address, userId } = useOrderStore();
  const createOrder = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        pallets: bulkOrder,
        ...address,
        zoneId: 1,
        deliveryDate: `${address.date} ${address.time}`,
        userId: userId || "",
      };

      // Create the order
      await createOrder.mutateAsync({
        orderData,
        type: "BULK",
      });

      // Clear draft on successful order
      clearDraft();

      // Navigate to order list
      router.push("/order");
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVolume = bulkOrder.reduce(
    (sum, item) => sum + item.volume * item.quantity,
    0
  );
  const totalWeight = bulkOrder.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  return (
    <ImprovedOrderLayout
      orderType="bulk"
      currentStep={2}
      showSummary={false}
      showPricing={true}
    >
      <Stack gap="lg">
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={3}>
              <Group gap="xs">
                <IconReceipt size={24} />
                Resumen del Pedido
              </Group>
            </Title>
            <Badge size="xl" variant="light" color="green">
              Listo para confirmar
            </Badge>
          </Group>

          <Divider my="md" />

          {/* Items Summary */}
          <div>
            <Title order={5} mb="sm">Bultos ({bulkOrder.length})</Title>
            <Stack gap="xs">
              {bulkOrder.map((item, index) => (
                <Group key={item.tempId} justify="space-between" p="sm" style={{ backgroundColor: "#f8f9fa", borderRadius: 8 }}>
                  <div>
                    <Text fw={600}>Bulto #{index + 1}</Text>
                    <Text size="sm" c="dimmed">
                      {item.volume} m³ · {item.weight} kg · Cantidad: {item.quantity}
                    </Text>
                  </div>
                  <Badge>{(item.volume * item.quantity).toFixed(2)} m³ total</Badge>
                </Group>
              ))}
            </Stack>

            <Group justify="space-between" mt="md" p="md" style={{ backgroundColor: "#e7f5ff", borderRadius: 8 }}>
              <Text fw={700}>Total de Carga:</Text>
              <Group gap="xl">
                <Text fw={700}>{totalVolume.toFixed(2)} m³</Text>
                <Text fw={700}>{totalWeight.toFixed(2)} kg</Text>
              </Group>
            </Group>
          </div>

          <Divider my="md" />

          {/* Route Summary */}
          <div>
            <Title order={5} mb="sm">Ruta</Title>
            <Stack gap="sm">
              <div>
                <Text fw={600} size="sm" c="dimmed">Desde:</Text>
                <Text>{address.fromAddress?.address}</Text>
                <Text size="sm" c="dimmed">
                  {address.fromAddress?.district}, {address.fromAddress?.city}, {address.fromAddress?.state}
                </Text>
              </div>

              <div>
                <Text fw={600} size="sm" c="dimmed">Hasta:</Text>
                <Text>{address.toAddress?.address}</Text>
                <Text size="sm" c="dimmed">
                  {address.toAddress?.district}, {address.toAddress?.city}, {address.toAddress?.state}
                </Text>
              </div>

              <div>
                <Text fw={600} size="sm" c="dimmed">Fecha y hora de recojo:</Text>
                <Text>{address.date} a las {address.time}</Text>
              </div>
            </Stack>
          </div>

          <Divider my="md" />

          <Alert icon={<IconCheck size={16} />} color="green" mb="md">
            Tu pedido está listo para ser confirmado. Recibirás una confirmación por correo electrónico.
          </Alert>

          <Group justify="space-between">
            <Button
              variant="default"
              onClick={() => router.push("/order/bulk/address")}
              disabled={isSubmitting}
            >
              Volver a editar
            </Button>
            <Button
              size="lg"
              rightSection={<IconCheck size={20} />}
              onClick={handleConfirmOrder}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Confirmar Pedido
            </Button>
          </Group>
        </Paper>
      </Stack>
    </ImprovedOrderLayout>
  );
}
