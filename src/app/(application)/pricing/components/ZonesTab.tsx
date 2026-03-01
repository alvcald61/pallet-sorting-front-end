"use client";

import { useState } from "react";
import { Button, ActionIcon, Group, Badge, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconTrash, IconMapPin } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { ZoneFormModal } from "./ZoneFormModal";
import {
  Zone,
  getZones,
  createZone,
  updateZone,
  deleteZone,
} from "@/lib/api/pricing/priceApi";

export function ZonesTab() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingZone, setEditingZone] = useState<Zone | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  const zones: Zone[] = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      notifications.show({ message: "Zona creada correctamente", color: "green" });
      close();
    },
    onError: () => {
      notifications.show({ message: "Error al crear la zona", color: "red" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Zone, "id" | "enabled" | "createdAt" | "updatedAt"> }) =>
      updateZone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      notifications.show({ message: "Zona actualizada correctamente", color: "green" });
      close();
      setEditingZone(undefined);
    },
    onError: () => {
      notifications.show({ message: "Error al actualizar la zona", color: "red" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      notifications.show({ message: "Zona eliminada correctamente", color: "green" });
    },
    onError: () => {
      notifications.show({ message: "Error al eliminar la zona", color: "red" });
    },
  });

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    open();
  };

  const handleClose = () => {
    setEditingZone(undefined);
    close();
  };

  const handleDelete = (zone: Zone) => {
    modals.openConfirmModal({
      title: "Eliminar zona",
      children: (
        <Text size="sm">
          ¿Estás seguro de eliminar la zona <strong>{zone.name}</strong>?
          Las tarifas que la referencian dejarán de aplicarse.
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(zone.id),
    });
  };

  const handleSubmit = async (formData: Omit<Zone, "id" | "enabled" | "createdAt" | "updatedAt">) => {
    if (editingZone) {
      await updateMutation.mutateAsync({ id: editingZone.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <ZoneFormModal
        opened={opened}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editingZone}
        loading={isSubmitting}
      />

      <EnhancedDataTable
        records={zones}
        loading={isLoading}
        searchable
        searchableFields={["name", "zoneName", "district", "city", "state"]}
        searchPlaceholder="Buscar zona..."
        exportable
        exportFileName="zonas"
        selectable={false}
        toolbarActions={
          <Button leftSection={<IconMapPin size={16} />} onClick={open} size="sm">
            Nueva Zona
          </Button>
        }
        columns={[
          { accessor: "name", title: "Nombre", sortable: true },
          { accessor: "zoneName", title: "Código de zona", sortable: true },
          {
            accessor: "district",
            title: "Distritos",
            render: (zone) => (
              <Tooltip label={zone.district} multiline w={300}>
                <Text size="sm" lineClamp={1} style={{ maxWidth: 200 }}>
                  {zone.district}
                </Text>
              </Tooltip>
            ),
          },
          { accessor: "city", title: "Ciudad", sortable: true },
          { accessor: "state", title: "Región", sortable: true },
          {
            accessor: "maxDeliveryTime",
            title: "Tiempo entrega",
            sortable: true,
            render: (zone) => (
              <Badge variant="light" color="blue">
                {(zone.maxDeliveryTime / 60).toFixed(1)} hrs
              </Badge>
            ),
          },
          {
            accessor: "actions",
            title: "Acciones",
            sortable: false,
            render: (zone) => (
              <Group gap="xs">
                <Tooltip label="Editar">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(zone)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Eliminar">
                  <ActionIcon
                    variant="light"
                    color="red"
                    loading={deleteMutation.isPending}
                    onClick={() => handleDelete(zone)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        emptyState={{
          title: "No hay zonas registradas",
          description: "Crea zonas para definir las áreas de entrega y sus distritos.",
          icon: <IconMapPin size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
          action: { label: "Crear primera zona", onClick: open },
        }}
      />
    </>
  );
}
