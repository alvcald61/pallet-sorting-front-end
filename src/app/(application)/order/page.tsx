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
import { BsPlusCircle } from "react-icons/bs";
import { getOrdersByPage } from "@/lib/api/order/orderApi";
import { getClients } from "@/lib/api/client/clientApi";
import { showNotification } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { Order } from "@/lib/types/orderRequest";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { PERMISSIONS } from "@/lib/const/rbac";
import OneSignal from "react-onesignal";

const PAGE_SIZE = 15;

const Page = () => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [to, setTo] = useState("");
  const [clients, setClients] = useState<{ value: string; label: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [records, setRecords] = useState<Order[]>([]);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 });

  const { addUserId } = useOrderStore();
  const isAdmin = useCanAccess(["ADMIN"]);

  // Initialize OneSignal
  useEffect(() => {
    if (typeof window !== "undefined") {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
        },
      });
    }
  }, []);

  // Fetch orders on page change
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const result = await getOrdersByPage(page - 1, PAGE_SIZE, isAdmin);
        setPageInfo(result.pageInfo);
        setRecords(result.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [page, isAdmin]);

  const openModal = async (value: string) => {
    if (isAdmin) {
      setTo(value);
      try {
        const clientsData = await getClients();
        setClients(
          clientsData.data.map((client: any) => ({
            value: `${client.id}`,
            label: `${client.businessName} - ${client.ruc}`,
          }))
        );
        open();
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
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

        <div className="mt-8">
          <DataTable
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
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
            onRowClick={({ record }) => router.push(`/order/${record.id}`)}
            onPageChange={(p) => setPage(p)}
            totalRecords={pageInfo.totalElements}
            recordsPerPage={PAGE_SIZE}
            page={page}
            fetching={fetching}
            loadingText="Cargando..."
            noRecordsText="No se encontraron órdenes"
            height={500}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
