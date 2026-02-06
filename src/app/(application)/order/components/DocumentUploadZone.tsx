"use client";

import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import {
  Group,
  Text,
  Stack,
  Badge,
  Button,
  Alert,
  Progress,
} from "@mantine/core";
import { Document } from "@/lib/types/orderTypes";
import { uploadOrderDocument } from "@/lib/api/order/orderActions";
import { useCanAccess } from "@/lib/utils/rbacUtils";

interface DocumentUploadZoneProps {
  orderId: string;
  documents: Document[];
  requiredDocuments?: string[];
  onUploadComplete?: () => void;
}

export default function DocumentUploadZone({
  orderId,
  documents,
  requiredDocuments = [],
  onUploadComplete,
}: DocumentUploadZoneProps) {
  const isClient = useCanAccess(
      ["CLIENT"]
      // [PERMISSIONS.ORDER.CREATE],
      // false // requireAll = false (tiene almenos uno)
    );
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File }>(
    {},
  );
  const [documentLinks, setDocumentLinks] = useState<{ [key: number]: string }>(
    {},
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleDrop = async (files: File[], documentId: number) => {
    setError(null);
    setSuccess(null);

    if (files.length === 0) return;

    const file = files[0];
    setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));

    try {
      // Simular progreso de carga
      setUploadProgress((prev) => ({ ...prev, [documentId]: 30 }));

      // const result = await uploadOrderDocument({orderId, documentId, file});

      // // Capturar el link del response (viene en el campo mensaje)
      // if (result && result.mensaje) {
      //   setDocumentLinks((prev) => ({ ...prev, [documentId]: result.mensaje }));
      // }

      setUploadProgress((prev) => ({ ...prev, [documentId]: 100 }));
      setUploadedFiles((prev) => ({ ...prev, [documentId]: file }));
      setSuccess(`${file.name} subido exitosamente`);

      setTimeout(() => {
        setUploadProgress((prev) => {
          const { [documentId]: _, ...rest } = prev;
          return rest;
        });
        setSuccess(null);
      }, 2000);

      onUploadComplete?.();
    } catch (err) {
      setError(
        `Error al subir ${file.name}: ${err instanceof Error ? err.message : "Error desconocido"}`,
      );
      setUploadProgress((prev) => {
        const { [documentId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSendDocuments = async () => {
    if (Object.keys(uploadedFiles).length === 0) {
      setError("Por favor, carga al menos un documento antes de enviar");
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      // Enviar todos los documentos al servidor
      const uploadPromises = Object.entries(uploadedFiles).map(
        async ([documentId, file]) => {
          const result = await uploadOrderDocument({orderId, documentId: parseInt(documentId), file});
          // Capturar el link del response
          if (result && result.mensaje) {
            setDocumentLinks((prev) => ({
              ...prev,
              [parseInt(documentId)]: result.mensaje,
            }));
          }
          return result;
        },
      );

      await Promise.all(uploadPromises);

      setSuccess("¡Todos los documentos han sido guardados exitosamente!");

      setTimeout(() => {
        setSuccess(null);
        onUploadComplete?.();
      }, 2000);
    } catch (err) {
      setError(
        `Error al guardar documentos: ${err instanceof Error ? err.message : "Error desconocido"}`,
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Stack gap="lg">
      {/* Alerts - solo visibles para CLIENT que puede subir */}
      {isClient && error && (
        <Alert color="red" title="Error">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 underline text-sm"
          >
            Cerrar
          </button>
        </Alert>
      )}
      {isClient && success && (
        <Alert color="green" title="Éxito">
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="ml-4 underline text-sm"
          >
            Cerrar
          </button>
        </Alert>
      )}

      {/* Lista de documentos - visible para TODOS */}
      <div className="space-y-4">
        {documents.map((doc) => {
          const hasLink = documentLinks[doc.documentId] || doc.link;
          const hasUploadedFile = uploadedFiles[doc.documentId];
          const isUploading = uploadProgress[doc.documentId] !== undefined;

          return (
            <div
              key={doc.documentId}
              className="border rounded-lg p-4 bg-gray-50"
            >
              {/* Header: Nombre y estado - visible para TODOS */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Text fw={500} size="sm">
                    {doc.documentName}
                  </Text>
                  {doc.required ? (
                    <Badge size="sm" color="red">
                      Requerido
                    </Badge>
                  ) : (
                    <Badge size="sm" color="gray" variant="outline">
                      Opcional
                    </Badge>
                  )}
                </div>
                <Badge color={hasLink ? "green" : "yellow"} variant="light">
                  {hasLink ? "Completado" : "Pendiente"}
                </Badge>
              </div>

              {/* Progress bar - solo para CLIENT subiendo */}
              {isClient && isUploading && (
                <div className="mb-3">
                  <Progress
                    value={uploadProgress[doc.documentId]}
                    size="sm"
                    color="blue"
                  />
                </div>
              )}

              {/* Documento subido con link - visible para TODOS */}
              {hasLink ? (
                <div className="bg-white p-3 rounded border border-green-200">
                  <div>
                    <Text size="sm" fw={500} c="green">
                      ✓ Archivo guardado
                    </Text>
                    <Text size="xs" c="blue" className="truncate max-w-full">
                      <a
                        href={documentLinks[doc.documentId] || doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-700 break-all"
                      >
                        Ver documento
                      </a>
                    </Text>
                  </div>
                </div>
              ) : hasUploadedFile && isClient ? (
                /* Archivo cargado localmente pero no enviado - solo CLIENT */
                <div className="bg-white p-3 rounded border border-blue-200">
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" fw={500} c="blue">
                        📎 {uploadedFiles[doc.documentId].name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {(
                          uploadedFiles[doc.documentId].size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB - Listo para enviar
                      </Text>
                    </div>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        setUploadedFiles((prev) => {
                          const { [doc.documentId]: _, ...rest } = prev;
                          return rest;
                        });
                      }}
                    >
                      Cambiar
                    </Button>
                  </Group>
                </div>
              ) : isClient ? (
                /* Dropzone - solo para CLIENT */
                <Dropzone
                  onDrop={(files) => handleDrop(files, doc.documentId)}
                  accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
                  multiple={false}
                  maxSize={50 * 1024 * 1024}
                  disabled={isUploading}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={100}
                    style={{ pointerEvents: "none" }}
                  >
                    <Stack gap={0} align="center">
                      <Text size="sm" fw={500}>
                        Arrastra el archivo aquí o haz clic para seleccionar
                      </Text>
                      <Text size="xs" c="dimmed">
                        PDF o Imagen (máx. 50MB)
                      </Text>
                    </Stack>
                  </Group>
                </Dropzone>
              ) : (
                /* Placeholder para usuarios no-CLIENT */
                <div className="bg-white p-3 rounded border border-gray-300">
                  <Text size="sm" c="dimmed" ta="center">
                    Esperando que el cliente suba el documento
                  </Text>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón de enviar - solo para CLIENT */}
      {isClient && (
        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={handleSendDocuments}
            loading={isSending}
            disabled={Object.keys(uploadedFiles).length === 0}
            size="md"
            color="green"
          >
            Enviar Documentos
          </Button>
        </div>
      )}
    </Stack>
  );
}
