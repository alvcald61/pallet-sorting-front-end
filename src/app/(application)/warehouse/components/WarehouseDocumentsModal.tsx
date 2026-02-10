"use client";

import {
  WarehouseDocument,
  UpdateWarehouseDocumentsRequest,
} from "@/lib/types/documentType";
import { getDocuments, getWarehouseDocuments, updateWarehouseDocuments } from "@/lib/api/document/documentApi";
import {
  Button,
  Modal,
  Stack,
  Group,
  Checkbox,
  Text,
  Loader,
  Badge,
  Table,
} from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";

interface WarehouseDocumentsModalProps {
  opened: boolean;
  onClose: () => void;
  warehouseId: number;
  warehouseName: string;
}

interface DocumentAssociation {
  documentId: number;
  documentName: string;
  storagePath: string;
  isAssociated: boolean;
  isRequired: boolean;
}

export const WarehouseDocumentsModal: React.FC<WarehouseDocumentsModalProps> = ({
  opened,
  onClose,
  warehouseId,
  warehouseName,
}) => {
  const queryClient = useQueryClient();
  const [associations, setAssociations] = useState<DocumentAssociation[]>([]);

  // Fetch all documents
  const { data: documentsData, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
    enabled: opened,
  });

  // Fetch warehouse documents
  const { data: warehouseDocsData, isLoading: isLoadingWarehouseDocs } = useQuery({
    queryKey: ["warehouseDocuments", warehouseId],
    queryFn: () => getWarehouseDocuments(String(warehouseId)),
    enabled: opened && warehouseId > 0,
  });

  // Build associations when data loads
  useEffect(() => {
    if (documentsData?.data && warehouseDocsData?.data) {
      const warehouseDocsMap = new Map(
        warehouseDocsData.data.map((wd) => [wd.documentId, wd])
      );

      const newAssociations: DocumentAssociation[] = documentsData.data.map((doc) => {
        const warehouseDoc = warehouseDocsMap.get(doc.documentId);
        return {
          documentId: doc.documentId,
          documentName: doc.documentName,
          storagePath: doc.storagePath,
          isAssociated: !!warehouseDoc,
          isRequired: warehouseDoc?.isRequired ?? false,
        };
      });

      setAssociations(newAssociations);
    }
  }, [documentsData, warehouseDocsData]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateWarehouseDocumentsRequest) =>
      updateWarehouseDocuments(String(warehouseId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouseDocuments", warehouseId] });
      notifications.show({
        color: "green",
        title: "Éxito",
        message: "Documentos del almacén actualizados correctamente",
      });
      onClose();
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al actualizar documentos: ${error.message}`,
      });
    },
  });

  const handleAssociationChange = (documentId: number, isAssociated: boolean) => {
    setAssociations((prev) =>
      prev.map((assoc) =>
        assoc.documentId === documentId
          ? { ...assoc, isAssociated, isRequired: isAssociated ? assoc.isRequired : false }
          : assoc
      )
    );
  };

  const handleRequiredChange = (documentId: number, isRequired: boolean) => {
    setAssociations((prev) =>
      prev.map((assoc) =>
        assoc.documentId === documentId ? { ...assoc, isRequired } : assoc
      )
    );
  };

  const handleSave = () => {
    const documents = associations
      .filter((assoc) => assoc.isAssociated)
      .map((assoc) => ({
        documentId: assoc.documentId,
        isRequired: assoc.isRequired,
      }));

    updateMutation.mutate({ documents });
  };

  const isLoading = isLoadingDocuments || isLoadingWarehouseDocs;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Documentos de ${warehouseName}`}
      centered
      size="lg"
    >
      <Stack gap="md">
        {isLoading ? (
          <Group justify="center" p="xl">
            <Loader size="md" />
          </Group>
        ) : associations.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay documentos disponibles. Crea documentos primero en la página de configuración de documentos.
          </Text>
        ) : (
          <>
            <Text size="sm" c="dimmed">
              Selecciona los documentos que deben estar asociados a este almacén y marca cuáles son requeridos.
            </Text>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Asociado</Table.Th>
                  <Table.Th>Documento</Table.Th>
                  <Table.Th>Ruta</Table.Th>
                  <Table.Th>Requerido</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {associations.map((assoc) => (
                  <Table.Tr key={assoc.documentId}>
                    <Table.Td>
                      <Checkbox
                        checked={assoc.isAssociated}
                        onChange={(e) =>
                          handleAssociationChange(assoc.documentId, e.currentTarget.checked)
                        }
                        disabled={updateMutation.isPending}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{assoc.documentName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {assoc.storagePath}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Checkbox
                        checked={assoc.isRequired}
                        onChange={(e) =>
                          handleRequiredChange(assoc.documentId, e.currentTarget.checked)
                        }
                        disabled={!assoc.isAssociated || updateMutation.isPending}
                      />
                      {assoc.isRequired && (
                        <Badge size="xs" color="red" ml="xs">
                          Requerido
                        </Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={updateMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            loading={updateMutation.isPending}
            disabled={isLoading || associations.length === 0}
          >
            Guardar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
