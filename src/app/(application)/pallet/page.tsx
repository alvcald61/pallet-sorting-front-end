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
import { DataTable } from "mantine-datatable";
import React from "react";
import { PalletForm } from "./components/PalletForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useCRUD } from "@/lib/hooks/useCRUD";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { useDataTable } from "@/lib/hooks/useDataTable";

const PAGE_SIZE = 15;

export default function PalletPage() {
  // Use CRUD hook for data management
  const pallets = useCRUD({
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

  // Use data table hook for pagination
  const table = useDataTable(pallets.items, { pageSize: PAGE_SIZE });

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

  return (
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
        >
          Crear Pallet
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
            },
            {
              accessor: "updatedBy",
              title: "Actualizado Por",
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
                    disabled={pallets.loading}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => pallets.remove(pallet)}
                    disabled={pallets.loading}
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
          fetching={pallets.loading}
          height={500}
        />
      </div>

      <PalletForm
        opened={formModal.opened}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        pallet={formModal.selected}
        isLoading={pallets.loading}
      />
    </div>
  );
}
