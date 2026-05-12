"use client";

import React from "react";
import { Anchor, Breadcrumbs, Button, Group, Skeleton, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCreditCard, IconUserPlus } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useInvoice } from "@/lib/hooks/useInvoice";
import { InvoiceStatus } from "@/lib/types/invoiceTypes";
import InvoiceDetailCard from "../components/InvoiceDetailCard";
import PaymentEvidenceList from "../components/PaymentEvidenceList";
import RegisterPaymentModal from "../components/RegisterPaymentModal";
import AssignClientModal from "../components/AssignClientModal";

const InvoiceDetailPage = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { data, isLoading } = useInvoice(invoiceId);
  const [payOpened, { open: openPay, close: closePay }] = useDisclosure(false);
  const [assignOpened, { open: openAssign, close: closeAssign }] = useDisclosure(false);

  const invoice = data?.data;
  const isPaid = invoice?.status === InvoiceStatus.PAID;
  const isUnassigned = !invoice?.userId;

  if (isLoading) return <div className="p-10"><Skeleton height={200} /></div>;
  if (!invoice) return null;

  return (
    <div className="flex flex-col w-full grow p-4 sm:p-10">
      <Breadcrumbs mb="md">
        <Anchor href="/">Dashboard</Anchor>
        <Anchor href="/invoice">Facturas</Anchor>
        <span>{invoice.invoiceNumber}</span>
      </Breadcrumbs>

      <Group justify="space-between" mb="lg">
        <Title order={2}>Detalle de Factura</Title>
        <Group gap="sm">
          {isUnassigned && (
            <Button
              variant="outline"
              leftSection={<IconUserPlus size={16} />}
              onClick={openAssign}
            >
              Asignar Cliente
            </Button>
          )}
          {!isPaid && (
            <Button
              color="green"
              leftSection={<IconCreditCard size={16} />}
              onClick={openPay}
            >
              Registrar Pago
            </Button>
          )}
        </Group>
      </Group>

      <InvoiceDetailCard invoice={invoice} />
      <PaymentEvidenceList evidence={invoice.evidenceFiles ?? []} />

      <RegisterPaymentModal
        opened={payOpened}
        onClose={closePay}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoiceNumber}
      />
      <AssignClientModal
        opened={assignOpened}
        onClose={closeAssign}
        invoiceId={invoice.id}
        invoiceRuc={invoice.clientRuc}
      />
    </div>
  );
};

export default InvoiceDetailPage;
