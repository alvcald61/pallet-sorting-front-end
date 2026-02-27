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
import React from "react";
import { ClientForm } from "./components/ClientForm";
import { IconEdit, IconTrash, IconPlus, IconUsers } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { modals } from "@mantine/modals";

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

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await clients.update(formModal.selected.id, data);
    } else {
      await clients.create(data);
    }
    formModal.close();
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedIds: Set<string | number>) => {
    const selectedClients = clients.items.filter(client =>
      selectedIds.has(client.id)
    );

    modals.openConfirmModal({
      title: 'Eliminar clientes',
      children: (
        <>
          ¿Estás seguro de que deseas eliminar {selectedClients.length} cliente(s)?
          <br />
          Esta acción no se puede deshacer.
        </>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        for (const client of selectedClients) {
          await clients.remove(client);
        }
      },
    });
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
      <div className="flex flex-col justify-start w-full grow p-4 sm:p-10">
        <Breadcrumbs className="mb-4">
          <Anchor href="/">Dashboard</Anchor>
          <span>Clientes</span>
        </Breadcrumbs>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <Title order={2} className="text-xl sm:text-2xl">Tus Clientes</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={formModal.openCreate}
            disabled={clients.isCreating}
          >
            Crear Cliente
          </Button>
        </div>

        <div className="mt-8">
          <EnhancedDataTable
            records={clients.items}
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
                sortable: false,
              },
              {
                accessor: "roles",
                title: "Roles",
                render: (client) => (
                  <Group gap="xs">
                    {client.roles?.map((role) => (
                      <Badge key={role.id} size="sm" variant="light">
                        {role.name}
                      </Badge>
                    )) || <span>-</span>}
                  </Group>
                ),
                sortable: false,
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
            loading={clients.loading}
            pageSize={PAGE_SIZE}
            searchable
            searchableFields={["ruc", "businessName", "firstName", "lastName", "email", "phone", "address"]}
            searchPlaceholder="Buscar por RUC, negocio, nombre, email..."
            selectable
            getRecordId={(client) => client.id}
            bulkActions={[
              {
                label: "Eliminar seleccionados",
                icon: <IconTrash size={16} />,
                color: "red",
                onClick: handleBulkDelete,
              },
            ]}
            exportable
            exportFileName="clientes"
            emptyState={{
              title: "No hay clientes registrados",
              description: "Comienza creando tu primer cliente para gestionar tus ventas.",
              icon: <IconUsers size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
              action: {
                label: "Crear primer cliente",
                onClick: formModal.openCreate,
              },
            }}
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
    </ProtectedPage>
  );
}
