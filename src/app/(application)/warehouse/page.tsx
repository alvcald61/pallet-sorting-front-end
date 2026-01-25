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
import React, { useEffect, useState } from "react";
import { WarehouseForm } from "./components/WarehouseForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const PAGE_SIZE = 15;

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch warehouses on mount
  useEffect(() => {
    fetchWarehouses();
  }, [page]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await getWarehouses();
      setWarehouses(response.data || []);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error al cargar almacenes",
      });
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedWarehouse(null);
    setFormOpened(true);
  };

  const handleEditClick = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormOpened(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsFormLoading(true);
      if (selectedWarehouse) {
        await updateWarehouse(selectedWarehouse.warehouseId + "", data);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Almacén actualizado correctamente",
        });
      } else {
        await createWarehouse(data);
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Almacén creado correctamente",
        });
      }
      await fetchWarehouses();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: selectedWarehouse
          ? "Error al actualizar almacén"
          : "Error al crear almacén",
      });
      console.error("Error:", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDelete = async (warehouse: Warehouse) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el almacén ${warehouse.name}?`
      )
    ) {
      try {
        setLoading(true);
        await deleteWarehouse(warehouse.warehouseId + "");
        notifications.show({
          color: "green",
          title: "Éxito",
          message: "Almacén eliminado correctamente",
        });
        await fetchWarehouses();
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error al eliminar almacén",
        });
        console.error("Error deleting warehouse:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Almacenes</span>
      </Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Almacenes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateClick}
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
          records={warehouses}
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
                    onClick={() => handleEditClick(warehouse)}
                    disabled={loading}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(warehouse)}
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
          fetching={loading}
          totalRecords={warehouses.length}
          recordsPerPage={PAGE_SIZE}
          height={500}
        />
      </div>

      <WarehouseForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setSelectedWarehouse(null);
        }}
        onSubmit={handleFormSubmit}
        warehouse={selectedWarehouse}
        isLoading={isFormLoading}
      />
    </div>
  );
}
