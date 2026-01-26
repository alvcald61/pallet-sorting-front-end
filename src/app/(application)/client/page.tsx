"use client";

import { Client } from "@/lib/types/clientType";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "@/lib/api/client/clientApi";
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
import { ClientForm } from "./components/ClientForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { useDataTable } from "@/lib/hooks/useDataTable";

const PAGE_SIZE = 15;

export default function ClientPage() {
  // Use CRUD hook with React Query for automatic caching
  const clients = useCRUDWithQuery({
    queryKey: ["clients"],
    fetchFn: getClients,
    createFn: createClient,
    updateFn: (id, data) => updateClient(String(id), data),
    deleteFn: (id) => deleteClient(String(id)),
    entityName: "Cliente",
    getItemId: (client) => client.id,
    getItemDisplayName: (client) => client.businessName,
  });

  // Use form modal hook for modal state
  const formModal = useFormModal<Client>();

  // Use data table hook for pagination
  const table = useDataTable(clients.items, { pageSize: PAGE_SIZE });

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await clients.update(formModal.selected.id, data);
    } else {
      await clients.create(data);
    }
    formModal.close();
  };

  return (
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Clientes</span>
      </Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Clientes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={formModal.openCreate}
          disabled={clients.isCreating}
        >
          Crear Cliente
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
              accessor: "ruc",
              title: "RUC",
            },
            {
              accessor: "businessName",
              title: "Negocio",
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
              accessor: "address",
              title: "Dirección",
            },
            {
              accessor: "trust",
              title: "Confianza",
              render: (client) => <span>{client.trust ? "Sí" : "No"}</span>,
            },
            {
              accessor: "roles",
              title: "Roles",
              render: (client) => (
                <Group gap="xs">
                  {client.roles.map((role) => (
                    <Badge key={role.id} size="sm" variant="light">
                      {role.name}
                    </Badge>
                  ))}
                </Group>
              ),
            },
            {
              accessor: "actions",
              title: "Acciones",
              render: (client) => (
                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => formModal.openEdit(client)}
                    disabled={clients.loading || clients.isUpdating}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => clients.remove(client)}
                    disabled={clients.loading || clients.isDeleting}
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
          fetching={clients.loading}
          height={500}
        />
      </div>

      <ClientForm
        opened={formModal.opened}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        client={formModal.selected}
        isLoading={clients.isCreating || clients.isUpdating}
      />
    </div>
  );
}
