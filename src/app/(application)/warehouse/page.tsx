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
  Tooltip,
} from "@mantine/core";
import React, { useState } from "react";
import { WarehouseForm } from "./components/WarehouseForm";
import { WarehouseDocumentsModal } from "./components/WarehouseDocumentsModal";
import { IconEdit, IconTrash, IconPlus, IconFileDescription, IconBuilding } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { modals } from "@mantine/modals";

const PAGE_SIZE = 15;

export default function WarehousePage() {
  // State for documents modal
  const [documentsModal, setDocumentsModal] = useState<{
    opened: boolean;
    warehouse: Warehouse | null;
  }>({ opened: false, warehouse: null });

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

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await warehouses.update(formModal.selected.warehouseId, data);
    } else {
      await warehouses.create(data);
    }
    formModal.close();
  };

  const openDocumentsModal = (warehouse: Warehouse) => {
    setDocumentsModal({ opened: true, warehouse });
  };

  const closeDocumentsModal = () => {
    setDocumentsModal({ opened: false, warehouse: null });
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedIds: Set<string | number>) => {
    const selectedWarehouses = warehouses.items.filter(warehouse =>
      selectedIds.has(warehouse.warehouseId)
    );

    modals.openConfirmModal({
      title: 'Eliminar almacenes',
      children: (
        <>
          ¿Estás seguro de que deseas eliminar {selectedWarehouses.length} almacén(es)?
          <br />
          Esta acción no se puede deshacer.
        </>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        for (const warehouse of selectedWarehouses) {
          await warehouses.remove(warehouse);
        }
      },
    });
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
      <div className="flex flex-col justify-start w-full grow p-4 sm:p-10">
        <Breadcrumbs className="mb-4">
          <Anchor href="/">Dashboard</Anchor>
          <span>Almacenes</span>
        </Breadcrumbs>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <Title order={2} className="text-xl sm:text-2xl">Tus Almacenes</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={formModal.openCreate}
            disabled={warehouses.isCreating}
          >
            Crear Almacén
          </Button>
        </div>

        <div className="mt-8">
          <EnhancedDataTable
            records={warehouses.items}
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
                    <Tooltip label="Gestionar documentos">
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="green"
                        onClick={() => openDocumentsModal(warehouse)}
                        disabled={warehouses.loading}
                      >
                        <IconFileDescription size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Editar">
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="blue"
                        onClick={() => formModal.openEdit(warehouse)}
                        disabled={warehouses.loading || warehouses.isUpdating}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() => warehouses.remove(warehouse)}
                        disabled={warehouses.loading || warehouses.isDeleting}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                ),
              },
            ]}
            loading={warehouses.loading}
            pageSize={PAGE_SIZE}
            searchable
            searchableFields={["name", "phone", "address", "district", "city", "state"]}
            searchPlaceholder="Buscar por nombre, teléfono, dirección..."
            selectable
            getRecordId={(warehouse) => warehouse.warehouseId}
            bulkActions={[
              {
                label: "Eliminar seleccionados",
                icon: <IconTrash size={16} />,
                color: "red",
                onClick: handleBulkDelete,
              },
            ]}
            exportable
            exportFileName="almacenes"
            emptyState={{
              title: "No hay almacenes registrados",
              description: "Comienza creando tu primer almacén para gestionar tus inventarios.",
              icon: <IconBuilding size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
              action: {
                label: "Crear primer almacén",
                onClick: formModal.openCreate,
              },
            }}
          />
        </div>

        <WarehouseForm
          opened={formModal.opened}
          onClose={formModal.close}
          onSubmit={handleFormSubmit}
          warehouse={formModal.selected}
          isLoading={warehouses.isCreating || warehouses.isUpdating}
        />

        {documentsModal.warehouse && (
          <WarehouseDocumentsModal
            opened={documentsModal.opened}
            onClose={closeDocumentsModal}
            warehouseId={documentsModal.warehouse.warehouseId}
            warehouseName={documentsModal.warehouse.name}
          />
        )}
      </div>
    </ProtectedPage>
  );
}
