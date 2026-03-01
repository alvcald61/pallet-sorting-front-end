"use client";

import { useState } from "react";
import { Button, ActionIcon, Group, Badge, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconTrash, IconRuler } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { ConditionFormModal } from "./ConditionFormModal";
import {
  PriceCondition,
  getPriceConditions,
  createPriceCondition,
  updatePriceCondition,
  deletePriceCondition,
} from "@/lib/api/pricing/priceApi";

type ConditionInput = Omit<PriceCondition, "priceConditionId" | "enabled" | "createdAt" | "updatedAt">;

export function ConditionsTab() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCondition, setEditingCondition] = useState<PriceCondition | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ["priceConditions"],
    queryFn: getPriceConditions,
  });

  const conditions: PriceCondition[] = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: createPriceCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["priceConditions"] });
      notifications.show({ message: "Condición creada correctamente", color: "green" });
      close();
    },
    onError: () => {
      notifications.show({ message: "Error al crear la condición", color: "red" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ConditionInput }) =>
      updatePriceCondition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["priceConditions"] });
      notifications.show({ message: "Condición actualizada correctamente", color: "green" });
      close();
      setEditingCondition(undefined);
    },
    onError: () => {
      notifications.show({ message: "Error al actualizar la condición", color: "red" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePriceCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["priceConditions"] });
      notifications.show({ message: "Condición eliminada correctamente", color: "green" });
    },
    onError: () => {
      notifications.show({ message: "Error al eliminar la condición", color: "red" });
    },
  });

  const handleEdit = (condition: PriceCondition) => {
    setEditingCondition(condition);
    open();
  };

  const handleClose = () => {
    setEditingCondition(undefined);
    close();
  };

  const handleDelete = (condition: PriceCondition) => {
    const hasVolume = condition.minVolume > 0 || condition.maxVolume > 0;
    const label = hasVolume
      ? `Peso: ${condition.minWeight}–${condition.maxWeight} kg | Vol: ${condition.minVolume}–${condition.maxVolume} m³`
      : `Peso: ${condition.minWeight}–${condition.maxWeight} kg (solo peso)`;
    modals.openConfirmModal({
      title: "Eliminar condición de precio",
      children: (
        <Text size="sm">
          ¿Eliminar la condición <strong>{label}</strong>?
          Las tarifas que la usen dejarán de aplicarse.
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(condition.priceConditionId),
    });
  };

  const handleSubmit = async (formData: ConditionInput) => {
    if (editingCondition) {
      await updateMutation.mutateAsync({ id: editingCondition.priceConditionId, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <ConditionFormModal
        opened={opened}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={editingCondition}
        loading={isSubmitting}
      />

      <EnhancedDataTable
        records={conditions}
        loading={isLoading}
        searchable={false}
        exportable
        exportFileName="condiciones-precio"
        selectable={false}
        toolbarActions={
          <Button leftSection={<IconRuler size={16} />} onClick={open} size="sm">
            Nueva Condición
          </Button>
        }
        columns={[
          {
            accessor: "priceConditionId",
            title: "ID",
            sortable: true,
          },
          {
            accessor: "currency",
            title: "Moneda",
            render: (c) => (
              <Badge variant="outline" size="sm">
                {c.currency}
              </Badge>
            ),
          },
          {
            accessor: "minWeight",
            title: "Peso mín.",
            sortable: true,
            render: (c) => `${c.minWeight} kg`,
          },
          {
            accessor: "maxWeight",
            title: "Peso máx.",
            sortable: true,
            render: (c) => `${c.maxWeight} kg`,
          },
          {
            accessor: "minVolume",
            title: "Vol. mín.",
            render: (c) =>
              c.minVolume > 0 || c.maxVolume > 0 ? `${c.minVolume} m³` : "—",
          },
          {
            accessor: "maxVolume",
            title: "Vol. máx.",
            render: (c) =>
              c.minVolume > 0 || c.maxVolume > 0 ? `${c.maxVolume} m³` : "—",
          },
          {
            accessor: "type",
            title: "Tipo",
            render: (c) => {
              const hasVolume = c.minVolume > 0 || c.maxVolume > 0;
              return (
                <Badge color={hasVolume ? "blue" : "green"} size="sm">
                  {hasVolume ? "Peso + Volumen" : "Solo Peso"}
                </Badge>
              );
            },
          },
          {
            accessor: "actions",
            title: "Acciones",
            sortable: false,
            render: (condition) => (
              <Group gap="xs">
                <Tooltip label="Editar">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(condition)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Eliminar">
                  <ActionIcon
                    variant="light"
                    color="red"
                    loading={deleteMutation.isPending}
                    onClick={() => handleDelete(condition)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        emptyState={{
          title: "No hay condiciones de precio",
          description: "Las condiciones definen rangos de peso y volumen para las tarifas.",
          icon: <IconRuler size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
          action: { label: "Crear primera condición", onClick: open },
        }}
      />
    </>
  );
}
