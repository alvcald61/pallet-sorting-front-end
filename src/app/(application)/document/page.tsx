"use client";

import { DocumentConfig } from "@/lib/types/documentType";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "@/lib/api/document/documentApi";
import {
  Button,
  Group,
  ActionIcon,
  Title,
  Breadcrumbs,
  Anchor,
  Badge,
} from "@mantine/core";
import React from "react";
import { DocumentForm } from "./components/DocumentForm";
import { IconEdit, IconTrash, IconPlus, IconFile } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";
import { EnhancedDataTable } from "@/components/table/EnhancedDataTable";
import { modals } from "@mantine/modals";

const PAGE_SIZE = 15;

export default function DocumentPage() {
  // Use CRUD hook with React Query
  const documents = useCRUDWithQuery({
    queryKey: ["documents"],
    fetchFn: getDocuments,
    createFn: createDocument,
    updateFn: (id, data) => updateDocument(String(id), data),
    deleteFn: (id) => deleteDocument(String(id)),
    entityName: "Documento",
    getItemId: (document) => document.documentId,
    getItemDisplayName: (document) => document.documentName,
  });

  // Use form modal hook for modal state
  const formModal = useFormModal<DocumentConfig>();

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await documents.update(formModal.selected.documentId, data);
    } else {
      console.log(data);
      await documents.create(data);
    }
    formModal.close();
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedIds: Set<string | number>) => {
    const selectedDocuments = documents.items.filter(doc =>
      selectedIds.has(doc.documentId)
    );

    modals.openConfirmModal({
      title: 'Eliminar documentos',
      children: (
        <>
          ¿Estás seguro de que deseas eliminar {selectedDocuments.length} documento(s)?
          <br />
          Esta acción no se puede deshacer.
        </>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        for (const doc of selectedDocuments) {
          await documents.remove(doc);
        }
      },
    });
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
      <div className="flex flex-col justify-start w-full grow p-4 sm:p-10">
        <Breadcrumbs className="mb-4">
          <Anchor href="/">Dashboard</Anchor>
          <span>Documentos</span>
        </Breadcrumbs>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <Title order={2} className="text-xl sm:text-2xl">Configuración de Documentos</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={formModal.openCreate}
            disabled={documents.isCreating}
          >
            Crear Documento
          </Button>
        </div>

        <div className="mt-8">
          <EnhancedDataTable
            records={documents.items}
            columns={[
              {
                accessor: "documentName",
                title: "Nombre",
              },
              {
                accessor: "storagePath",
                title: "Ruta de Almacenamiento",
              },
              {
                accessor: "required",
                title: "Es obligatorio",
                render: (document) => (
                  <Badge size="xs" variant="light" color="blue">
                    {document.required ? "Sí" : "No"}
                  </Badge>
                ),
                sortable: false,
              },
              {
                accessor: "actions",
                title: "Acciones",
                render: (document) => (
                  <Group gap="xs">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => formModal.openEdit(document)}
                      disabled={documents.loading || documents.isUpdating}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => documents.remove(document)}
                      disabled={documents.loading || documents.isDeleting}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            loading={documents.loading}
            pageSize={PAGE_SIZE}
            searchable
            searchableFields={["documentName", "storagePath"]}
            searchPlaceholder="Buscar por nombre o ruta..."
            selectable
            getRecordId={(document) => document.documentId}
            bulkActions={[
              {
                label: "Eliminar seleccionados",
                icon: <IconTrash size={16} />,
                color: "red",
                onClick: handleBulkDelete,
              },
            ]}
            exportable
            exportFileName="documentos"
            emptyState={{
              title: "No hay documentos registrados",
              description: "Comienza creando tu primer documento para gestionar tu configuración.",
              icon: <IconFile size={64} stroke={1.5} style={{ opacity: 0.3 }} />,
              action: {
                label: "Crear primer documento",
                onClick: formModal.openCreate,
              },
            }}
          />
        </div>

        <DocumentForm
          opened={formModal.opened}
          onClose={formModal.close}
          onSubmit={handleFormSubmit}
          document={formModal.selected}
          isLoading={documents.isCreating || documents.isUpdating}
        />
      </div>
    </ProtectedPage>
  );
}
