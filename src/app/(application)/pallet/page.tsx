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
import React, { useEffect, useState } from "react";
import { PalletForm } from "./components/PalletForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const PAGE_SIZE = 15;

export default function PalletPage() {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [selectedPallet, setSelectedPallet] = useState<Pallet | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch pallets on mount
  useEffect(() => {
    fetchPallets();
  }, [page]);

  const fetchPallets = async () => {
    try {
      setLoading(true);
      const response = await getPallets();
      setPallets(response.data || []);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error al cargar pallets",
      });
      console.error("Error fetching pallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedPallet(null);
    setFormOpened(true);
  };

  const handleEditClick = (pallet: Pallet) => {
    setSelectedPallet(pallet);
    setFormOpened(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsFormLoading(true);
      if (selectedPallet) {
        await updatePallet(selectedPallet.id, data);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Pallet actualizado correctamente",
        });
      } else {
        await createPallet(data);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Pallet creado correctamente",
        });
      }
      await fetchPallets();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: selectedPallet
          ? "Error al actualizar pallet"
          : "Error al crear pallet",
      });
      console.error("Error:", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async (pallet: Pallet) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el pallet ${pallet.id}?`
      )
    ) {
      try {
        setLoading(true);
        await deletePallet(pallet.id);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Pallet eliminado correctamente",
        });
        await fetchPallets();
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error al eliminar pallet",
        });
        console.error("Error deleting pallet:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-PE");
  };

  return (
    <div className="flex flex-col justify-start w-100 grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Pallets</span>
      </Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Configuración de Pallets</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateClick}
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
          records={pallets}
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
                    onClick={() => handleEditClick(pallet)}
                    disabled={loading}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(pallet)}
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
          totalRecords={pallets.length}
          recordsPerPage={PAGE_SIZE}
          fetching={loading}
          height={500}
        />
      </div>

      <PalletForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setSelectedPallet(null);
        }}
        onSubmit={handleFormSubmit}
        pallet={selectedPallet}
        isLoading={isFormLoading}
      />
    </div>
  );
}
