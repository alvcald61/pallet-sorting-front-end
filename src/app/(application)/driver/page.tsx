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
import React from "react";
import { DriverForm } from "./components/DriverForm";
import { IconEdit, IconTrash, IconPlus, IconUserPlus } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { modals } from "@mantine/modals";

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

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await drivers.update(formModal.selected.driverId, data);
    } else {
      await drivers.create(data);
    }
    formModal.close();
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedIds: Set<string | number>) => {
    const selectedDrivers = drivers.items.filter(driver =>
      selectedIds.has(driver.driverId)
    );

    modals.openConfirmModal({
      title: 'Eliminar choferes',
      children: (
        <>
          ¿Estás seguro de que deseas eliminar {selectedDrivers.length} chofer(es)?
          <br />
          Esta acción no se puede deshacer.
        </>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        for (const driver of selectedDrivers) {
          await drivers.remove(driver);
        }
      },
    });
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
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

        <EnhancedDataTable
          records={drivers.items}
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
          loading={drivers.loading}
          pageSize={PAGE_SIZE}
          searchable
          searchableFields={["dni", "firstName", "lastName", "email", "phone"]}
          searchPlaceholder="Buscar por DNI, nombre, email o teléfono..."
          selectable
          getRecordId={(driver) => driver.driverId}
          bulkActions={[
            {
              label: "Eliminar seleccionados",
              icon: <IconTrash size={16} />,
              color: "red",
              onClick: handleBulkDelete,
            },
          ]}
          exportable
          exportFileName="choferes"
          emptyState={{
            title: "No hay choferes registrados",
            description: "Comienza creando tu primer chofer para gestionar tus transportes.",
            icon: <IconUserPlus size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
            action: {
              label: "Crear primer chofer",
              onClick: formModal.openCreate,
            },
          }}
        />

        <DriverForm
          opened={formModal.opened}
          onClose={formModal.close}
          onSubmit={handleFormSubmit}
          driver={formModal.selected}
          isLoading={drivers.isCreating || drivers.isUpdating}
        />
      </div>
    </ProtectedPage>
  );
}
