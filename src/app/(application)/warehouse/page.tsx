"use client";

import { Warehouse } from "@/lib/types/warehouseType";
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from "@/lib/api/warehouse/warehouseApi";
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
import { WarehouseForm } from "./components/WarehouseForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { useDataTable } from "@/lib/hooks/useDataTable";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";

const PAGE_SIZE = 15;

export default function WarehousePage() {
  // Use CRUD hook with React Query
  const warehouses = useCRUDWithQuery({
    queryKey: ["warehouses"],
    fetchFn: getWarehouses,
    createFn: createWarehouse,
    updateFn: (id, data) => updateWarehouse(String(id), data),
    deleteFn: (id) => deleteWarehouse(String(id)),
    entityName: "Almacén",
    getItemId: (warehouse) => warehouse.warehouseId,
    getItemDisplayName: (warehouse) => warehouse.name,
  });

  // Use form modal hook for modal state
  const formModal = useFormModal<Warehouse>();

  // Use data table hook for pagination
  const table = useDataTable(warehouses.items, { pageSize: PAGE_SIZE });

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await warehouses.update(formModal.selected.warehouseId, data);
    } else {
      await warehouses.create(data);
    }
    formModal.close();
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Almacenes</span>
      </Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Almacenes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={formModal.openCreate}
          disabled={warehouses.isCreating}
        >
          Crear Almacén
        </Button>
      </div>

      <div className="mt-8">
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={table.paginatedData}
          columns={[
            {
              accessor: "name",
              title: "Nombre",
            },
            {
              accessor: "phone",
              title: "Teléfono",
            },
            {
              accessor: "address",
              title: "Dirección",
              render: (warehouse) => <span>{warehouse.address}</span>,
            },
            {
              accessor: "district",
              title: "Distrito",
              render: (warehouse) => <span>{warehouse.district}</span>,
            },
            {
              accessor: "city",
              title: "Ciudad",
              render: (warehouse) => <span>{warehouse.city}</span>,
            },
            {
              accessor: "state",
              title: "Región",
              render: (warehouse) => <span>{warehouse.state}</span>,
            },
            {
              accessor: "actions",
              title: "Acciones",
              render: (warehouse) => (
                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => formModal.openEdit(warehouse)}
                    disabled={warehouses.loading || warehouses.isUpdating}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => warehouses.remove(warehouse)}
                    disabled={warehouses.loading || warehouses.isDeleting}
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
          fetching={warehouses.loading}
          totalRecords={table.totalRecords}
          recordsPerPage={table.pageSize}
          height={500}
        />
      </div>

      <WarehouseForm
        opened={formModal.opened}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        warehouse={formModal.selected}
        isLoading={warehouses.isCreating || warehouses.isUpdating}
      />
    </div>
    </ProtectedPage>
  );
}
