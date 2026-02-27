"use client";

import React, { useState } from "react";
import { Button, Modal, Group, Alert, Textarea } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { OrderStatus } from "@/lib/utils/enums";
import { Document } from "@/lib/types/orderTypes";
import { TransportStatus } from "@/lib/types/transportTypes";
import { useQuickStatusUpdate } from "@/lib/hooks/useOrder";

interface InitiateRouteButtonProps {
  orderId: string;
  orderStatus: OrderStatus;
  isDocumentPending: boolean;
  documents: Document[];
  currentTransportStatus?: TransportStatus;
}

export default function InitiateRouteButton({
  orderId,
  orderStatus,
  isDocumentPending,
  documents,
  currentTransportStatus,
}: InitiateRouteButtonProps) {
  const isDriver = useCanAccess(["DRIVER"], undefined, false);
  const router = useRouter();
  const quickStatusUpdate = useQuickStatusUpdate();

  const [showModal, setShowModal] = useState(false);
  const [observations, setObservations] = useState("");

  // El conductor solo puede iniciar la ruta si:
  // 1. Es conductor (rol DRIVER)
  // 2. La orden está aprobada
  // 3. No hay documentos pendientes
  // 4. El transporte aún no ha sido iniciado (status no asignado o pending)
  const canInitiateRoute =
    isDriver &&
    orderStatus === OrderStatus.APPROVED &&
    !isDocumentPending &&
    (!currentTransportStatus ||
      currentTransportStatus === TransportStatus.TRUCK_ASSIGNED);

  // Determinar si hay documentos pendientes no cargados
  const pendingDocuments =
    documents?.filter(
      (doc) => doc.required && (!doc.link || doc.link === ""),
    ) || [];
  const hasPendingDocuments = pendingDocuments.length > 0;

  const handleCloseModal = () => {
    setShowModal(false);
    setObservations("");
  };

  const handleInitiateRoute = () => {
    quickStatusUpdate.mutate(
      { orderId, status: TransportStatus.EN_ROUTE_TO_WAREHOUSE, notes: observations.trim() || undefined },
      {
        onSuccess: () => {
          handleCloseModal();
          router.refresh();
        },
      },
    );
  };

  // No mostrar nada si no es conductor
  if (!isDriver) {
    return null;
  }

  // No mostrar si la ruta ya ha sido iniciada
  if (
    currentTransportStatus &&
    currentTransportStatus !== TransportStatus.TRUCK_ASSIGNED
  ) {
    return null;
  }

  return (
    <>
      {hasPendingDocuments && (
        <Alert color="yellow" title="Documentos Pendientes" mb="md">
          No puedes iniciar la ruta hasta cargar todos los documentos
          requeridos. Documentos faltantes:{" "}
          {pendingDocuments.map((d) => d.documentName).join(", ")}
        </Alert>
      )}

      <Button
        onClick={() => setShowModal(true)}
        loading={quickStatusUpdate.isPending}
        disabled={!canInitiateRoute || hasPendingDocuments}
        size="md"
        variant="filled"
        color={canInitiateRoute && !hasPendingDocuments ? "green" : "gray"}
      >
        Iniciar Ruta
      </Button>

      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title="Iniciar Ruta"
        centered
      >
        <div className="space-y-4">
          <p>¿Estás seguro de que deseas iniciar esta ruta?</p>
          <Textarea
            label="Observaciones"
            placeholder="Agrega una observación opcional al iniciar la ruta..."
            value={observations}
            onChange={(e) => setObservations(e.currentTarget.value)}
            maxLength={500}
            autosize
            minRows={2}
            maxRows={4}
            description={`${observations.length}/500 caracteres`}
          />
          <Group justify="flex-end" mt="lg">
            <Button
              variant="default"
              onClick={handleCloseModal}
              disabled={quickStatusUpdate.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInitiateRoute}
              loading={quickStatusUpdate.isPending}
              color="green"
            >
              Iniciar Ruta
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
}
