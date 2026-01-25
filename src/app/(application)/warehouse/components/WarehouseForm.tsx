"use client";

import { CreateWarehouseRequest, Warehouse } from "@/lib/types/warehouseType";
import { Button, TextInput, Modal, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";

interface WarehouseFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Warehouse) => Promise<void>;
  warehouse?: Warehouse | null;
  isLoading?: boolean;
}

export const WarehouseForm: React.FC<WarehouseFormProps> = ({
  opened,
  onClose,
  onSubmit,
  warehouse,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      district: "",
      city: "",
      state: "",
      locationLink: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "El nombre es requerido" : null,
      phone: (value) =>
        value.trim().length === 0 ? "El teléfono es requerido" : null,
      address: (value) =>
        value.trim().length === 0 ? "La dirección es requerida" : null,
      district: (value) =>
        value.trim().length === 0 ? "El distrito es requerido" : null,
      city: (value) =>
        value.trim().length === 0 ? "La ciudad es requerida" : null,
      state: (value) =>
        value.trim().length === 0 ? "El estado/región es requerido" : null,
    },
  });

  useEffect(() => {
    if (warehouse) {
      form.setValues({
        name: warehouse.name,
        phone: warehouse.phone,
        address: warehouse.address,
        district: warehouse.district,
        city: warehouse.city,
        state: warehouse.state,
        locationLink: warehouse.locationLink || "",
      });
    } else {
      form.reset();
    }
  }, [warehouse, opened]);

  const handleSubmit = async (values: any) => {
    try {
      const submitData: Warehouse = {
        warehouseId: warehouse ? warehouse.warehouseId : 0,
        name: values.name,
        phone: values.phone,
        address: values.address,
        district: values.district,
        city: values.city,
        state: values.state,
        locationLink: values.locationLink,
      };
      await onSubmit(submitData);
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
      title={warehouse ? "Actualizar Almacén" : "Crear Nuevo Almacén"}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nombre"
            placeholder="Almacén Principal"
            {...form.getInputProps("name")}
            disabled={isLoading}
          />
          <TextInput
            label="Teléfono"
            placeholder="+51 999 999 999"
            {...form.getInputProps("phone")}
            disabled={isLoading}
          />
          <TextInput
            label="Dirección"
            placeholder="Av. Principal 123"
            {...form.getInputProps("address")}
            disabled={isLoading}
          />
          <TextInput
            label="Distrito"
            placeholder="Lima"
            {...form.getInputProps("district")}
            disabled={isLoading}
          />
          <TextInput
            label="Ciudad"
            placeholder="Lima"
            {...form.getInputProps("city")}
            disabled={isLoading}
          />
          <TextInput
            label="Región/Estado"
            placeholder="Lima"
            {...form.getInputProps("state")}
            disabled={isLoading}
          />
          <TextInput
            label="Enlace de Ubicación"
            placeholder="https://maps.google.com/..."
            {...form.getInputProps("locationLink")}
            disabled={isLoading}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {warehouse ? "Actualizar" : "Crear"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
