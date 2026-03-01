"use client";

import {
  Modal,
  NumberInput,
  Select,
  Switch,
  Button,
  Group,
  Stack,
  Badge,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { PriceCondition } from "@/lib/api/pricing/priceApi";

interface ConditionFormData {
  currency: string;
  minWeight: number;
  maxWeight: number;
  minVolume: number;
  maxVolume: number;
}

interface ConditionFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: ConditionFormData) => Promise<void>;
  initialValues?: PriceCondition;
  loading?: boolean;
}

export function ConditionFormModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}: ConditionFormModalProps) {
  const isEdit = !!initialValues;
  const [hasVolumeRestriction, setHasVolumeRestriction] = useState(
    initialValues ? initialValues.minVolume > 0 || initialValues.maxVolume > 0 : false
  );

  const form = useForm<ConditionFormData>({
    initialValues: initialValues
      ? {
          currency: initialValues.currency,
          minWeight: initialValues.minWeight,
          maxWeight: initialValues.maxWeight,
          minVolume: initialValues.minVolume,
          maxVolume: initialValues.maxVolume,
        }
      : {
          currency: "PEN",
          minWeight: 0,
          maxWeight: 100,
          minVolume: 0,
          maxVolume: 0,
        },
    validate: {
      minWeight: (v, values) =>
        v < 0 ? "El peso mínimo no puede ser negativo" :
        v >= values.maxWeight ? "El peso mínimo debe ser menor al máximo" : null,
      maxWeight: (v, values) =>
        v <= 0 ? "El peso máximo debe ser mayor a 0" :
        v <= values.minWeight ? "El peso máximo debe ser mayor al mínimo" : null,
      minVolume: (v, values) =>
        hasVolumeRestriction && v < 0 ? "El volumen mínimo no puede ser negativo" :
        hasVolumeRestriction && v >= values.maxVolume ? "El volumen mínimo debe ser menor al máximo" : null,
      maxVolume: (v, values) =>
        hasVolumeRestriction && v <= 0 ? "El volumen máximo debe ser mayor a 0" :
        hasVolumeRestriction && v <= values.minVolume ? "El volumen máximo debe ser mayor al mínimo" : null,
    },
  });

  useEffect(() => {
    if (!hasVolumeRestriction) {
      form.setFieldValue("minVolume", 0);
      form.setFieldValue("maxVolume", 0);
    }
  }, [hasVolumeRestriction]);

  const handleSubmit = async (values: ConditionFormData) => {
    const data = {
      ...values,
      minVolume: hasVolumeRestriction ? values.minVolume : 0,
      maxVolume: hasVolumeRestriction ? values.maxVolume : 0,
    };
    await onSubmit(data);
    form.reset();
    setHasVolumeRestriction(false);
  };

  const handleClose = () => {
    form.reset();
    setHasVolumeRestriction(
      initialValues ? initialValues.minVolume > 0 || initialValues.maxVolume > 0 : false
    );
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? "Editar Condición de Precio" : "Nueva Condición de Precio"}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            label="Moneda"
            data={[
              { value: "PEN", label: "PEN - Soles" },
              { value: "USD", label: "USD - Dólares" },
            ]}
            required
            {...form.getInputProps("currency")}
          />

          <Text fw={500} size="sm" mt="xs">
            Restricción de peso (kg)
          </Text>
          <Group grow>
            <NumberInput
              label="Peso mínimo"
              placeholder="0"
              min={0}
              decimalScale={2}
              suffix=" kg"
              required
              {...form.getInputProps("minWeight")}
            />
            <NumberInput
              label="Peso máximo"
              placeholder="100"
              min={0}
              decimalScale={2}
              suffix=" kg"
              required
              {...form.getInputProps("maxWeight")}
            />
          </Group>

          <Switch
            label="Aplicar restricción de volumen"
            description="Si está activo, el precio también dependerá del volumen del envío"
            checked={hasVolumeRestriction}
            onChange={(e) => setHasVolumeRestriction(e.currentTarget.checked)}
            mt="xs"
          />

          {hasVolumeRestriction && (
            <>
              <Text fw={500} size="sm">
                Restricción de volumen (m³)
              </Text>
              <Group grow>
                <NumberInput
                  label="Volumen mínimo"
                  placeholder="0"
                  min={0}
                  decimalScale={3}
                  suffix=" m³"
                  {...form.getInputProps("minVolume")}
                />
                <NumberInput
                  label="Volumen máximo"
                  placeholder="1"
                  min={0}
                  decimalScale={3}
                  suffix=" m³"
                  {...form.getInputProps("maxVolume")}
                />
              </Group>
            </>
          )}

          <Group gap="xs">
            <Text size="xs" c="dimmed">Vista previa:</Text>
            <Badge color={hasVolumeRestriction ? "blue" : "green"} size="sm">
              {hasVolumeRestriction ? "Peso + Volumen" : "Solo Peso"}
            </Badge>
          </Group>
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Guardar cambios" : "Crear condición"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
