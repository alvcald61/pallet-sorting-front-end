"use client";

import { CreatePalletRequest, Pallet } from "@/lib/types/palletType";
import {
  Button,
  NumberInput,
  Modal,
  Stack,
  Group,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";

interface PalletFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePalletRequest) => Promise<void>;
  pallet?: Pallet | null;
  isLoading?: boolean;
}

export const PalletForm: React.FC<PalletFormProps> = ({
  opened,
  onClose,
  onSubmit,
  pallet,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      width: 0,
      length: 0,
      height: 0,
      enabled: true,
    },
    validate: {
      width: (value) => (value <= 0 ? "El ancho debe ser mayor a 0" : null),
      length: (value) => (value <= 0 ? "El largo debe ser mayor a 0" : null),
      height: (value) => (value <= 0 ? "El alto debe ser mayor a 0" : null),
    },
  });

  useEffect(() => {
    if (pallet) {
      form.setValues({
        width: pallet.width,
        length: pallet.length,
        height: pallet.height,
        enabled: pallet.enabled,
      });
    } else {
      form.reset();
    }
  }, [pallet, opened]);

  const handleSubmit = async (values: CreatePalletRequest) => {
    try {
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={pallet ? "Actualizar Pallet" : "Crear Nuevo Pallet"}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <NumberInput
            label="Ancho (m)"
            placeholder="1.2"
            min={0}
            step={0.01}
            {...form.getInputProps("width")}
            disabled={isLoading}
          />
          <NumberInput
            label="Largo (m)"
            placeholder="1"
            min={0}
            step={0.01}
            {...form.getInputProps("length")}
            disabled={isLoading}
          />
          <NumberInput
            label="Alto (m)"
            placeholder="1.6"
            min={0}
            step={0.01}
            {...form.getInputProps("height")}
            disabled={isLoading}
          />
          <Checkbox
            label="Habilitado"
            {...form.getInputProps("enabled", { type: "checkbox" })}
            disabled={isLoading}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {pallet ? "Actualizar" : "Crear"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
