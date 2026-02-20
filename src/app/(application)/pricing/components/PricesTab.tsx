"use client";

import { useState } from "react";
import { Button, ActionIcon, Group, Badge, Tooltip, Text } from "@mantine/core";
import { IconEdit, IconTrash, IconCurrencyDollar } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { PriceFormModal } from "./PriceFormModal";
import {
  Price,
  Zone,
  PriceCondition,
  getPrices,
  getZones,
  getPriceConditions,
  createPrice,
  updatePrice,
  deletePrice,
} from "@/lib/api/pricing/priceApi";

export function PricesTab() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingPrice, setEditingPrice] = useState<Price | undefined>();

  const { data: pricesData, isLoading: loadingPrices } = useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
  });

  const { data: zonesData } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  const { data: conditionsData } = useQuery({
    queryKey: ["priceConditions"],
    queryFn: getPriceConditions,
  });

  const prices: Price[] = pricesData?.data ?? [];
  const zones: Zone[] = zonesData?.data ?? [];
  const conditions: PriceCondition[] = conditionsData?.data ?? [];

  const createMutation = useMutation({
    mutationFn: createPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      notifications.show({ message: "Tarifa creada correctamente", color: "green" });
      close();
    },
    onError: () => {
      notifications.show({ message: "Error al crear la tarifa", color: "red" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        zone: { id: number };
        priceCondition: { priceConditionId: number };
        price: number;
      };
    }) => updatePrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      notifications.show({ message: "Tarifa actualizada correctamente", color: "green" });
      close();
      setEditingPrice(undefined);
    },
    onError: () => {
      notifications.show({ message: "Error al actualizar la tarifa", color: "red" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      notifications.show({ message: "Tarifa eliminada correctamente", color: "green" });
    },
    onError: () => {
      notifications.show({ message: "Error al eliminar la tarifa", color: "red" });
    },
  });

  const handleEdit = (price: Price) => {
    setEditingPrice(price);
    open();
  };

  const handleClose = () => {
    setEditingPrice(undefined);
    close();
  };

  const handleSubmit = async (data: {
    zone: { id: number };
    priceCondition: { priceConditionId: number };
    price: number;
  }) => {
    if (editingPrice) {
      await updateMutation.mutateAsync({ id: editingPrice.priceId, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = (price: Price) => {
    const currency = price.priceCondition?.currency ?? "PEN";
    const prefix = currency === "USD" ? "$ " : "S/ ";
    modals.openConfirmModal({
      title: "Eliminar tarifa",
      children: (
        <Text size="sm">
          ¿Eliminar la tarifa de <strong>{prefix}{Number(price.price).toFixed(2)}</strong>{" "}
          para la zona <strong>{price.zone?.name}</strong>?
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(price.priceId),
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <PriceFormModal
        opened={opened}
        onClose={handleClose}
        onSubmit={handleSubmit}
        zones={zones}
        conditions={conditions}
        initialValues={editingPrice}
        loading={isSubmitting}
      />

      <EnhancedDataTable
        records={prices}
        loading={loadingPrices}
        searchable={false}
        exportable
        exportFileName="tarifas"
        selectable={false}
        toolbarActions={
          <Button
            leftSection={<IconCurrencyDollar size={16} />}
            onClick={open}
            size="sm"
          >
            Nueva Tarifa
          </Button>
        }
        columns={[
          {
            accessor: "zone.name",
            title: "Zona",
            sortable: true,
            render: (p) => (
              <div>
                <Text size="sm" fw={500}>
                  {p.zone?.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {p.zone?.zoneName}
                </Text>
              </div>
            ),
          },
          {
            accessor: "zone.district",
            title: "Distritos",
            render: (p) => (
              <Tooltip label={p.zone?.district ?? ""} multiline w={280}>
                <Text size="sm" lineClamp={1} style={{ maxWidth: 180 }}>
                  {p.zone?.district}
                </Text>
              </Tooltip>
            ),
          },
          {
            accessor: "condition",
            title: "Condición",
            render: (p) => {
              const c = p.priceCondition;
              if (!c) return "—";
              const hasVolume = c.minVolume > 0 || c.maxVolume > 0;
              return (
                <div>
                  <Text size="sm">
                    Peso: {c.minWeight}–{c.maxWeight} kg
                  </Text>
                  {hasVolume && (
                    <Text size="xs" c="dimmed">
                      Vol: {c.minVolume}–{c.maxVolume} m³
                    </Text>
                  )}
                </div>
              );
            },
          },
          {
            accessor: "type",
            title: "Tipo",
            render: (p) => {
              const c = p.priceCondition;
              if (!c) return null;
              const hasVolume = c.minVolume > 0 || c.maxVolume > 0;
              return (
                <Badge color={hasVolume ? "blue" : "green"} size="sm">
                  {hasVolume ? "Peso + Vol." : "Solo Peso"}
                </Badge>
              );
            },
          },
          {
            accessor: "price",
            title: "Tarifa",
            sortable: true,
            render: (p) => {
              const currency = p.priceCondition?.currency ?? "PEN";
              const prefix = currency === "USD" ? "$ " : "S/ ";
              return (
                <Text fw={600} size="sm">
                  {prefix}
                  {Number(p.price).toFixed(2)}
                </Text>
              );
            },
          },
          {
            accessor: "currency",
            title: "Moneda",
            render: (p) => (
              <Badge variant="outline" size="sm">
                {p.priceCondition?.currency ?? "—"}
              </Badge>
            ),
          },
          {
            accessor: "actions",
            title: "Acciones",
            sortable: false,
            render: (price) => (
              <Group gap="xs">
                <Tooltip label="Editar">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(price)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Eliminar">
                  <ActionIcon
                    variant="light"
                    color="red"
                    loading={deleteMutation.isPending}
                    onClick={() => handleDelete(price)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        emptyState={{
          title: "No hay tarifas registradas",
          description:
            "Primero crea zonas y condiciones de precio, luego define las tarifas.",
          icon: (
            <IconCurrencyDollar
              size={64}
              stroke={1.5}
              style={{ opacity: 0.3 }}
            />
          ),
          action: { label: "Crear primera tarifa", onClick: open },
        }}
      />
    </>
  );
}
