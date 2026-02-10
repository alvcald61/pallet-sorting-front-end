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
import { DataTable } from "mantine-datatable";
import React from "react";
import { DocumentForm } from "./components/DocumentForm";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useCRUDWithQuery } from "@/lib/hooks/useCRUDWithQuery";
import { useFormModal } from "@/lib/hooks/useFormModal";
import { useDataTable } from "@/lib/hooks/useDataTable";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { ROLES } from "@/lib/const/rbac";

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

  // Use data table hook for pagination
  const table = useDataTable(documents.items, { pageSize: PAGE_SIZE });

  const handleFormSubmit = async (data: any) => {
    if (formModal.selected) {
      await documents.update(formModal.selected.documentId, data);
    } else {
      console.log(data);
      await documents.create(data);
    }
    formModal.close();
  };

  return (
    <ProtectedPage requiredRoles={[ROLES.ADMIN]}>
      <div className="flex flex-col justify-start w-full grow p-10">
        <Breadcrumbs className="mb-4">
          <Anchor href="/">Dashboard</Anchor>
          <span>Documentos</span>
        </Breadcrumbs>
        <div className="flex justify-between">
          <Title order={2}>Configuración de Documentos</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={formModal.openCreate}
            disabled={documents.isCreating}
          >
            Crear Documento
          </Button>
        </div>

        <div className="mt-8">
          <DataTable
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            records={table.paginatedData}
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
            idAccessor="documentId"
            page={table.page}
            onPageChange={table.setPage}
            fetching={documents.loading}
            totalRecords={table.totalRecords}
            recordsPerPage={table.pageSize}
            height={500}
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
