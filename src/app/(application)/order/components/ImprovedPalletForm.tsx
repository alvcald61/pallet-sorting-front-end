"use client";

import { Paper, Title, Text, Stack, Group, Button, NumberInput, ActionIcon, Badge, Tooltip, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconCopy, IconArrowRight } from "@tabler/icons-react";
import useOrderStore from "@/lib/store/OrderStore";
import { Pallet } from "@/lib/types/palletType";
import { useState } from "react";
import { usePallets } from "@/lib/hooks/usePallets";
import { Grid } from "@mantine/core";
import { useRouter } from "next/navigation";

interface PalletFormValues {
  palletId: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
}

export function ImprovedPalletForm() {
  const { addPallet, palletOrder, deleteItem } = useOrderStore();
  const { pallets } = usePallets();
  const [selectedPallet, setSelectedPallet] = useState("");
  const router = useRouter();

  const form = useForm<PalletFormValues>({
    initialValues: {
      palletId: "",
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      quantity: 1,
    },
    validate: {
      width: (value) => (value > 0 ? null : "El ancho debe ser mayor a 0"),
      height: (value) => (value > 0 ? null : "La altura debe ser mayor a 0"),
      length: (value) => (value > 0 ? null : "El largo debe ser mayor a 0"),
      weight: (value) => (value > 0 ? null : "El peso debe ser mayor a 0"),
      quantity: (value) =>
        value > 0 && Number.isInteger(value)
          ? null
          : "La cantidad debe ser un número entero positivo",
    },
  });

  // Generate select options
  const selectOptions = [
    { value: "", label: "Selecciona un pallet" },
    ...pallets.map((pallet) => ({
      value: pallet.id,
      label: `${pallet.length}m x ${pallet.width}m x ${pallet.height}m`,
    })),
    { value: "custom", label: "Personalizado" },
  ];

  const handlePalletSelect = (value: string | null) => {
    if (!value) return;

    setSelectedPallet(value);

    if (value === "custom" || value === "") {
      form.setValues({
        palletId: value,
        width: 0,
        height: 0,
        length: 0,
        weight: form.values.weight,
        quantity: form.values.quantity,
      });
      return;
    }

    const pallet = pallets.find((p) => p.id === value);
    if (pallet) {
      form.setValues({
        palletId: value,
        width: pallet.width,
        height: pallet.height,
        length: pallet.length,
        weight: form.values.weight,
        quantity: form.values.quantity,
      });
    }
  };

  const handleSubmit = (values: PalletFormValues) => {
    const newPallet: Pallet = {
      id: values.palletId === "custom" ? "" : values.palletId,
      width: values.width,
      height: values.height,
      length: values.length,
      weight: values.weight,
      quantity: values.quantity,
      enabled: true,
      tempId: crypto.randomUUID(),
    };

    addPallet(newPallet);
    form.reset();
    setSelectedPallet("");

    // Focus on select for quick adding
    setTimeout(() => {
      const selectInput = document.querySelector(
        'input[placeholder="Escoja un pallet"]'
      ) as HTMLInputElement;
      selectInput?.focus();
    }, 0);
  };

  const handleDuplicate = (item: Pallet) => {
    const duplicated: Pallet = {
      ...item,
      tempId: crypto.randomUUID(),
    };
    addPallet(duplicated);
  };

  const handleQuickAdd = () => {
    if (form.isValid()) {
      form.onSubmit(handleSubmit)();
    }
  };

  // Calculate estimated space
  const totalVolume = palletOrder.reduce(
    (sum, item) => sum + item.length * item.width * item.height * item.quantity,
    0
  );
  const totalWeight = palletOrder.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  return (
    <Stack gap="lg">
      {/* Form */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          Agregar Pallet
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Pallet Selection */}
            <Select
              label="Escoja un pallet (largo x ancho x alto)"
              placeholder="Escoja un pallet"
              data={selectOptions}
              searchable
              value={selectedPallet}
              onChange={handlePalletSelect}
              description="Selecciona un pallet predefinido o crea uno personalizado"
            />

            {/* Dimensions */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Largo"
                  placeholder="1.2"
                  min={0.01}
                  step={0.1}
                  decimalScale={2}
                  rightSection={<Text size="xs" c="dimmed">m</Text>}
                  {...form.getInputProps("length")}
                  disabled={selectedPallet !== "custom" && selectedPallet !== ""}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Ancho"
                  placeholder="0.8"
                  min={0.01}
                  step={0.1}
                  decimalScale={2}
                  rightSection={<Text size="xs" c="dimmed">m</Text>}
                  {...form.getInputProps("width")}
                  disabled={selectedPallet !== "custom" && selectedPallet !== ""}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Altura"
                  placeholder="1.5"
                  min={0.01}
                  step={0.1}
                  decimalScale={2}
                  rightSection={<Text size="xs" c="dimmed">m</Text>}
                  {...form.getInputProps("height")}
                  disabled={selectedPallet !== "custom" && selectedPallet !== ""}
                />
              </Grid.Col>
            </Grid>

            {/* Weight and Quantity */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Peso"
                  placeholder="25"
                  min={0.01}
                  step={0.1}
                  decimalScale={2}
                  rightSection={<Text size="xs" c="dimmed">kg</Text>}
                  {...form.getInputProps("weight")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Cantidad"
                  placeholder="1"
                  min={1}
                  step={1}
                  {...form.getInputProps("quantity")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && form.isValid()) {
                      e.preventDefault();
                      handleQuickAdd();
                    }
                  }}
                />
              </Grid.Col>
            </Grid>
          </Stack>

          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Presiona Enter para agregar rápidamente
            </Text>
            <Group>
              <Button variant="default" onClick={() => {
                form.reset();
                setSelectedPallet("");
              }}>
                Limpiar
              </Button>
              <Button
                type="submit"
                leftSection={<IconPlus size={16} />}
                disabled={!form.isValid()}
              >
                Agregar Pallet
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>

      {/* Items List */}
      {palletOrder.length > 0 && (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={4}>Pallets Agregados ({palletOrder.length})</Title>
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
            {palletOrder.map((item, index) => (
              <Paper key={item.tempId} p="md" withBorder radius="sm" bg="gray.0">
                <Group justify="space-between">
                  <Group>
                    <Badge size="lg" variant="dot">
                      #{index + 1}
                    </Badge>
                    <Stack gap={4}>
                      <Group gap="md">
                        <Text size="sm">
                          <strong>Dimensiones:</strong> {item.length}m x {item.width}m x {item.height}m
                        </Text>
                        <Text size="sm">
                          <strong>Peso:</strong> {item.weight} kg
                        </Text>
                        <Text size="sm">
                          <strong>Cantidad:</strong> {item.quantity}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        Subtotal: {(item.length * item.width * item.height * item.quantity).toFixed(2)} m³ · {(item.weight * item.quantity).toFixed(2)} kg
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
      {palletOrder.length === 0 && (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconPlus size={48} stroke={1.5} color="gray" />
            <Text size="lg" fw={500} c="dimmed">
              No hay pallets agregados
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Completa el formulario arriba para agregar tu primer pallet
            </Text>
          </Stack>
        </Paper>
      )}

      {/* Navigation Buttons */}
      {palletOrder.length > 0 && (
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="flex-end">
            <Button
              size="lg"
              rightSection={<IconArrowRight size={16} />}
              onClick={() => router.push("/order/pallet/address")}
            >
              Siguiente: Direcciones
            </Button>
          </Group>
        </Paper>
      )}
    </Stack>
  );
}
