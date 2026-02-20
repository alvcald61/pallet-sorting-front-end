"use client";

import {
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Zone } from "@/lib/api/pricing/priceApi";

interface ZoneFormData {
  name: string;
  zoneName: string;
  district: string;
  city: string;
  state: string;
  maxDeliveryTime: number;
}

interface ZoneFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: ZoneFormData) => Promise<void>;
  initialValues?: Zone;
  loading?: boolean;
}

export function ZoneFormModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}: ZoneFormModalProps) {
  const isEdit = !!initialValues;

  const form = useForm<ZoneFormData>({
    initialValues: initialValues
      ? {
          name: initialValues.name,
          zoneName: initialValues.zoneName,
          district: initialValues.district,
          city: initialValues.city,
          state: initialValues.state,
          maxDeliveryTime: initialValues.maxDeliveryTime,
        }
      : {
          name: "",
          zoneName: "",
          district: "",
          city: "Lima",
          state: "Lima",
          maxDeliveryTime: 120,
        },
    validate: {
      name: (v) => (!v.trim() ? "El nombre es requerido" : null),
      zoneName: (v) => (!v.trim() ? "La zona es requerida" : null),
      district: (v) => (!v.trim() ? "Al menos un distrito es requerido" : null),
      city: (v) => (!v.trim() ? "La ciudad es requerida" : null),
      state: (v) => (!v.trim() ? "El estado/región es requerido" : null),
      maxDeliveryTime: (v) =>
        v <= 0 ? "El tiempo de entrega debe ser mayor a 0" : null,
    },
  });

  const handleSubmit = async (values: ZoneFormData) => {
    await onSubmit(values);
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
      title={isEdit ? "Editar Zona" : "Nueva Zona"}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Nombre descriptivo"
            placeholder="Ej: Lima Centro"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Código de zona"
            placeholder="Ej: ZONA_1"
            required
            {...form.getInputProps("zoneName")}
          />
          <Textarea
            label="Distritos"
            placeholder="Ej: Miraflores, San Isidro, Barranco"
            description="Separar con comas. Usar * para aplicar a toda la ciudad."
            required
            minRows={2}
            {...form.getInputProps("district")}
          />
          <Group grow>
            <TextInput
              label="Ciudad"
              placeholder="Lima"
              required
              {...form.getInputProps("city")}
            />
            <TextInput
              label="Estado / Región"
              placeholder="Lima"
              required
              {...form.getInputProps("state")}
            />
          </Group>
          <NumberInput
            label="Tiempo máx. de entrega (minutos)"
            placeholder="120"
            min={1}
            required
            {...form.getInputProps("maxDeliveryTime")}
          />
          <Text size="xs" c="dimmed">
            {form.values.maxDeliveryTime > 0
              ? `≈ ${(form.values.maxDeliveryTime / 60).toFixed(1)} horas`
              : ""}
          </Text>
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Guardar cambios" : "Crear zona"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
