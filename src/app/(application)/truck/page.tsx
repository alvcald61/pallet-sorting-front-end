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
import React, { useEffect, useState } from "react";
import { TruckForm } from "./components/TruckForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const PAGE_SIZE = 15;

export default function TruckPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch trucks and drivers on mount
  useEffect(() => {
    fetchTrucks();
    fetchDrivers();
  }, [page]);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const response = await getTrucks();
      setTrucks(response.data || []);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to load trucks",
      });
      console.error("Error fetching trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      setDrivers(response.data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "Sin asignar";
    const driver = drivers.find((d) => d.driverId === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : "No encontrado";
  };

  const handleCreateClick = () => {
    setSelectedTruck(null);
    setFormOpened(true);
  };

  const handleEditClick = (truck: Truck) => {
    setSelectedTruck(truck);
    setFormOpened(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsFormLoading(true);
      if (selectedTruck) {
        await updateTruck(selectedTruck.id, data);
        notifications.show({
          color: "green",
          title: "Success",
          message: "Truck updated successfully",
        });
      } else {
        await createTruck(data);
        notifications.show({
          color: "green",
          title: "Success",
          message: "Truck created successfully",
        });
      }
      await fetchTrucks();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: selectedTruck
          ? "Failed to update truck"
          : "Failed to create truck",
      });
      console.error("Error:", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async (truck: Truck) => {
    if (
      window.confirm(
        `Are you sure you want to delete truck ${truck.licensePlate}?`
      )
    ) {
      try {
        setLoading(true);
        await deleteTruck(truck.id);
        notifications.show({
          color: "green",
          title: "Success",
          message: "Truck deleted successfully",
        });
        await fetchTrucks();
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to delete truck",
        });
        console.error("Error deleting truck:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "green",
      ASSIGNED: "blue",
      OUT_OF_SERVICE: "orange",
      IN_TRANSIT: "cyan",
      MAINTENANCE: "yellow",
    };
    return colors[status] || "gray";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: "Disponible",
      ASSIGNED: "Asignado",
      OUT_OF_SERVICE: "Fuera de Servicio",
      IN_TRANSIT: "En Tránsito",
      MAINTENANCE: "Mantenimiento",
    };
    return labels[status] || status;
  };

  return (
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Trucks</span>
      </Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Camiones</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateClick}
        >
          Crear Camión
        </Button>
      </div>

      <div className="mt-8">
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={trucks}
          columns={[
            {
              accessor: "licensePlate",
              title: "Placa",
            },
            {
              accessor: "driverId",
              title: "Chofer",
              render: (truck) => <span>{getDriverName(truck.driverId)}</span>,
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
              accessor: "area",
              title: "Área (m²)",
              render: (truck) => <span>{truck.area.toFixed(2)}</span>,
            },
            {
              accessor: "volume",
              title: "Volumen (m³)",
              render: (truck) => <span>{truck.volume.toFixed(2)}</span>,
            },
            {
              accessor: "weight",
              title: "Peso (kg)",
              render: (truck) => <span>{truck.weight.toLocaleString()}</span>,
            },
            {
              accessor: "multiplayer",
              title: "Multiplicador",
              render: (truck) => <span>{truck.multiplayer}</span>,
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
              accessor: "actions",
              title: "Acciones",
              render: (truck) => (
                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => handleEditClick(truck)}
                    disabled={loading}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(truck)}
                    disabled={loading}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          idAccessor="id"
          page={page}
          onPageChange={setPage}
          totalRecords={trucks.length}
          recordsPerPage={PAGE_SIZE}
          fetching={loading}
          height={500}
        />
      </div>

      <TruckForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setSelectedTruck(null);
        }}
        onSubmit={handleFormSubmit}
        truck={selectedTruck}
        isLoading={isFormLoading}
      />
    </div>
  );
}
