"use client";

import {
  Paper,
  Title,
  TextInput,
  Select,
  Group,
  Stack,
  Button,
  Grid,
  Alert,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import {
  IconMapPin,
  IconAlertCircle,
  IconCheck,
  IconCurrentLocation,
  IconArrowLeft,
  IconArrowRight,
  IconLink,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import useOrderStore from "@/lib/store/OrderStore";
import { getWarehouses } from "@/lib/api/warehouse/warehouseApi";
import { getAvailableSlots } from "@/lib/api/order/orderApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";

interface AddressFormValues {
  warehouseId: string;
  fromAddress: string;
  fromDistrict: string;
  fromCity: string;
  fromState: string;
  toAddress: string;
  toDistrict: string;
  toCity: string;
  toState: string;
  toLocationLink: string;
  pickupDate: Date | string | null;
  pickupTime: string;
}

export function ImprovedAddressForm() {
  const { addAddress, address } = useOrderStore();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // Determine order type from pathname (bulk or pallet)
  const orderType = pathname.includes("/bulk") ? "bulk" : "pallet";

  // Fetch warehouses
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
  });
  const warehouses = warehousesData?.data || [];

  const form = useForm<AddressFormValues>({
    initialValues: {
      warehouseId: "",
      fromAddress: address?.fromAddress?.address || "",
      fromDistrict: address?.fromAddress?.district || "",
      fromCity: address?.fromAddress?.city || "",
      fromState: address?.fromAddress?.state || "",
      toAddress: address?.toAddress?.address || "",
      toDistrict: address?.toAddress?.district || "",
      toCity: address?.toAddress?.city || "",
      toState: address?.toAddress?.state || "",
      toLocationLink: address?.toAddress?.locationLink || "",
      pickupDate: address?.date ? new Date(address.date) : null,
      pickupTime: address?.time || "",
    },
    validate: {
      warehouseId: (value) => (!value ? "Debes seleccionar un almacén de origen" : null),
      fromAddress: (value) => (!value ? "Dirección de origen requerida" : null),
      fromDistrict: (value) => (!value ? "Distrito requerido" : null),
      fromCity: (value) => (!value ? "Ciudad requerida" : null),
      fromState: (value) => (!value ? "Región requerida" : null),
      toAddress: (value) => (!value ? "Dirección de destino requerida" : null),
      toDistrict: (value) => (!value ? "Distrito requerido" : null),
      toCity: (value) => (!value ? "Ciudad requerida" : null),
      toState: (value) => (!value ? "Región requerida" : null),
      pickupDate: (value) => (!value ? "Fecha de recojo requerida" : null),
      pickupTime: (value) => (!value ? "Hora de recojo requerida" : null),
    },
  });

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (form.values.pickupDate) {
        try {
          // Convert to Date if it's a string, then format
          const date = typeof form.values.pickupDate === 'string'
            ? new Date(form.values.pickupDate)
            : form.values.pickupDate;
          const dateStr = date.toISOString().split("T")[0];
          const slots = await getAvailableSlots(dateStr);
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Error fetching slots:", error);
          setAvailableSlots([]);
        }
      }
    };

    fetchSlots();
  }, [form.values.pickupDate]);

  // Handle warehouse selection
  const handleWarehouseSelect = (value: string | null) => {
    if (!value) return;

    const warehouse = warehouses.find(
      (wh) => String(wh.warehouseId) === value
    );

    if (warehouse) {
      form.setValues({
        warehouseId: value,
        fromAddress: warehouse.address || "",
        fromDistrict: warehouse.district || "",
        fromCity: warehouse.city || "",
        fromState: warehouse.state || "",
      });
    }
  };

  // Save to store on change
  useEffect(() => {
    // Format date correctly
    let dateStr = null;
    if (form.values.pickupDate) {
      try {
        const date = typeof form.values.pickupDate === 'string'
          ? new Date(form.values.pickupDate)
          : form.values.pickupDate;
        dateStr = date.toISOString().split("T")[0];
      } catch (error) {
        console.error("Error formatting date:", error);
      }
    }

    addAddress({
      fromAddress: {
        address: form.values.fromAddress,
        district: form.values.fromDistrict,
        city: form.values.fromCity,
        state: form.values.fromState,
        warehouseId: form.values.warehouseId ? Number(form.values.warehouseId) : null,
      },
      toAddress: {
        address: form.values.toAddress,
        district: form.values.toDistrict,
        city: form.values.toCity,
        state: form.values.toState,
        locationLink: form.values.toLocationLink || undefined,
      },
      date: dateStr,
      time: form.values.pickupTime,
    });
  }, [form.values]);

  const warehouseOptions = warehouses.map((wh) => ({
    value: String(wh.warehouseId),
    label: wh.name,
  }));

  return (
    <Stack gap="lg">
      {/* Warehouse Selection */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          <Group gap="xs">
            <IconCurrentLocation size={20} />
            Almacén de Origen
          </Group>
        </Title>

        <Select
          label="Seleccionar almacén"
          placeholder="Elige un almacén de origen"
          data={warehouseOptions}
          searchable
          required
          value={form.values.warehouseId}
          onChange={handleWarehouseSelect}
          error={form.errors.warehouseId}
          description="Los datos del almacén se cargarán automáticamente"
        />
      </Paper>

      {/* From Address */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          <Group gap="xs">
            <IconMapPin size={20} />
            Dirección de Recojo
          </Group>
        </Title>

        <Grid gutter="md">
          <Grid.Col span={12}>
            <TextInput
              label="Dirección completa"
              placeholder="Av. Principal 123, Edificio A, Piso 5"
              required
              {...form.getInputProps("fromAddress")}
              disabled
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              label="Distrito"
              placeholder="San Isidro"
              required
              {...form.getInputProps("fromDistrict")}
              disabled
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              label="Ciudad"
              placeholder="Lima"
              required
              {...form.getInputProps("fromCity")}
              disabled
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              label="Región"
              placeholder="Lima"
              required
              {...form.getInputProps("fromState")}
              disabled
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* To Address */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          <Group gap="xs">
            <IconMapPin size={20} />
            Dirección de Entrega
          </Group>
        </Title>

        <Grid gutter="md">
          <Grid.Col span={12}>
            <TextInput
              label="Dirección completa"
              placeholder="Calle Secundaria 456, Casa 10"
              required
              {...form.getInputProps("toAddress")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              label="Distrito"
              placeholder="Callao"
              required
              {...form.getInputProps("toDistrict")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              label="Ciudad"
              placeholder="Callao"
              required
              {...form.getInputProps("toCity")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TextInput
              label="Región"
              placeholder="Callao"
              required
              {...form.getInputProps("toState")}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              label="Link de mapa"
              placeholder="https://maps.google.com/..."
              leftSection={<IconLink size={16} />}
              description="Enlace de Google Maps u otro servicio de mapas hacia la dirección de entrega"
              {...form.getInputProps("toLocationLink")}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Pickup Date & Time */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          Fecha y Hora de Recojo
        </Title>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              label="Fecha de recojo"
              placeholder="Selecciona una fecha"
              required
              minDate={new Date()}
              {...form.getInputProps("pickupDate")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Hora de recojo"
              placeholder="Selecciona una hora"
              required
              data={availableSlots}
              disabled={!form.values.pickupDate || availableSlots.length === 0}
              {...form.getInputProps("pickupTime")}
              description={
                form.values.pickupDate && availableSlots.length === 0
                  ? "Cargando horarios disponibles..."
                  : `${availableSlots.length} horarios disponibles`
              }
            />
          </Grid.Col>
        </Grid>

        {form.values.pickupDate && availableSlots.length === 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="orange" mt="md">
            No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.
          </Alert>
        )}
      </Paper>

      {/* Validation Summary */}
      {form.isValid() && (
        <Alert icon={<IconCheck size={16} />} color="green">
          Todos los campos están completos. Puedes continuar al siguiente paso.
        </Alert>
      )}

      {/* Navigation Buttons */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Group justify="space-between">
          <Button
            variant="default"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.push(`/order/${orderType}`)}
          >
            Anterior
          </Button>
          <Button
            rightSection={<IconArrowRight size={16} />}
            disabled={!form.isValid()}
            onClick={() => router.push(`/order/${orderType}/summary`)}
          >
            Siguiente: Resumen
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
