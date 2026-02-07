"use client";

import { Truck } from "@/lib/types/truckType";
import { Driver } from "@/lib/types/driverType";
import {
  createTruck,
  deleteTruck,
  getTrucks,
  updateTruck,
} from "@/lib/api/truck/truckApi";
import { getDrivers } from "@/lib/api/driver/driverApi";
import {
  Button,
  Group,
  Badge,
  ActionIcon,
  Title,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React from "react";
import { TruckForm } from "./components/TruckForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { useDataTable } from "@/lib/hooks/useDataTable";
import { useQuery } from "@tanstack/react-query";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";

const PAGE_SIZE = 15;

export default function TruckPage() {
  // Fetch drivers with React Query
  const { data: driversData } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });
  const drivers = driversData?.data || [];

  // Use CRUD hook with React Query for trucks
  const trucks = useCRUDWithQuery({
    queryKey: ["trucks"],
    fetchFn: getTrucks,
    createFn: createTruck,
    updateFn: (id, data) => updateTruck(String(id), data),
    deleteFn: (id) => deleteTruck(String(id)),
    entityName: "Camión",
    getItemId: (truck) => truck.id,
    getItemDisplayName: (truck) => truck.licensePlate,
  });

  // Use form modal hook for modal state
  const formModal = useFormModal<Truck>();

  // Use data table hook for pagination
  const table = useDataTable(trucks.items, { pageSize: PAGE_SIZE });

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "Sin asignar";
    const driver = drivers.find((d) => d.driverId === Number(driverId));
    return driver ? `${driver.firstName} ${driver.lastName}` : "Desconocido";
  };

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await trucks.update(formModal.selected.id, data);
    } else {
      await trucks.create(data);
    }
    formModal.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "green";
      case "ASSIGNED":
        return "blue";
      case "OUT_OF_SERVICE":
        return "red";
      case "IN_TRANSIT":
        return "yellow";
      case "MAINTENANCE":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponible";
      case "ASSIGNED":
        return "Asignado";
      case "OUT_OF_SERVICE":
        return "Fuera de Servicio";
      case "IN_TRANSIT":
        return "En Tránsito";
      case "MAINTENANCE":
        return "Mantenimiento";
      default:
        return status;
    }
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Camiones</span>
      </Breadcrumbs>

      <div className="flex justify-between mb-4">
        <Title order={2}>Tus Camiones</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={formModal.openCreate}
          disabled={trucks.isCreating}
        >
          Crear Camión
        </Button>
      </div>

      <DataTable
        withTableBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={table.paginatedData}
        columns={[
          {
            accessor: "licensePlate",
            title: "Placa",
          },
          {
            accessor: "width",
            title: "Ancho (m)",
            render: (truck) => <span>{truck.width.toFixed(2)}</span>,
          },
          {
            accessor: "length",
            title: "Largo (m)",
            render: (truck) => <span>{truck.length.toFixed(2)}</span>,
          },
          {
            accessor: "height",
            title: "Alto (m)",
            render: (truck) => <span>{truck.height.toFixed(2)}</span>,
          },
          {
            accessor: "volume",
            title: "Volumen (m³)",
            render: (truck) => <span>{truck.volume.toFixed(2)}</span>,
          },
          {
            accessor: "weight",
            title: "Peso (kg)",
            render: (truck) => <span>{truck.weight.toFixed(0)}</span>,
          },
          {
            accessor: "area",
            title: "Área (m²)",
            render: (truck) => <span>{truck.area.toFixed(2)}</span>,
          },
          {
            accessor: "multiplayer",
            title: "Multiplicador",
            render: (truck) => <span>{truck.multiplayer.toFixed(1)}</span>,
          },
          {
            accessor: "status",
            title: "Estado",
            render: (truck) => (
              <Badge color={getStatusColor(truck.status)}>
                {getStatusLabel(truck.status)}
              </Badge>
            ),
          },
          {
            accessor: "enabled",
            title: "Habilitado",
            render: (truck) => (
              <Badge color={truck.enabled ? "green" : "gray"}>
                {truck.enabled ? "Sí" : "No"}
              </Badge>
            ),
          },
          {
            accessor: "driverId",
            title: "Chofer",
            render: (truck) => <span>{getDriverName(truck.driverId)}</span>,
          },
          {
            accessor: "actions",
            title: "Acciones",
            render: (truck) => (
              <Group gap="xs">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="blue"
                  onClick={() => formModal.openEdit(truck)}
                  disabled={trucks.loading || trucks.isUpdating}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => trucks.remove(truck)}
                  disabled={trucks.loading || trucks.isDeleting}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        idAccessor="id"
        page={table.page}
        onPageChange={table.setPage}
        totalRecords={table.totalRecords}
        recordsPerPage={table.pageSize}
        fetching={trucks.loading}
        height={500}
      />

      <TruckForm
        opened={formModal.opened}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        truck={formModal.selected}
        isLoading={trucks.isCreating || trucks.isUpdating}
      />
    </div>
    </ProtectedPage>
  );
}
