"use client";

import React, { useState } from "react";
import { Button, Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { useInvoices } from "@/lib/hooks/useInvoice";
import { InvoiceFilters, InvoiceStatus } from "@/lib/types/invoiceTypes";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

const PAGE_SIZE = 15;

interface InvoiceTableProps {
  filters: InvoiceFilters;
  onFiltersChange: (filters: InvoiceFilters) => void;
}

export default function InvoiceTable({ filters, onFiltersChange }: InvoiceTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useInvoices(page - 1, PAGE_SIZE, filters);
  const records  = data?.data.content ?? [];
  const pageInfo = data?.pageInfo ?? { totalElements: 0, totalPages: 0 };

  const hasFilters = Object.values(filters).some(Boolean);

  const dateRange: [Date | null, Date | null] = [
    filters.dateFrom ? dayjs(filters.dateFrom).toDate() : null,
    filters.dateTo   ? dayjs(filters.dateTo).toDate()   : null,
  ];

  const handleDateRangeChange = (value: [Date | null, Date | null]) => {
    onFiltersChange({
      ...filters,
      dateFrom: value[0] ? dayjs(value[0]).format("YYYY-MM-DD") : undefined,
      dateTo:   value[1] ? dayjs(value[1]).format("YYYY-MM-DD") : undefined,
    });
    setPage(1);
  };

  return (
    <div>
      <Group mb="md" gap="sm" wrap="wrap">
        <Select
          placeholder="Estado"
          clearable
          data={[
            { value: InvoiceStatus.PENDING, label: "Pendiente" },
            { value: InvoiceStatus.PAID,    label: "Pagado"    },
          ]}
          value={filters.status ?? null}
          onChange={(v) => {
            onFiltersChange({ ...filters, status: v as InvoiceStatus | undefined });
            setPage(1);
          }}
          w={140}
        />
        <DatePickerInput
          type="range"
          placeholder="Rango de fechas"
          value={dateRange}
          onChange={handleDateRangeChange}
          clearable
          w={240}
          valueFormat="DD/MM/YYYY"
        />
        {hasFilters && (
          <Button
            variant="subtle"
            leftSection={<IconX size={14} />}
            onClick={() => { onFiltersChange({}); setPage(1); }}
          >
            Limpiar
          </Button>
        )}
      </Group>

      <EnhancedDataTable
        serverSide
        records={records}
        columns={[
          { accessor: "invoiceNumber", title: "N° Factura" },
          { accessor: "clientName",   title: "Cliente"      },
          { accessor: "clientRuc",    title: "RUC"          },
          { accessor: "issueDate",    title: "Fecha emisión" },
          { accessor: "dueDate",      title: "Vencimiento"  },
          {
            accessor: "total",
            title: "Total",
            render: (inv) => `${inv.currency} ${Number(inv.total).toFixed(2)}`,
          },
          {
            accessor: "status",
            title: "Estado",
            render: (inv) => (
              <InvoiceStatusBadge status={inv.userId ? inv.status : null} />
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
