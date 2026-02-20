"use client";

import {
  Modal,
  Select,
  NumberInput,
  Button,
  Group,
  Stack,
  Text,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Zone, PriceCondition, Price } from "@/lib/api/pricing/priceApi";

interface PriceFormData {
  zoneId: string | null;
  priceConditionId: string | null;
  price: number;
}

interface PriceFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: {
    zone: { id: number };
    priceCondition: { priceConditionId: number };
    price: number;
  }) => Promise<void>;
  zones: Zone[];
  conditions: PriceCondition[];
  initialValues?: Price;
  loading?: boolean;
}

function formatConditionLabel(c: PriceCondition): string {
  const hasVolume = c.minVolume > 0 || c.maxVolume > 0;
  const weightPart = `Peso: ${c.minWeight}–${c.maxWeight} kg`;
  const volumePart = hasVolume ? ` | Vol: ${c.minVolume}–${c.maxVolume} m³` : " | Solo peso";
  return `[${c.currency}] ${weightPart}${volumePart}`;
}

export function PriceFormModal({
  opened,
  onClose,
  onSubmit,
  zones,
  conditions,
  initialValues,
  loading = false,
}: PriceFormModalProps) {
  const isEdit = !!initialValues;

  const form = useForm<PriceFormData>({
    initialValues: initialValues
      ? {
          zoneId: String(initialValues.zone.id),
          priceConditionId: String(initialValues.priceCondition.priceConditionId),
          price: initialValues.price,
        }
      : {
          zoneId: null,
          priceConditionId: null,
          price: 0,
        },
    validate: {
      zoneId: (v) => (!v ? "Selecciona una zona" : null),
      priceConditionId: (v) => (!v ? "Selecciona una condición de precio" : null),
      price: (v) => (v <= 0 ? "El precio debe ser mayor a 0" : null),
    },
  });

  const selectedCondition = conditions.find(
    (c) => String(c.priceConditionId) === form.values.priceConditionId
  );

  const selectedZone = zones.find(
    (z) => String(z.id) === form.values.zoneId
  );

  const handleSubmit = async (values: PriceFormData) => {
    await onSubmit({
      zone: { id: Number(values.zoneId) },
      priceCondition: { priceConditionId: Number(values.priceConditionId) },
      price: values.price,
    });
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Editar Tarifa" : "Nueva Tarifa"}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            label="Zona de entrega"
            placeholder="Seleccionar zona"
            data={zones.map((z) => ({
              value: String(z.id),
              label: `${z.name} (${z.zoneName}) — ${z.city}`,
            }))}
            searchable
            required
            {...form.getInputProps("zoneId")}
          />

          {selectedZone && (
            <Text size="xs" c="dimmed">
              Distritos: {selectedZone.district}
            </Text>
          )}

          <Select
            label="Condición de precio"
            placeholder="Seleccionar rango de peso/volumen"
            data={conditions.map((c) => ({
              value: String(c.priceConditionId),
              label: formatConditionLabel(c),
            }))}
            searchable
            required
            {...form.getInputProps("priceConditionId")}
          />

          {selectedCondition && (
            <Group gap="xs">
              <Badge
                color={
                  selectedCondition.minVolume > 0 || selectedCondition.maxVolume > 0
                    ? "blue"
                    : "green"
                }
                size="sm"
              >
                {selectedCondition.minVolume > 0 || selectedCondition.maxVolume > 0
                  ? "Peso + Volumen"
                  : "Solo Peso"}
              </Badge>
              <Text size="xs" c="dimmed">
                {selectedCondition.currency}
              </Text>
            </Group>
          )}

          <NumberInput
            label="Precio"
            placeholder="0.00"
            min={0}
            decimalScale={2}
            prefix={selectedCondition?.currency === "USD" ? "$ " : "S/ "}
            required
            {...form.getInputProps("price")}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Guardar cambios" : "Crear tarifa"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
