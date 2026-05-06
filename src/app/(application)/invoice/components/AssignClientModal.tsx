"use client";

import React, { useState } from "react";
import { Alert, Button, Group, Modal, Select } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/lib/api/client/clientApi";
import { useAssignClient } from "@/lib/hooks/useInvoice";

interface Props {
  opened: boolean;
  onClose: () => void;
  invoiceId: number;
  invoiceRuc: string;
}

export default function AssignClientModal({ opened, onClose, invoiceId, invoiceRuc }: Props) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const assignMutation = useAssignClient(invoiceId);

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    enabled: opened,
  });

  const clients = (clientsData?.data ?? []).map((c: any) => ({
    value: String(c.id),
    label: `${c.businessName} — ${c.ruc}`,
    ruc: c.ruc,
  }));

  const selectedClient = clients.find((c: any) => c.value === selectedClientId);
  const rucMismatch = selectedClient && selectedClient.ruc !== invoiceRuc;

  const handleConfirm = async () => {
    if (!selectedClientId) return;
    await assignMutation.mutateAsync(Number(selectedClientId));
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Asignar Cliente" centered>
      <Select
        label="Cliente"
        placeholder="Seleccionar cliente"
        data={clients}
        value={selectedClientId}
        onChange={setSelectedClientId}
        searchable
        mb="md"
      />
      {rucMismatch && (
        <Alert icon={<IconAlertTriangle size={16} />} color="orange" mb="md">
          El RUC del cliente seleccionado ({selectedClient?.ruc}) no coincide con el RUC de la
          factura ({invoiceRuc}). Puedes continuar si es una corrección manual.
        </Alert>
      )}
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedClientId || assignMutation.isPending}
          loading={assignMutation.isPending}
        >
          Asignar
        </Button>
      </Group>
    </Modal>
  );
}
