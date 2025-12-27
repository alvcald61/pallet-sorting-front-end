"use client";

import {
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "@/lib/types/driverType";
import {
  Button,
  TextInput,
  Modal,
  Stack,
  Group,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";

interface DriverFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDriverRequest | UpdateDriverRequest) => Promise<void>;
  driver?: Driver | null;
  isLoading?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  opened,
  onClose,
  onSubmit,
  driver,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      dni: "",
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate: {
      dni: (value) => (value.trim().length === 0 ? "DNI es requerido" : null),
      phone: (value) =>
        value.trim().length === 0 ? "Teléfono es requerido" : null,
      firstName: (value) =>
        value.trim().length === 0 ? "Nombre es requerido" : null,
      lastName: (value) =>
        value.trim().length === 0 ? "Apellido es requerido" : null,
      email: (value) => (!value.includes("@") ? "Email inválido" : null),
      password: (value) =>
        !driver && value.trim().length < 6
          ? "Contraseña debe tener al menos 6 caracteres"
          : null,
    },
  });

  useEffect(() => {
    if (driver) {
      form.setValues({
        dni: driver.dni,
        phone: driver.phone,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        password: "",
      });
    } else {
      form.reset();
    }
  }, [driver, opened]);

  const handleSubmit = async (values: any) => {
    try {
      const submitData = driver
        ? {
            dni: values.dni,
            phone: values.phone,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
          }
        : values;

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
      title={driver ? "Actualizar Chofer" : "Crear Nuevo Chofer"}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="DNI"
            placeholder="12345678"
            {...form.getInputProps("dni")}
            disabled={isLoading || !!driver}
          />
          <TextInput
            label="Nombre"
            placeholder="Juan"
            {...form.getInputProps("firstName")}
            disabled={isLoading}
          />
          <TextInput
            label="Apellido"
            placeholder="Pérez"
            {...form.getInputProps("lastName")}
            disabled={isLoading}
          />
          <TextInput
            label="Email"
            placeholder="juan@example.com"
            type="email"
            {...form.getInputProps("email")}
            disabled={isLoading}
          />
          <TextInput
            label="Teléfono"
            placeholder="+51 999 999 999"
            {...form.getInputProps("phone")}
            disabled={isLoading}
          />
          {!driver && (
            <PasswordInput
              label="Contraseña"
              placeholder="Ingresa una contraseña segura"
              {...form.getInputProps("password")}
              disabled={isLoading}
            />
          )}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {driver ? "Actualizar" : "Crear"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
