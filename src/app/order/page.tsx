"use client";
import React, { useEffect, useState } from "react";

import useOrderStore from "@/lib/store/OrderStore";
import { Breadcrumbs, Anchor, Title, Button, Menu } from "@mantine/core";
import { BsPlusCircle } from "react-icons/bs";
import { PalletForm } from "./components/palletForm";
import { createOrder, getOrdersByPage } from "@/lib/api/order/orderApi";
import { Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import { redirect } from "next/navigation";

const PAGE_SIZE = 15;

const Page = () => {
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [records, setRecords] = useState([
    { id: 1, name: "Joe Biden", bornIn: 1942, party: "Democratic" },
  ]);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 });

  const icon = <BsPlusCircle />;

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
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

  return (
    <div className="flex flex-col justify-start w-100 grow">
      <Breadcrumbs className="mb-4">order</Breadcrumbs>
      <div className="flex justify-between">
        <Title order={2}>Tus Ordenes</Title>
        <div>
          <Menu width={200} position="bottom-start">
            <Menu.Target>
              <Button>Crear orden</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => redirect("/order/bulk")}>
                Por bultos
              </Menu.Item>
              <Menu.Item onClick={() => redirect("/order/pallet")}>
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
          height={300}
        />
      </div>
    </div>
  );
};

export default Page;
