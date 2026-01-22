"use client";

import { Driver } from "@/lib/types/driverType";
import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "@/lib/api/driver/driverApi";
import {
  Button,
  Group,
  ActionIcon,
  Title,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { DriverForm } from "./components/DriverForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const PAGE_SIZE = 15;

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch drivers on mount
  useEffect(() => {
    fetchDrivers();
  }, [page]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await getDrivers();
      setDrivers(response.data || []);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to load drivers",
      });
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedDriver(null);
    setFormOpened(true);
  };

  const handleEditClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormOpened(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsFormLoading(true);
      if (selectedDriver) {
        await updateDriver(selectedDriver.driverId + "", data);
        notifications.show({
          color: "green",
          title: "Success",
          message: "Driver updated successfully",
        });
      } else {
        await createDriver(data);
        notifications.show({
          color: "green",
          title: "Success",
          message: "Driver created successfully",
        });
      }
      await fetchDrivers();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: selectedDriver
          ? "Failed to update driver"
          : "Failed to create driver",
      });
      console.error("Error:", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async (driver: Driver) => {
    if (confirm(`Are you sure you want to delete ${driver.firstName}?`)) {
      try {
        await deleteDriver(driver.driverId + "");
        notifications.show({
          color: "green",
          title: "Success",
          message: "Driver deleted successfully",
        });
        await fetchDrivers();
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to delete driver",
        });
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/truck">Home</Anchor>
        <span>Choferes</span>
      </Breadcrumbs>

      <div className="flex justify-between mb-4">
        <Title order={2}>Tus Choferes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateClick}
        >
          Crear Chofer
        </Button>
      </div>

      <DataTable
        withTableBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={drivers}
        columns={[
          {
            accessor: "dni",
            title: "DNI",
          },
          {
            accessor: "firstName",
            title: "Nombre",
          },
          {
            accessor: "lastName",
            title: "Apellido",
          },
          {
            accessor: "email",
            title: "Email",
          },
          {
            accessor: "phone",
            title: "Teléfono",
          },
          {
            accessor: "actions",
            title: "Acciones",
            render: (driver) => (
              <Group gap="xs">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="blue"
                  onClick={() => handleEditClick(driver as Driver)}
                  disabled={loading}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => handleDelete(driver as Driver)}
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
        totalRecords={drivers.length}
        recordsPerPage={PAGE_SIZE}
        fetching={loading}
        height={500}
      />

      <DriverForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setSelectedDriver(null);
        }}
        onSubmit={handleFormSubmit}
        driver={selectedDriver}
        isLoading={isFormLoading}
      />
    </div>
  );
}
