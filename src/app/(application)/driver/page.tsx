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
import React from "react";
import { DriverForm } from "./components/DriverForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { useDataTable } from "@/lib/hooks/useDataTable";

const PAGE_SIZE = 15;

export default function DriverPage() {
  // Use CRUD hook with React Query
  const drivers = useCRUDWithQuery({
    queryKey: ["drivers"],
    fetchFn: getDrivers,
    createFn: createDriver,
    updateFn: (id, data) => updateDriver(String(id), data),
    deleteFn: (id) => deleteDriver(String(id)),
    entityName: "Chofer",
    getItemId: (driver) => driver.driverId,
    getItemDisplayName: (driver) => `${driver.firstName} ${driver.lastName}`,
  });

  // Use form modal hook for modal state
  const formModal = useFormModal<Driver>();

  // Use data table hook for pagination
  const table = useDataTable(drivers.items, { pageSize: PAGE_SIZE });

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await drivers.update(formModal.selected.driverId, data);
    } else {
      await drivers.create(data);
    }
    formModal.close();
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
          onClick={formModal.openCreate}
          disabled={drivers.isCreating}
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
        records={table.paginatedData}
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
                  onClick={() => formModal.openEdit(driver as Driver)}
                  disabled={drivers.loading || drivers.isUpdating}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => drivers.remove(driver as Driver)}
                  disabled={drivers.loading || drivers.isDeleting}
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
        fetching={drivers.loading}
        height={500}
      />

      <DriverForm
        opened={formModal.opened}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        driver={formModal.selected}
        isLoading={drivers.isCreating || drivers.isUpdating}
      />
    </div>
  );
}
