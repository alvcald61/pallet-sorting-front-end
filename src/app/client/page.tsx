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
import React, { useEffect, useState } from "react";
import { ClientForm } from "./components/ClientForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const PAGE_SIZE = 15;

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, [page]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data || []);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error al cargar clientes",
      });
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedClient(null);
    setFormOpened(true);
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setFormOpened(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsFormLoading(true);
      if (selectedClient) {
        await updateClient(selectedClient.id, data);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Cliente actualizado correctamente",
        });
      } else {
        await createClient(data);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Cliente creado correctamente",
        });
      }
      await fetchClients();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: selectedClient
          ? "Error al actualizar cliente"
          : "Error al crear cliente",
      });
      console.error("Error:", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async (client: Client) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el cliente ${client.businessName}?`
      )
    ) {
      try {
        setLoading(true);
        await deleteClient(client.id);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Cliente eliminado correctamente",
        });
        await fetchClients();
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error al eliminar cliente",
        });
        console.error("Error deleting client:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col justify-start w-100 grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Clientes</span>
      </Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Clientes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateClick}
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
          records={clients}
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
                    onClick={() => handleEditClick(client)}
                    disabled={loading}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(client)}
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
          totalRecords={clients.length}
          recordsPerPage={PAGE_SIZE}
          fetching={loading}
          height={500}
        />
      </div>

      <ClientForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setSelectedClient(null);
        }}
        onSubmit={handleFormSubmit}
        client={selectedClient}
        isLoading={isFormLoading}
      />
    </div>
  );
}
