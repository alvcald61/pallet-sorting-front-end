"use client";

import { CreateDocumentRequest, DocumentConfig } from "@/lib/types/documentType";
import { Button, TextInput, Modal, Stack, Group, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";

interface DocumentFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDocumentRequest) => Promise<void>;
  document?: DocumentConfig | null;
  isLoading?: boolean;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  opened,
  onClose,
  onSubmit,
  document,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      documentName: "",
      storagePath: "",
      required: false,
    },
    validate: {
      documentName: (value) =>
        value.trim().length === 0 ? "El nombre es requerido" : null,
      storagePath: (value) =>
        value.trim().length === 0 ? "La ruta de almacenamiento es requerida" : null,
    },
  });

  useEffect(() => {
    if (document) {
      form.setValues({
        documentName: document.documentName,
        storagePath: document.storagePath,
        required: document.required,
      });
    } else {
      form.reset();
    }
  }, [document, opened]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      console.log(values);
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={document ? "Actualizar Documento" : "Crear Nuevo Documento"}
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nombre"
            placeholder="Nombre del documento"
            {...form.getInputProps("documentName")}
            disabled={isLoading}
          />
          <TextInput
            label="Ruta de Almacenamiento"
            placeholder="/documentos/tipo"
            {...form.getInputProps("storagePath")}
            disabled={isLoading}
          />
          <Checkbox
            label="Es obligatorio"
            {...form.getInputProps("required")}
            disabled={isLoading}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {document ? "Actualizar" : "Crear"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
