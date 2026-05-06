"use client";

import React, { useRef, useState } from "react";
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconUpload, IconX } from "@tabler/icons-react";
import { usePayInvoice } from "@/lib/hooks/useInvoice";

interface Props {
  opened: boolean;
  onClose: () => void;
  invoiceId: number;
  invoiceNumber: string;
}

export default function RegisterPaymentModal({ opened, onClose, invoiceId, invoiceNumber }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const payMutation = usePayInvoice(invoiceId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files ?? []));
  };

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleConfirm = async () => {
    if (!files.length) return;
    await payMutation.mutateAsync(files);
    setFiles([]);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Registrar Pago — ${invoiceNumber}`}
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Sube una o más evidencias de pago (imagen o PDF). El pago no puede revertirse.
        </Text>
        <Box
          style={{
            border: "2px dashed #ced4da",
            borderRadius: 8,
            padding: 20,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => inputRef.current?.click()}
        >
          <IconUpload size={24} style={{ opacity: 0.4, margin: "0 auto 6px" }} />
          <Text size="sm" c="dimmed">
            Haz clic para adjuntar archivos
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>
        {files.map((f) => (
          <Group key={f.name} gap="xs">
            <Text size="sm" style={{ flex: 1 }}>
              {f.name}
            </Text>
            <Button
              variant="subtle"
              size="compact-xs"
              color="red"
              onClick={() => removeFile(f.name)}
            >
              <IconX size={12} />
            </Button>
          </Group>
        ))}
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            color="green"
            disabled={!files.length || payMutation.isPending}
            loading={payMutation.isPending}
            onClick={handleConfirm}
          >
            Confirmar Pago
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
