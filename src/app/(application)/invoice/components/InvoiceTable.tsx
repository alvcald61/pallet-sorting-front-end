"use client";

import React, { useState } from "react";
import { Button, Group, Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { useInvoices } from "@/lib/hooks/useInvoice";
import { InvoiceFilters, InvoiceStatus } from "@/lib/types/invoiceTypes";
import { IconX } from "@tabler/icons-react";

const PAGE_SIZE = 15;

export default function InvoiceTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<InvoiceFilters>({});

  const { data, isLoading } = useInvoices(page - 1, PAGE_SIZE, filters);
  const records = data?.data ?? [];
  const pageInfo = data?.pageInfo ?? { totalElements: 0, totalPages: 0 };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <Group mb="md" gap="sm" wrap="wrap">
        <Select
          placeholder="Estado"
          clearable
          data={[
            { value: InvoiceStatus.PENDING, label: "Pendiente" },
            { value: InvoiceStatus.PAID, label: "Pagado" },
          ]}
          value={filters.status ?? null}
          onChange={(v) =>
            setFilters((f) => ({ ...f, status: v as InvoiceStatus | undefined }))
          }
          w={140}
        />
        {hasFilters && (
          <Button variant="subtle" leftSection={<IconX size={14} />} onClick={() => setFilters({})}>
            Limpiar
          </Button>
        )}
      </Group>

      <EnhancedDataTable
        serverSide
        records={records}
        columns={[
          { accessor: "invoiceNumber", title: "N° Factura" },
          { accessor: "clientName", title: "Cliente" },
          { accessor: "clientRuc", title: "RUC" },
          { accessor: "issueDate", title: "Fecha emisión" },
          { accessor: "dueDate", title: "Vencimiento" },
          {
            accessor: "total",
            title: "Total",
            render: (inv) => `${inv.currency} ${Number(inv.total).toFixed(2)}`,
          },
          {
            accessor: "status",
            title: "Estado",
            render: (inv) => (
              <InvoiceStatusBadge status={inv.clientId ? inv.status : null} />
            ),
          },
        ]}
        loading={isLoading}
        page={page}
        totalRecords={pageInfo.totalElements}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        onRowClick={(record) => router.push(`/invoice/${record.record.id}`)}
        exportable={false}
        searchable={false}
        selectable={false}
        emptyState={{
          title: "No hay facturas",
          description: "Carga archivos XML para comenzar.",
        }}
      />
    </div>
  );
}
