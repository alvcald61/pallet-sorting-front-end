"use client";

import { useState } from "react";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import {
  Group,
  Text,
  Stack,
  Button,
  Alert,
  Badge,
  Paper,
} from "@mantine/core";
import { IconUpload, IconFileTypePdf, IconDownload, IconX } from "@tabler/icons-react";
import { uploadSunatDocument } from "@/lib/api/order/orderActions";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { OrderStatus } from "@/lib/utils/enums";

interface SunatDocumentUploadProps {
  orderId: string;
  orderStatus: OrderStatus;
  existingDocumentPath?: string;
  onUploadComplete?: () => void;
}

const ALLOWED_STATUSES = [OrderStatus.PRE_APPROVED, OrderStatus.APPROVED];

export default function SunatDocumentUpload({
  orderId,
  orderStatus,
  existingDocumentPath,
  onUploadComplete,
}: SunatDocumentUploadProps) {
  const isAdmin = useCanAccess(["ADMIN"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | undefined>(
    existingDocumentPath,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canUpload = isAdmin && ALLOWED_STATUSES.includes(orderStatus);
  const downloadUrl = `/api/order/${orderId}/sunat-document`;

  if (!isAdmin) return null;

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadSunatDocument({ orderId, file: selectedFile });
      setUploadedPath(result?.data ?? "uploaded");
      setSuccess("Documento SUNAT guardado correctamente");
      setSelectedFile(null);
      onUploadComplete?.();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        `Error al subir el documento: ${err instanceof Error ? err.message : "Error desconocido"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md" mb="md">
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={600} size="sm">
              Documento SUNAT
            </Text>
            <Text size="xs" c="dimmed">
              Solo PDF · Máximo 20MB
            </Text>
          </div>
          <Badge
            color={uploadedPath ? "green" : "orange"}
            variant="light"
            size="sm"
          >
            {uploadedPath ? "Subido" : "Pendiente"}
          </Badge>
        </Group>

        {/* Documento existente */}
        {uploadedPath && (
          <Group
            justify="space-between"
            p="xs"
            style={{
              background: "var(--mantine-color-green-0)",
              borderRadius: 8,
              border: "1px solid var(--mantine-color-green-3)",
            }}
          >
            <Group gap="xs">
              <IconFileTypePdf size={18} color="green" />
              <div>
                <Text size="sm" fw={500} c="green">
                  Documento SUNAT guardado
                </Text>
                <Text size="xs" c="dimmed">
                  Haz clic en Descargar para ver el archivo
                </Text>
              </div>
            </Group>
            <Button
              component="a"
              href={downloadUrl}
              target="_blank"
              size="xs"
              variant="light"
              color="green"
              leftSection={<IconDownload size={14} />}
            >
              Descargar
            </Button>
          </Group>
        )}

        {/* Zona de carga — solo si el admin puede subir */}
        {canUpload && (
          <>
            {selectedFile ? (
              <Group
                justify="space-between"
                p="xs"
                style={{
                  background: "var(--mantine-color-blue-0)",
                  borderRadius: 8,
                  border: "1px solid var(--mantine-color-blue-3)",
                }}
              >
                <Group gap="xs">
                  <IconFileTypePdf size={18} color="blue" />
                  <div>
                    <Text size="sm" fw={500} c="blue">
                      {selectedFile.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Listo para subir
                    </Text>
                  </div>
                </Group>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    leftSection={<IconX size={12} />}
                    onClick={() => setSelectedFile(null)}
                  >
                    Cambiar
                  </Button>
                  <Button
                    size="xs"
                    color="blue"
                    loading={isUploading}
                    leftSection={<IconUpload size={12} />}
                    onClick={handleUpload}
                  >
                    {uploadedPath ? "Reemplazar" : "Subir"}
                  </Button>
                </Group>
              </Group>
            ) : (
              <Dropzone
                onDrop={handleDrop}
                accept={PDF_MIME_TYPE}
                multiple={false}
                maxSize={20 * 1024 * 1024}
              >
                <Group
                  justify="center"
                  gap="sm"
                  mih={80}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={24} color="blue" />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={24} color="red" />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconFileTypePdf size={24} color="gray" />
                  </Dropzone.Idle>
                  <div>
                    <Text size="sm" fw={500} ta="center">
                      {uploadedPath
                        ? "Arrastra un nuevo PDF para reemplazar el documento actual"
                        : "Arrastra el documento SUNAT aquí o haz clic para seleccionar"}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      Solo PDF · Máx. 20MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
          </>
        )}

        {!canUpload && !uploadedPath && (
          <Text size="sm" c="dimmed" ta="center" py="xs">
            El documento SUNAT aún no ha sido subido
          </Text>
        )}

        {error && (
          <Alert color="red" title="Error" onClose={() => setError(null)} withCloseButton>
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="green" title="Éxito">
            {success}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
