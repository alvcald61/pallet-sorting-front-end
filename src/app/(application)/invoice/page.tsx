"use client";

import React from "react";
import { Anchor, Breadcrumbs, Button, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceUploadModal from "./components/InvoiceUploadModal";

const InvoicePage = () => {
  const [uploadOpened, { open, close }] = useDisclosure(false);

  return (
    <div className="flex flex-col w-full grow p-4 sm:p-10">
      <Breadcrumbs mb="md">
        <Anchor href="/">Dashboard</Anchor>
        <span>Facturas SUNAT</span>
      </Breadcrumbs>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <Title order={2}>Facturas SUNAT</Title>
        <Button leftSection={<IconUpload size={16} />} onClick={open}>
          Cargar XML
        </Button>
      </div>

      <InvoiceTable />
      <InvoiceUploadModal opened={uploadOpened} onClose={close} />
    </div>
  );
};

export default InvoicePage;
