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
} from "@mantine/core";
import { BsPlusCircle } from "react-icons/bs";
import { PalletForm } from "./components/palletForm";
import { createOrder, getOrdersByPage } from "@/lib/api/order/orderApi";
import { getClients } from "@/lib/api/client/clientApi";
import { Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import { redirect } from "next/navigation";
import { NavbarNested } from "./components/NavBar";
import { useDisclosure } from "@mantine/hooks";

const PAGE_SIZE = 15;

const Page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [to, setTo] = useState("");
  const [clients, setClients] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [records, setRecords] = useState([
    { id: 1, name: "Joe Biden", bornIn: 1942, party: "Democratic" },
  ]);

  const { addUserId } = useOrderStore();

  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 });

  const icon = <BsPlusCircle />;

  useEffect(() => {
    // const from = (page - 1) * PAGE_SIZE;
    // const to = from + PAGE_SIZE;
    const fetchData = async () => {
      setFetching(true);
      const result = await getOrdersByPage(page, PAGE_SIZE);
      setPageInfo(result.pageInfo);
      setRecords(result.data);
      setFetching(false);
    };
    fetchData();

    // fetch data
    // setRecords([]);
  }, [page]);

  const openModal = (value: string) => {
    setTo(value);

    const fetchClients = async () => {
      // Fetch clients from API
      const clientsData = await getClients();
      setClients(
        clientsData.data.map((client: any) => ({
          value: `${client.id}`,
          label: `${client.businessName} - ${client.ruc}`,
        }))
      );
    };
    fetchClients();
    open();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Cliente">
        <Select
          data={clients}
          value={selectedClient}
          onChange={setSelectedClient}
        />
        <Box className="flex justify-end mt-4">
          <Button
            onClick={() => {
              close();
              addUserId(selectedClient || "");
              redirect(to);
            }}
          >
            Continuar
          </Button>
        </Box>
      </Modal>
      <div className="flex flex-col justify-start w-100 grow p-10">
        <Breadcrumbs className="mb-4">order</Breadcrumbs>
        <div className="flex justify-between">
          <Title order={2}>Tus Ordenes</Title>
          <div>
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
            {/* <Button
            className="mr-3"
            leftSection={icon}
            onClick={() => redirect("/order/bulk")}
          >
            Crear order por bultos
          </Button>
          <Button leftSection={icon} onClick={() => redirect("/order/pallet")}>
            Crear orden por pallets
          </Button> */}
          </div>
        </div>
        <div className="mt-8">
          <DataTable
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            // provide data
            records={records}
            // define columns
            columns={[
              {
                accessor: "id",
                // this column has a custom title
                // title: "#",
                // right-align column
                // textAlign: "right",
              },
              { accessor: "amount", title: "Monto" },
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
            // execute this callback when a row is clicked
            onRowClick={({ record: { name, party, bornIn } }) =>
              showNotification({
                title: `Clicked on ${name}`,
                message: `You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`,
                withBorder: true,
              })
            }
            onPageChange={(p) => setPage(p)}
            totalRecords={pageInfo.totalElements}
            recordsPerPage={PAGE_SIZE}
            loadingText="Loading..."
            // 👇 uncomment the next line to display a custom text when no records were found
            noRecordsText="No records found"
            page={page}
            fetching={fetching}
            height={500}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
