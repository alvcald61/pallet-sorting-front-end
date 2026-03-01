"use client";

import { Paper, Title, Text, Stack, Group, Button, NumberInput, ActionIcon, Badge, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconCopy, IconArrowRight } from "@tabler/icons-react";
import useOrderStore from "@/lib/store/OrderStore";
import { Bulk } from "@/lib/types/bulkType";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BulkFormValues {
  volume: number;
  weight: number;
  quantity: number;
  height: number;
}

export function ImprovedBulkForm() {
  const { addBulk, bulkOrder, deleteItem } = useOrderStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<BulkFormValues>({
    initialValues: {
      volume: 0,
      weight: 0,
      quantity: 1,
      height: 1.5,
    },
    validate: {
      volume: (value) => (value > 0 ? null : "El volumen debe ser mayor a 0"),
      weight: (value) => (value > 0 ? null : "El peso debe ser mayor a 0"),
      quantity: (value) =>
        value > 0 && Number.isInteger(value)
          ? null
          : "La cantidad debe ser un número entero positivo",
      height: (value) => (value > 0 ? null : "La altura debe ser mayor a 0"),
    },
  });

  const handleSubmit = (values: BulkFormValues) => {
    const newBulk: Bulk = {
      ...values,
      tempId: crypto.randomUUID(),
    };

    addBulk(newBulk);
    form.reset();

    // Focus on first input for quick adding
    setTimeout(() => {
      const firstInput = document.querySelector(
        'input[name="volume"]'
      ) as HTMLInputElement;
      firstInput?.focus();
    }, 0);
  };

  const handleDuplicate = (item: Bulk) => {
    const duplicated: Bulk = {
      ...item,
      tempId: crypto.randomUUID(),
    };
    addBulk(duplicated);
  };

  const handleQuickAdd = () => {
    if (form.isValid()) {
      form.onSubmit(handleSubmit)();
    }
  };

  // Calculate estimated space
  const totalVolume = bulkOrder.reduce(
    (sum, item) => sum + item.volume * item.quantity,
    0
  );
  const totalWeight = bulkOrder.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  return (
    <Stack gap="lg">
      {/* Form */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          Agregar Bulto
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Volumen"
                placeholder="20"
                min={0.01}
                step={0.1}
                decimalScale={2}
                rightSection={<Text size="xs" c="dimmed">m³</Text>}
                {...form.getInputProps("volume")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const nextInput = document.querySelector(
                      'input[name="weight"]'
                    ) as HTMLInputElement;
                    nextInput?.focus();
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Peso"
                placeholder="5"
                min={0.01}
                step={0.1}
                decimalScale={2}
                rightSection={<Text size="xs" c="dimmed">kg</Text>}
                {...form.getInputProps("weight")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const nextInput = document.querySelector(
                      'input[name="quantity"]'
                    ) as HTMLInputElement;
                    nextInput?.focus();
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Cantidad"
                placeholder="1"
                min={1}
                step={1}
                {...form.getInputProps("quantity")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const nextInput = document.querySelector(
                      'input[name="height"]'
                    ) as HTMLInputElement;
                    nextInput?.focus();
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Altura"
                placeholder="1.5"
                min={0.01}
                step={0.1}
                decimalScale={2}
                rightSection={<Text size="xs" c="dimmed">m</Text>}
                {...form.getInputProps("height")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && form.isValid()) {
                    e.preventDefault();
                    handleQuickAdd();
                  }
                }}
              />
            </Grid.Col>
          </Grid>

          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Presiona Enter para agregar rápidamente
            </Text>
            <Group>
              <Button variant="default" onClick={() => form.reset()}>
                Limpiar
              </Button>
              <Button
                type="submit"
                leftSection={<IconPlus size={16} />}
                disabled={!form.isValid()}
              >
                Agregar Bulto
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>

      {/* Items List */}
      {bulkOrder.length > 0 && (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={4}>Bultos Agregados ({bulkOrder.length})</Title>
            <Group gap="lg">
              <Badge size="lg" variant="light" color="blue">
                {totalVolume.toFixed(2)} m³ total
              </Badge>
              <Badge size="lg" variant="light" color="green">
                {totalWeight.toFixed(2)} kg total
              </Badge>
            </Group>
          </Group>

          <Stack gap="sm">
            {bulkOrder.map((item, index) => (
              <Paper key={item.tempId} p="md" withBorder radius="sm" bg="gray.0">
                <Group justify="space-between">
                  <Group>
                    <Badge size="lg" variant="dot">
                      #{index + 1}
                    </Badge>
                    <Stack gap={4}>
                      <Group gap="md">
                        <Text size="sm">
                          <strong>Volumen:</strong> {item.volume} m³
                        </Text>
                        <Text size="sm">
                          <strong>Peso:</strong> {item.weight} kg
                        </Text>
                        <Text size="sm">
                          <strong>Cantidad:</strong> {item.quantity}
                        </Text>
                        <Text size="sm">
                          <strong>Altura:</strong> {item.height} m
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        Subtotal: {(item.volume * item.quantity).toFixed(2)} m³ · {(item.weight * item.quantity).toFixed(2)} kg
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="xs">
                    <Tooltip label="Duplicar">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleDuplicate(item)}
                      >
                        <IconCopy size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => deleteItem(item.tempId)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Empty state */}
      {bulkOrder.length === 0 && (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconPlus size={48} stroke={1.5} color="gray" />
            <Text size="lg" fw={500} c="dimmed">
              No hay bultos agregados
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Completa el formulario arriba para agregar tu primer bulto
            </Text>
          </Stack>
        </Paper>
      )}

      {/* Navigation Buttons */}
      {bulkOrder.length > 0 && (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="flex-end">
            <Button
              size="lg"
              rightSection={<IconArrowRight size={16} />}
              onClick={() => router.push("/order/bulk/address")}
            >
              Siguiente: Direcciones
            </Button>
          </Group>
        </Paper>
      )}
    </Stack>
  );
}

// Add Grid import
import { Grid } from "@mantine/core";
