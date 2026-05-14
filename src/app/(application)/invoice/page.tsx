"use client";

import React, { useState } from "react";
import { Anchor, Breadcrumbs, Button, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconDownload } from "@tabler/icons-react";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceUploadModal from "./components/InvoiceUploadModal";
import { InvoiceFilters } from "@/lib/types/invoiceTypes";
import { useCanAccess } from "@/lib/utils/rbacUtils";

const InvoicePage = () => {
  const [uploadOpened, { open, close }] = useDisclosure(false);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const canExportReports = useCanAccess(["ADMIN"]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo)   params.append("dateTo",   filters.dateTo);
      const query = params.toString();
      const url = `/api/invoice/report${query ? `?${query}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "reporte-facturas.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo descargar el reporte",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col w-full grow p-4 sm:p-10">
      <Breadcrumbs mb="md">
        <Anchor href="/">Dashboard</Anchor>
        <span>Facturas SUNAT</span>
      </Breadcrumbs>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <Title order={2}>Facturas SUNAT</Title>
        <div className="flex gap-2">
          {canExportReports && (
            <Button
              leftSection={<IconDownload size={16} />}
              variant="outline"
              onClick={handleDownloadReport}
              loading={isDownloading}
            >
              Descargar reporte
            </Button>
          )}
          <Button leftSection={<IconUpload size={16} />} onClick={open}>
            Cargar XML
          </Button>
        </div>
      </div>

      <InvoiceTable filters={filters} onFiltersChange={setFilters} />
      <InvoiceUploadModal opened={uploadOpened} onClose={close} />
    </div>
  );
};

export default InvoicePage;
