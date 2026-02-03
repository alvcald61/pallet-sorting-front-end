"use client";

import React, { useState } from "react";
import { Button, Modal, Group, Alert } from "@mantine/core";
import { continueOrder } from "@/lib/api/order/orderApi";
import { useRouter } from "next/navigation";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { OrderStatus } from "@/lib/utils/enums";
import { Document } from "@/lib/types/orderTypes";
import { quickStatusUpdate } from "@/lib/api/transport/transportApi";
import { TransportStatus } from "@/lib/types/trnasportTypes";

interface InitiateRouteButtonProps {
  orderId: string;
  orderStatus: OrderStatus;
  isDocumentPending: boolean;
  documents: Document[];
}

export default function InitiateRouteButton({
  orderId,
  orderStatus,
  isDocumentPending,
  documents,
}: InitiateRouteButtonProps) {
  const isDriver = useCanAccess(["DRIVER"], undefined, false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // El conductor solo puede iniciar la ruta si:
  // 1. Es conductor (rol DRIVER)
  // 2. La orden está aprobada
  // 3. No hay documentos pendientes
  const canInitiateRoute =
    isDriver && orderStatus === OrderStatus.APPROVED && !isDocumentPending;

  // Determinar si hay documentos pendientes no cargados
  const pendingDocuments =
    documents?.filter(
      (doc) => doc.required && (!doc.link || doc.link === ""),
    ) || [];
  const hasPendingDocuments = pendingDocuments.length > 0;

  const handleInitiateRoute = async () => {
    try {
      setIsLoading(true);
      // Llamar a continueOrder sin amount, gpsLink y con deny=false
      // await continueOrder({orderId, deny: false});
      await quickStatusUpdate(orderId, TransportStatus.EN_ROUTE_TO_WAREHOUSE);
      setShowModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error iniciando ruta:", error);
      alert("Error al iniciar la ruta. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // No mostrar nada si no es conductor
  if (!isDriver) {
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
        loading={isLoading}
        disabled={!canInitiateRoute || hasPendingDocuments}
        size="md"
        variant="filled"
        color={canInitiateRoute && !hasPendingDocuments ? "green" : "gray"}
      >
        Iniciar Ruta
      </Button>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Iniciar Ruta"
        centered
      >
        <div className="space-y-4">
          <p>¿Estás seguro de que deseas iniciar esta ruta?</p>
          <p className="text-sm text-gray-600">
            Una vez iniciada, la ruta será registrada en el sistema y los
            cambios serán permanentes.
          </p>
          <Group justify="flex-end" mt="lg">
            <Button
              variant="default"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInitiateRoute}
              loading={isLoading}
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
