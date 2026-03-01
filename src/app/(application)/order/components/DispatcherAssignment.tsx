"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { Dispatcher } from "@/lib/types/orderTypes";
import {
  getDispatchersByClient,
  createDispatcher,
  assignDispatcherToOrder,
} from "@/lib/api/dispatcher/dispatcherApi";

interface DispatcherAssignmentProps {
  orderId: string;
  clientId: number;
  currentDispatcher?: Dispatcher;
}

export default function DispatcherAssignment({
  orderId,
  clientId,
  currentDispatcher,
}: DispatcherAssignmentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedDispatcherId, setSelectedDispatcherId] = useState<
    string | null
  >(currentDispatcher ? String(currentDispatcher.id) : null);

  const { data: dispatchersData, isLoading } = useQuery({
    queryKey: ["dispatchers", clientId],
    queryFn: () => getDispatchersByClient(clientId),
  });

  const dispatchers = dispatchersData?.data ?? [];

  const assignMutation = useMutation({
    mutationFn: (dispatcherId: number) =>
      assignDispatcherToOrder(orderId, dispatcherId),
    onSuccess: () => {
      notifications.show({
        message: "Despachador asignado correctamente",
        color: "green",
      });
      router.refresh();
    },
    onError: () => {
      notifications.show({
        message: "Error al asignar despachador",
        color: "red",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: createDispatcher,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["dispatchers", clientId] });
      closeModal();
      form.reset();
      // Auto-assign the new dispatcher
      const newDispatcher = response.data;
      setSelectedDispatcherId(String(newDispatcher.id));
      assignMutation.mutate(newDispatcher.id);
    },
    onError: () => {
      notifications.show({
        message: "Error al crear despachador",
        color: "red",
      });
    },
  });

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    validate: {
      firstName: (v) => (!v.trim() ? "Nombre es requerido" : null),
      lastName: (v) => (!v.trim() ? "Apellido es requerido" : null),
      phone: (v) => (!v.trim() ? "Teléfono es requerido" : null),
    },
  });

  const handleSelect = (value: string | null) => {
    setSelectedDispatcherId(value);
    if (value) {
      assignMutation.mutate(Number(value));
    }
  };

  const handleCreateSubmit = (values: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    createMutation.mutate({ ...values, clientId });
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Despachador
        </h3>

        {currentDispatcher && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded mb-3 sm:mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <Text size="xs" c="dimmed">
                  Nombre Completo
                </Text>
                <Text size="sm" fw={500}>
                  {currentDispatcher.firstName} {currentDispatcher.lastName}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Teléfono
                </Text>
                <Text size="sm" fw={500}>
                  {currentDispatcher.phone}
                </Text>
              </div>
            </div>
          </div>
        )}

        <Select
          label="Seleccionar despachador"
          placeholder="Buscar despachador..."
          data={dispatchers.map((d) => ({
            value: String(d.id),
            label: `${d.firstName} ${d.lastName} — Tel: ${d.phone}`,
          }))}
          value={selectedDispatcherId}
          onChange={handleSelect}
          searchable
          clearable
          disabled={isLoading || assignMutation.isPending}
          mb="sm"
        />

        <Button
          variant="light"
          size="xs"
          onClick={openModal}
          disabled={assignMutation.isPending}
          fullWidth
          className="sm:!w-auto"
        >
          Crear nuevo despachador
        </Button>
      </div>

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Nuevo Despachador"
        fullScreen={isMobile}
        size="sm"
      >
        <form onSubmit={form.onSubmit(handleCreateSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nombre"
              placeholder="Nombre"
              required
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label="Apellido"
              placeholder="Apellido"
              required
              {...form.getInputProps("lastName")}
            />
            <TextInput
              label="Teléfono"
              placeholder="Teléfono"
              required
              {...form.getInputProps("phone")}
            />
          </Stack>
          <Group justify="flex-end" mt="md" grow={isMobile}>
            <Button
              variant="light"
              onClick={closeModal}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Crear y asignar
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
