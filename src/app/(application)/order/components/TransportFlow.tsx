"use client";

import React, { useState } from "react";
import { Button, Modal, Group, Alert } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { TransportStatus } from "@/lib/types/transportTypes";
import { useQuickStatusUpdate } from "@/lib/hooks/useOrder";

interface TransportFlowProps {
  orderId: string;
  currentTransportStatus?: TransportStatus;
  onStatusUpdate?: () => void;
}

const TRANSPORT_FLOW = [
  { status: TransportStatus.TRUCK_ASSIGNED, label: "Camión Asignado" },
  {
    status: TransportStatus.EN_ROUTE_TO_WAREHOUSE,
    label: "En Ruta al Almacén",
  },
  {
    status: TransportStatus.ARRIVED_AT_WAREHOUSE,
    label: "Llegó al Almacén",
  },
  { status: TransportStatus.LOADING, label: "Cargando" },
  { status: TransportStatus.LOADING_COMPLETED, label: "Carga Completada" },
  {
    status: TransportStatus.EN_ROUTE_TO_DESTINATION,
    label: "En Ruta al Destino",
  },
  {
    status: TransportStatus.ARRIVED_AT_DESTINATION,
    label: "Llegó al Destino",
  },
  { status: TransportStatus.UNLOADING, label: "Descargando" },
  {
    status: TransportStatus.UNLOADING_COMPLETED,
    label: "Descarga Completada",
  },
  { status: TransportStatus.DELIVERED, label: "Entregado" },
];

const getStatusDescription = (status: TransportStatus): string => {
  const descriptions: Record<TransportStatus, string> = {
    [TransportStatus.PENDING]: "En espera",
    [TransportStatus.TRUCK_ASSIGNED]: "Camión ha sido asignado",
    [TransportStatus.EN_ROUTE_TO_WAREHOUSE]:
      "Camión está en ruta hacia el almacén",
    [TransportStatus.ARRIVED_AT_WAREHOUSE]: "Camión llegó al almacén",
    [TransportStatus.LOADING]: "Carga en progreso",
    [TransportStatus.LOADING_COMPLETED]: "Carga completada",
    [TransportStatus.EN_ROUTE_TO_DESTINATION]:
      "Camión está en ruta hacia el destino",
    [TransportStatus.ARRIVED_AT_DESTINATION]: "Camión llegó al destino",
    [TransportStatus.UNLOADING]: "Descarga en progreso",
    [TransportStatus.UNLOADING_COMPLETED]: "Descarga completada",
    [TransportStatus.DELIVERED]: "Entregado al cliente",
  };
  return descriptions[status] || "Estado desconocido";
};

const getNextStatus = (
  currentStatus?: TransportStatus,
): TransportStatus | null => {
  // Si no hay status o es PENDING, el siguiente es TRUCK_ASSIGNED
  if (!currentStatus || currentStatus === TransportStatus.PENDING) {
    return TransportStatus.TRUCK_ASSIGNED;
  }

  const currentIndex = TRANSPORT_FLOW.findIndex(
    (item) => item.status === currentStatus,
  );

  if (currentIndex === -1 || currentIndex === TRANSPORT_FLOW.length - 1) {
    return null;
  }

  return TRANSPORT_FLOW[currentIndex + 1].status;
};

const getCurrentStepIndex = (status?: TransportStatus): number => {
  return TRANSPORT_FLOW.findIndex((item) => item.status === status) ?? -1;
};

export default function TransportFlow({
  orderId,
  currentTransportStatus,
  onStatusUpdate,
}: TransportFlowProps) {
  const isDriver = useCanAccess(["DRIVER"], undefined, false);
  const router = useRouter();
  const quickStatusUpdate = useQuickStatusUpdate();

  const [showModal, setShowModal] = useState(false);

  const currentStepIndex = getCurrentStepIndex(currentTransportStatus);
  const nextStatus = getNextStatus(currentTransportStatus);
  const canAdvanceStatus = isDriver && nextStatus !== null;

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    quickStatusUpdate.mutate(
      { orderId, status: nextStatus },
      {
        onSuccess: () => {
          setShowModal(false);
          onStatusUpdate?.();
          router.refresh();
        },
      },
    );
  };

  const nextStepLabel = nextStatus
    ? TRANSPORT_FLOW.find((item) => item.status === nextStatus)?.label
    : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Estado del Transporte
          </h3>
          <p className="text-sm text-gray-600">
            {getStatusDescription(
              currentTransportStatus || TransportStatus.PENDING,
            )}
          </p>
        </div>
        {isDriver && canAdvanceStatus && (
          <Button
            onClick={() => setShowModal(true)}
            loading={quickStatusUpdate.isPending}
            size="md"
            variant="filled"
            color="blue"
          >
            Continuar
          </Button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {TRANSPORT_FLOW.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex items-start relative">
                <div
                  className={`z-10 flex-shrink-0 size-6 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                    isCompleted
                      ? isCurrent
                        ? "bg-blue-600"
                        : "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    isCurrent ? (
                      <span className="material-symbols-outlined text-sm">
                        radio_button_checked
                      </span>
                    ) : (
                      "✓"
                    )
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className="ml-4">
                  <p
                    className={`font-semibold ${
                      isCompleted
                        ? isCurrent
                          ? "text-blue-600"
                          : "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Confirmar Cambio de Estado"
        centered
      >
        <div className="space-y-4">
          <p>
            ¿Deseas cambiar el estado a <strong>{nextStepLabel}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            Esta acción registrará el nuevo estado en el sistema.
          </p>
          <Group justify="flex-end" mt="lg">
            <Button
              variant="default"
              onClick={() => setShowModal(false)}
              disabled={quickStatusUpdate.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAdvanceStatus}
              loading={quickStatusUpdate.isPending}
              color="blue"
            >
              Confirmar
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}
