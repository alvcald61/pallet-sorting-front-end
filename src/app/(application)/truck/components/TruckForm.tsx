"use client";

import { CreateTruckRequest, Truck, TruckStatus } from "@/lib/types/truckType";
import { getDrivers } from "@/lib/api/driver/driverApi";
import {
  Button,
  NumberInput,
  Select,
  TextInput,
  Modal,
  Stack,
  Group,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { Driver } from "@/lib/types/driverType";

interface TruckFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTruckRequest) => Promise<void>;
  truck?: Truck | null;
  isLoading?: boolean;
}

export const TruckForm: React.FC<TruckFormProps> = ({
  opened,
  onClose,
  onSubmit,
  truck,
  isLoading = false,
}) => {
  const [drivers, setDrivers] = useState<{ value: string; label: string }[]>(
    []
  );

  const form = useForm({
    initialValues: {
      licensePlate: "",
      width: 0,
      length: 0,
      height: 0,
      volume: 0,
      weight: 0,
      area: 0,
      multiplayer: 1,
      status: "AVAILABLE" as TruckStatus,
      enabled: true,
      driverId: "",
    },
    validate: {
      licensePlate: (value) =>
        value.trim().length === 0 ? "La placa es requerida" : null,
      width: (value) => (value <= 0 ? "El ancho debe ser mayor a 0" : null),
      length: (value) => (value <= 0 ? "El largo debe ser mayor a 0" : null),
      height: (value) => (value <= 0 ? "El alto debe ser mayor a 0" : null),
      volume: (value) => (value <= 0 ? "El volumen debe ser mayor a 0" : null),
      weight: (value) => (value <= 0 ? "El peso debe ser mayor a 0" : null),
      area: (value) => (value <= 0 ? "El área debe ser mayor a 0" : null),
      multiplayer: (value) =>
        value <= 0 ? "El multiplicador debe ser mayor a 0" : null,
    },
  });

  useEffect(() => {
    if (opened) {
      fetchDrivers();
    }
  }, [opened]);

  useEffect(() => {
    if (truck) {
      form.setValues({
        licensePlate: truck.licensePlate,
        width: truck.width,
        length: truck.length,
        height: truck.height,
        volume: truck.volume,
        weight: truck.weight,
        area: truck.area,
        multiplayer: truck.multiplayer,
        status: truck.status,
        enabled: truck.enabled,
        driverId: truck.driverId || "",
      });
    } else {
      form.reset();
    }
  }, [truck, opened]);

  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      const driverList = response.data.map((driver: Driver) => ({
        value: driver.driverId + "",
        label: `${driver.dni} - ${driver.firstName} ${driver.lastName}`,
      }));
      setDrivers(driverList);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleSubmit = async (values: CreateTruckRequest) => {
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
      title={truck ? "Actualizar Camión" : "Crear Nuevo Camión"}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Placa"
            placeholder="ABC-1234"
            {...form.getInputProps("licensePlate")}
            disabled={isLoading}
          />
          <NumberInput
            label="Ancho (m)"
            placeholder="2.5"
            min={0}
            step={0.1}
            {...form.getInputProps("width")}
            disabled={isLoading}
          />
          <NumberInput
            label="Largo (m)"
            placeholder="10"
            min={0}
            step={0.1}
            {...form.getInputProps("length")}
            disabled={isLoading}
          />
          <NumberInput
            label="Alto (m)"
            placeholder="3"
            min={0}
            step={0.1}
            {...form.getInputProps("height")}
            disabled={isLoading}
          />
          <NumberInput
            label="Área (m²)"
            placeholder="25"
            min={0}
            step={0.1}
            {...form.getInputProps("area")}
            disabled={isLoading}
          />
          <NumberInput
            label="Volumen (m³)"
            placeholder="75"
            min={0}
            step={0.1}
            {...form.getInputProps("volume")}
            disabled={isLoading}
          />
          <NumberInput
            label="Peso (kg)"
            placeholder="5000"
            min={0}
            step={100}
            {...form.getInputProps("weight")}
            disabled={isLoading}
          />
          <NumberInput
            label="Multiplicador"
            placeholder="1"
            min={0}
            step={0.1}
            {...form.getInputProps("multiplayer")}
            disabled={isLoading}
          />
          <Select
            label="Estado"
            placeholder="Seleccionar estado"
            data={[
              { value: "AVAILABLE", label: "Disponible" },
              { value: "ASSIGNED", label: "Asignado" },
              { value: "OUT_OF_SERVICE", label: "Fuera de Servicio" },
              { value: "IN_TRANSIT", label: "En Tránsito" },
              { value: "MAINTENANCE", label: "Mantenimiento" },
            ]}
            {...form.getInputProps("status")}
            disabled={isLoading}
          />
          <Select
            label="Chofer"
            placeholder="Seleccionar chofer (opcional)"
            data={drivers}
            searchable
            clearable
            {...form.getInputProps("driverId")}
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
              {truck ? "Actualizar" : "Crear"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
