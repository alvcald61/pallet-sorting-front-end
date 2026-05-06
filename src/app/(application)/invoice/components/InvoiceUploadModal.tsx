"use client";

import React, { useRef, useState } from "react";
import { Badge, Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconUpload, IconX } from "@tabler/icons-react";
import { useUploadInvoices } from "@/lib/hooks/useInvoice";
import { InvoiceUploadResult, UploadStatus } from "@/lib/types/invoiceTypes";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export default function InvoiceUploadModal({ opened, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<InvoiceUploadResult[]>([]);
  const uploadMutation = useUploadInvoices();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(e.target.files ?? []));
    setResults([]);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    const data = await uploadMutation.mutateAsync(selectedFiles);
    setResults(data);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setResults([]);
    onClose();
  };

  const resultIcon = (status: UploadStatus) => {
    if (status === UploadStatus.SUCCESS) return <IconCheck size={14} color="green" />;
    if (status === UploadStatus.WARNING) return <IconAlertTriangle size={14} color="orange" />;
    return <IconX size={14} color="red" />;
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Cargar Facturas XML" size="lg" centered>
      <Stack gap="md">
        <Box
          style={{
            border: "2px dashed #ced4da",
            borderRadius: 8,
            padding: 24,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => inputRef.current?.click()}
        >
          <IconUpload size={32} style={{ opacity: 0.4, margin: "0 auto 8px" }} />
          <Text size="sm" c="dimmed">
            Haz clic o arrastra archivos XML aquí
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept=".xml"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

        {selectedFiles.length > 0 && results.length === 0 && (
          <Stack gap={4}>
            {selectedFiles.map((f) => (
              <Text key={f.name} size="sm">
                📄 {f.name}
              </Text>
            ))}
          </Stack>
        )}

        {results.length > 0 && (
          <Stack gap={6}>
            {results.map((r) => (
              <Group key={r.fileName} gap="xs" align="center">
                {resultIcon(r.status)}
                <Text size="sm" style={{ flex: 1 }}>
                  {r.fileName}
                </Text>
                {r.status === UploadStatus.SUCCESS && (
                  <Badge color="green" size="sm">
                    {r.invoiceNumber}
                  </Badge>
                )}
                {r.status === UploadStatus.WARNING && (
                  <Badge color="orange" size="sm">
                    Sin asignar
                  </Badge>
                )}
                {r.status === UploadStatus.ERROR && (
                  <Text size="xs" c="red">
                    {r.error}
                  </Text>
                )}
              </Group>
            ))}
          </Stack>
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles.length || uploadMutation.isPending}
            loading={uploadMutation.isPending}
          >
            Cargar {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
