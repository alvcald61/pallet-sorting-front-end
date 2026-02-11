"use client";

import { Pallet } from "@/lib/types/palletType";
import {
  createPallet,
  deletePallet,
  getPallets,
  updatePallet,
} from "@/lib/api/pallet/palletApi";
import {
  Button,
  Group,
  Badge,
  ActionIcon,
  Title,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import React from "react";
import { PalletForm } from "./components/PalletForm";
import { IconEdit, IconTrash, IconPlus, IconBoxSeam } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { modals } from "@mantine/modals";

const PAGE_SIZE = 15;

export default function PalletPage() {
  // Use CRUD hook with React Query
  const pallets = useCRUDWithQuery({
    queryKey: ["pallets"],
    fetchFn: getPallets,
    createFn: createPallet,
    updateFn: (id, data) => updatePallet(String(id), data),
    deleteFn: (id) => deletePallet(String(id)),
    entityName: "Pallet",
    getItemId: (pallet) => pallet.id,
    getItemDisplayName: (pallet) => `Pallet #${pallet.id}`,
  });

  // Use form modal hook for modal state
  const formModal = useFormModal<Pallet>();

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await pallets.update(formModal.selected.id, data);
    } else {
      await pallets.create(data);
    }
    formModal.close();
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-PE");
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedIds: Set<string | number>) => {
    const selectedPallets = pallets.items.filter(pallet =>
      selectedIds.has(pallet.id)
    );

    modals.openConfirmModal({
      title: 'Eliminar pallets',
      children: (
        <>
          ¿Estás seguro de que deseas eliminar {selectedPallets.length} pallet(s)?
          <br />
          Esta acción no se puede deshacer.
        </>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        for (const pallet of selectedPallets) {
          await pallets.remove(pallet);
        }
      },
    });
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
      <div className="flex flex-col justify-start w-full grow p-10">
        <Breadcrumbs className="mb-4">
          <Anchor href="/">Dashboard</Anchor>
          <span>Pallets</span>
        </Breadcrumbs>
        <div className="flex justify-between">
          <Title order={2}>Configuración de Pallets</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={formModal.openCreate}
            disabled={pallets.isCreating}
          >
            Crear Pallet
          </Button>
        </div>

        <div className="mt-8">
          <EnhancedDataTable
            records={pallets.items}
            columns={[
              {
                accessor: "id",
                title: "ID",
              },
              {
                accessor: "width",
                title: "Ancho (m)",
                render: (pallet) => <span>{pallet.width.toFixed(2)}</span>,
              },
              {
                accessor: "length",
                title: "Largo (m)",
                render: (pallet) => <span>{pallet.length.toFixed(2)}</span>,
              },
              {
                accessor: "height",
                title: "Alto (m)",
                render: (pallet) => <span>{pallet.height.toFixed(2)}</span>,
              },
              {
                accessor: "enabled",
                title: "Habilitado",
                render: (pallet) => (
                  <Badge color={pallet.enabled ? "green" : "gray"}>
                    {pallet.enabled ? "Sí" : "No"}
                  </Badge>
                ),
                sortable: false,
              },
              {
                accessor: "createdAt",
                title: "Creado",
                render: (pallet) => <span>{formatDate(pallet.createdAt)}</span>,
              },
              {
                accessor: "updatedAt",
                title: "Actualizado",
                render: (pallet) => <span>{formatDate(pallet.updatedAt)}</span>,
              },
              {
                accessor: "createdBy",
                title: "Creado Por",
                sortable: false,
              },
              {
                accessor: "updatedBy",
                title: "Actualizado Por",
                sortable: false,
              },
              {
                accessor: "actions",
                title: "Acciones",
                render: (pallet) => (
                  <Group gap="xs">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => formModal.openEdit(pallet)}
                      disabled={pallets.loading || pallets.isUpdating}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => pallets.remove(pallet)}
                      disabled={pallets.loading || pallets.isDeleting}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            loading={pallets.loading}
            pageSize={PAGE_SIZE}
            searchable
            searchableFields={["id"]}
            searchPlaceholder="Buscar por ID..."
            selectable
            getRecordId={(pallet) => pallet.id}
            bulkActions={[
              {
                label: "Eliminar seleccionados",
                icon: <IconTrash size={16} />,
                color: "red",
                onClick: handleBulkDelete,
              },
            ]}
            exportable
            exportFileName="pallets"
            emptyState={{
              title: "No hay pallets registrados",
              description: "Comienza creando tu primer pallet para gestionar tus cargas.",
              icon: <IconBoxSeam size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
              action: {
                label: "Crear primer pallet",
                onClick: formModal.openCreate,
              },
            }}
          />
        </div>

        <PalletForm
          opened={formModal.opened}
          onClose={formModal.close}
          onSubmit={handleFormSubmit}
          pallet={formModal.selected}
          isLoading={pallets.isCreating || pallets.isUpdating}
        />
      </div>
    </ProtectedPage>
  );
}
