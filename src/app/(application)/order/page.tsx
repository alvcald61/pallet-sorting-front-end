"use client";
import React, { useEffect, useState } from "react";
import useOrderStore from "@/lib/store/OrderStore";
import {
  Breadcrumbs,
  Anchor,
  Title,
  Button,
  Menu,
  Modal,
  Select,
  Box,
} from "@mantine/core";
import { DataTableSortStatus } from "mantine-datatable";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import OneSignal from "react-onesignal";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/lib/api/client/clientApi";
import { useOrders } from "@/lib/hooks/useOrder";
import { useOrderFilters } from "@/lib/hooks/useOrderFilters";
import { OrderFiltersComponent } from "./components/OrderFilters";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { IconPackage } from "@tabler/icons-react";

const PAGE_SIZE = 15;

const Page = () => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [to, setTo] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any> | null>(
    null,
  );

  const { addUserId } = useOrderStore();
  const isAdmin = useCanAccess(["ADMIN"]);

  const {
    filters,
    effectiveFilters,
    setFilters,
    resetFilters,
    hasActiveFilters,
  } = useOrderFilters();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [effectiveFilters]);

  // Initialize OneSignal
  useEffect(() => {
    if (typeof window !== "undefined") {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
        allowLocalhostAsSecureOrigin: true,
      });
    }
  }, []);

  // Extract sort parameter for API in Spring Boot format: "field,direction"
  const sort = sortStatus
    ? `${sortStatus.columnAccessor},${sortStatus.direction}`
    : undefined;

  // Fetch orders with React Query using custom hook
  const { data: ordersData, isLoading: isFetchingOrders } = useOrders(
    page - 1,
    PAGE_SIZE,
    isAdmin,
    effectiveFilters,
    sort,
  );

  const records = ordersData?.data || [];
  const pageInfo = ordersData?.pageInfo || { totalElements: 0, totalPages: 0 };

  // Fetch clients with React Query (only when needed)
  const { data: clientsData, isLoading: isFetchingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    enabled: isAdmin && opened, // Only fetch when modal is open and user is admin
  });

  const clients =
    clientsData?.data.map((client: any) => ({
      value: `${client.id}`,
      label: `${client.businessName} - ${client.ruc}`,
    })) || [];

  const openModal = async (value: string) => {
    if (isAdmin) {
      setTo(value);
      open();
    } else {
      router.push(value);
    }
  };

  const handleContinue = () => {
    close();
    addUserId(selectedClient || "");
    router.push(to);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Cliente">
        <Select
          data={clients}
          value={selectedClient}
          onChange={setSelectedClient}
          placeholder="Seleccionar cliente"
          disabled={isFetchingClients}
        />
        <Box className="flex justify-end mt-4">
          <Button onClick={handleContinue}>Continuar</Button>
        </Box>
      </Modal>

      <div className="flex flex-col justify-start w-full grow p-10">
        <Breadcrumbs className="mb-4">
          <Anchor href="/">Dashboard</Anchor>
          <span>Ordenes</span>
        </Breadcrumbs>

        <div className="flex justify-between">
          <Title order={2}>Tus Ordenes</Title>
          <Menu width={200} position="bottom-start">
            <Menu.Target>
              <Button>Crear orden</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => openModal("/order/bulk")}>
                Por bultos
              </Menu.Item>
              <Menu.Item onClick={() => openModal("/order/pallet")}>
                Por pallet
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div className="mt-4">
          <OrderFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        <div className="mt-4">
          <EnhancedDataTable
            serverSide
            records={records}
            columns={[
              { accessor: "id", title: "ID" },
              {
                accessor: "amount",
                title: "Monto",
                render: (order) => (
                  <span>{!order.amount ? "Pendiente" : order.amount}</span>
                ),
              },
              { accessor: "fromAddress", title: "Desde" },
              { accessor: "toAddress", title: "Hacia" },
              { accessor: "orderType", title: "Tipo de pedido" },
              { accessor: "pickupDate", title: "Fecha de recojo" },
              {
                accessor: "projectedDeliveryDate",
                title: "Fecha estimada de llegada",
              },
              { accessor: "realDeliveryDate", title: "Fecha real de llegada" },
              { accessor: "orderStatus", title: "Estado del envio" },
            ]}
            loading={isFetchingOrders}
            page={page}
            totalRecords={pageInfo.totalElements}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onRowClick={(record) => router.push(`/order/${record.id}`)}
            exportable
            exportFileName="ordenes"
            searchable={false}
            selectable={false}
            emptyState={{
              title: "No hay órdenes registradas",
              description:
                "Comienza creando tu primera orden para gestionar tus envíos.",
              icon: (
                <IconPackage size={64} stroke={1.5} style={{ opacity: 0.3 }} />
              ),
              action: {
                label: "Crear primera orden",
                onClick: () => openModal("/order/bulk"),
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
