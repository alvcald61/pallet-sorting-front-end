"use client";

import { CreateClientRequest, Client, Role } from "@/lib/types/clientType";
import {
  Button,
  TextInput,
  Modal,
  Stack,
  Group,
  PasswordInput,
  MultiSelect,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { getRoles } from "@/lib/api/client/clientApi";

interface ClientFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientRequest | any) => Promise<void>;
  client?: Client | null;
  isLoading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  opened,
  onClose,
  onSubmit,
  client,
  isLoading = false,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const form = useForm({
    initialValues: {
      ruc: "",
      businessName: "",
      phone: "",
      address: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      trust: false,
      roles: [] as string[],
    },
    validate: {
      ruc: (value) => (value.trim().length === 0 ? "RUC es requerido" : null),
      businessName: (value) =>
        value.trim().length === 0 ? "Nombre de negocio es requerido" : null,
      phone: (value) =>
        value.trim().length === 0 ? "Teléfono es requerido" : null,
      address: (value) =>
        value.trim().length === 0 ? "Dirección es requerida" : null,
      firstName: (value) =>
        value.trim().length === 0 ? "Nombre es requerido" : null,
      lastName: (value) =>
        value.trim().length === 0 ? "Apellido es requerido" : null,
      email: (value) => (!value.includes("@") ? "Email inválido" : null),
      password: (value) =>
        !client && value.trim().length < 6
          ? "Contraseña debe tener al menos 6 caracteres"
          : null,
      roles: (value) =>
        value.length === 0 ? "Selecciona al menos un rol" : null,
    },
  });

  useEffect(() => {
    if (opened) {
      fetchRoles();
    }
  }, [opened]);

  useEffect(() => {
    if (client) {
      form.setValues({
        ruc: client.ruc,
        businessName: client.businessName,
        phone: client.phone,
        address: client.address,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        trust: client.trust,
        password: "",
        roles: client.roles.map((r) => `${r.id}`),
      });
    } else {
      form.reset();
    }
  }, [client, opened]);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await getRoles();
      console.log("Fetched roles:", response.data);
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = client
        ? {
            ruc: values.ruc,
            businessName: values.businessName,
            phone: values.phone,
            address: values.address,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            trust: values.trust,
            roles: values.roles,
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
      title={client ? "Actualizar Cliente" : "Crear Nuevo Cliente"}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="RUC"
            placeholder="12345678901"
            {...form.getInputProps("ruc")}
            disabled={isLoading || !!client}
          />
          <TextInput
            label="Nombre de Negocio"
            placeholder="Mi Empresa S.A."
            {...form.getInputProps("businessName")}
            disabled={isLoading}
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
          <TextInput
            label="Dirección"
            placeholder="Av. Principal 123"
            {...form.getInputProps("address")}
            disabled={isLoading}
          />
          {!client && (
            <PasswordInput
              label="Contraseña"
              placeholder="Ingresa una contraseña segura"
              {...form.getInputProps("password")}
              disabled={isLoading}
            />
          )}
          <MultiSelect
            label="Roles"
            placeholder="Selecciona roles"
            data={roles.map((role) => ({
              value: `${role.id}`,
              label: role.name,
            }))}
            {...form.getInputProps("roles")}
            disabled={isLoading || rolesLoading}
            searchable
            clearable
          />
          <Checkbox
            label="Cliente de confianza"
            {...form.getInputProps("trust")}
            disabled={isLoading || rolesLoading}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading || rolesLoading}>
              {client ? "Actualizar" : "Crear"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
