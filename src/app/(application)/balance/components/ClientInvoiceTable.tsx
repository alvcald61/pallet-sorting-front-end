"use client";

import { useState } from "react";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import InvoiceStatusBadge from "@/app/(application)/invoice/components/InvoiceStatusBadge";
import { useClientInvoices } from "@/lib/hooks/useInvoice";
import { InvoiceStatus } from "@/lib/types/invoiceTypes";

const PAGE_SIZE = 10;

interface Props {
  userId: number;
}

export default function ClientInvoiceTable({ userId }: Props) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useClientInvoices(userId, page - 1, PAGE_SIZE);
  const records = data?.data.content ?? [];
  const pageInfo = data?.pageInfo ?? { totalElements: 0, totalPages: 0 };

  return (
    <EnhancedDataTable
      serverSide
      records={records}
      columns={[
        { accessor: "invoiceNumber", title: "N° Factura" },
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
            <InvoiceStatusBadge status={inv.status as InvoiceStatus} />
          ),
        },
      ]}
      loading={isLoading}
      page={page}
      totalRecords={pageInfo.totalElements}
      onPageChange={setPage}
      pageSize={PAGE_SIZE}
      exportable={false}
      searchable={false}
      selectable={false}
      emptyState={{
        title: "Sin facturas",
        description: "Aún no tienes facturas registradas.",
      }}
    />
  );
}
