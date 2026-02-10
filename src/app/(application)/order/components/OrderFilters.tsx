"use client";

import {
  TextInput,
  MultiSelect,
  Select,
  Button,
  Group,
  Paper,
  Stack,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconSearch, IconX } from "@tabler/icons-react";
import { OrderFilters as OrderFiltersType } from "@/lib/types/orderFilterTypes";
import { OrderStatus } from "@/lib/utils/enums";

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFiltersChange: (filters: OrderFiltersType) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = Object.entries(OrderStatus).map(([key, value]) => ({
  value: key,
  label: value,
}));

const ORDER_TYPE_OPTIONS = [
  { value: "POR BULTO", label: "Por bultos" },
  { value: "POR PALLET", label: "Por pallet" },
];

export function OrderFiltersComponent({
  filters,
  onFiltersChange,
  onReset,
  hasActiveFilters,
}: OrderFiltersProps) {
  const updateFilter = (key: keyof OrderFiltersType, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Paper p="md" withBorder radius="sm">
      <Stack gap="sm">
        <Group grow align="flex-end">
          <TextInput
            placeholder="Buscar por ID o dirección..."
            leftSection={<IconSearch size={16} />}
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.currentTarget.value)}
          />
          <MultiSelect
            placeholder="Estado"
            data={STATUS_OPTIONS}
            value={filters.statuses || []}
            onChange={(value) => updateFilter("statuses", value)}
            clearable
          />
          <Select
            placeholder="Tipo de pedido"
            data={ORDER_TYPE_OPTIONS}
            value={filters.orderType || null}
            onChange={(value) => updateFilter("orderType", value || undefined)}
            clearable
          />
        </Group>

        <Group grow align="flex-end">
          <DateInput
            placeholder="Fecha recojo desde"
            value={
              filters.pickupDateFrom
                ? new Date(filters.pickupDateFrom)
                : null
            }
            onChange={(date) => {
              if (date === null) {
                updateFilter("pickupDateFrom", undefined);
              } else {
                // date is string
                updateFilter("pickupDateFrom", new Date(date).toISOString().split("T")[0]);
              }
            }}
            clearable
            valueFormat="DD/MM/YYYY"
          />
          <DateInput
            placeholder="Fecha recojo hasta"
            value={
              filters.pickupDateTo ? new Date(filters.pickupDateTo) : null
            }
            onChange={(date) => {
              if (date === null) {
                updateFilter("pickupDateTo", undefined);
              } else {
                // date is string
                updateFilter("pickupDateTo", new Date(date).toISOString().split("T")[0]);
              }
            }}
            clearable
            valueFormat="DD/MM/YYYY"
          />
          {hasActiveFilters && (
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconX size={16} />}
              onClick={onReset}
            >
              Limpiar filtros
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
