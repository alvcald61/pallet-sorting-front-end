"use client";

import React, { useState } from "react";
import { Button, Modal, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { TransportStatus } from "@/lib/types/transportTypes";
import { TransportHistoryEntry } from "@/lib/api/transport/transportApi";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { useQuickStatusUpdate } from "@/lib/hooks/useOrder";
import {
  IconTruck,
  IconPackageExport,
  IconHome,
  IconCheck,
  IconAlertCircle,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";

interface DeliveryStatusTimelineProps {
  orderId: string;
  history: TransportHistoryEntry[];
  currentStatus: TransportStatus;
}

/**
 * Get display info for each transport status
 */
function getStatusInfo(status: TransportStatus) {
  const configs: Record<
    TransportStatus,
    {
      label: string;
      description: string;
      icon: React.ReactNode;
      color: string;
    }
  > = {
    [TransportStatus.PENDING]: {
      label: "Pendiente",
      description: "Esperando asignación",
      icon: <IconClock className="w-5 h-5" />,
      color: "bg-gray-100 text-gray-700",
    },
    [TransportStatus.TRUCK_ASSIGNED]: {
      label: "Camión Asignado",
      description: "Transporte disponible",
      icon: <IconTruck className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-700",
    },
    [TransportStatus.EN_ROUTE_TO_WAREHOUSE]: {
      label: "En Ruta al Almacén",
      description: "Dirigiéndose al punto de recogida",
      icon: <IconTruck className="w-5 h-5" />,
      color: "bg-cyan-100 text-cyan-700",
    },
    [TransportStatus.ARRIVED_AT_WAREHOUSE]: {
      label: "Llegó al Almacén",
      description: "En el punto de recogida",
      icon: <IconHome className="w-5 h-5" />,
      color: "bg-emerald-100 text-emerald-700",
    },
    [TransportStatus.LOADING]: {
      label: "Cargando",
      description: "Proceso de carga en curso",
      icon: <IconPackageExport className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-700",
    },
    [TransportStatus.LOADING_COMPLETED]: {
      label: "Carga Completada",
      description: "Carga finalizada",
      icon: <IconCheck className="w-5 h-5" />,
      color: "bg-green-100 text-green-700",
    },
    [TransportStatus.EN_ROUTE_TO_DESTINATION]: {
      label: "En Ruta al Destino",
      description: "Dirigiéndose al destino",
      icon: <IconTruck className="w-5 h-5" />,
      color: "bg-cyan-100 text-cyan-700",
    },
    [TransportStatus.ARRIVED_AT_DESTINATION]: {
      label: "Llegó al Destino",
      description: "En el punto de entrega",
      icon: <IconHome className="w-5 h-5" />,
      color: "bg-emerald-100 text-emerald-700",
    },
    [TransportStatus.UNLOADING]: {
      label: "Descargando",
      description: "Proceso de descarga en curso",
      icon: <IconPackageExport className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-700",
    },
    [TransportStatus.UNLOADING_COMPLETED]: {
      label: "Descarga Completada",
      description: "Descarga finalizada",
      icon: <IconCheck className="w-5 h-5" />,
      color: "bg-green-100 text-green-700",
    },
    [TransportStatus.DELIVERED]: {
      label: "Entregado",
      description: "Orden completada",
      icon: <IconCheck className="w-5 h-5" />,
      color: "bg-emerald-100 text-emerald-700",
    },
  };

  return (
    configs[status] || {
      label: status,
      description: "Estado desconocido",
      icon: <IconAlertCircle className="w-5 h-5" />,
      color: "bg-gray-100 text-gray-700",
    }
  );
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) {
    return (
      "Ayer " +
      date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TRANSPORT_FLOW: TransportStatus[] = [
  TransportStatus.PENDING,
  TransportStatus.EN_ROUTE_TO_WAREHOUSE,
  TransportStatus.ARRIVED_AT_WAREHOUSE,
  TransportStatus.LOADING,
  TransportStatus.LOADING_COMPLETED,
  TransportStatus.EN_ROUTE_TO_DESTINATION,
  TransportStatus.ARRIVED_AT_DESTINATION,
  TransportStatus.UNLOADING,
  TransportStatus.UNLOADING_COMPLETED,
  TransportStatus.DELIVERED,
];

function getNextStatus(current: TransportStatus): TransportStatus | null {
  const idx = TRANSPORT_FLOW.indexOf(current);
  if (idx === -1 || idx === TRANSPORT_FLOW.length - 1) return null;
  return TRANSPORT_FLOW[idx + 1];
}

export default function DeliveryStatusTimeline({
  orderId,
  history,
  currentStatus,
}: DeliveryStatusTimelineProps) {
  const isDriver = useCanAccess(["DRIVER"], undefined, false);
  const router = useRouter();
  const quickStatusUpdate = useQuickStatusUpdate();
  const [showModal, setShowModal] = useState(false);

  const nextStatus = getNextStatus(currentStatus);
  const nextStatusInfo = nextStatus ? getStatusInfo(nextStatus) : null;

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    quickStatusUpdate.mutate(
      { orderId, status: nextStatus },
      {
        onSuccess: () => {
          setShowModal(false);
          router.refresh();
        },
      },
    );
  };

  // Sort history by timestamp descending (most recent first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  if (history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estado de Entrega
        </h3>
        <p className="text-gray-500 text-center py-8">
          Sin historial de transporte disponible
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Estado de Entrega
        </h3>
        {isDriver && nextStatus && (
          <Button
            onClick={() => setShowModal(true)}
            loading={quickStatusUpdate.isPending}
            size="sm"
            variant="filled"
            color="blue"
          >
            Continuar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {sortedHistory.map((entry, index) => {
          const info = getStatusInfo(entry.status);
          const isLatest = index === 0;

          return (
            <div key={entry.id} className="relative">
              {/* Timeline line */}
              {index < sortedHistory.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-200"></div>
              )}

              {/* Status entry */}
              <div className="flex gap-4">
                {/* Icon circle */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${info.color} relative z-10 ${isLatest ? "ring-4 ring-offset-2 ring-blue-300" : ""}`}
                >
                  {info.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {info.label}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {info.description}
                      </p>
                    </div>
                    {isLatest && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Actual
                      </span>
                    )}
                  </div>

                  {/* Timestamp and details */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      {formatDate(entry.timestamp)}
                    </p>
                    {entry.updatedBy && (
                      <p className="text-xs text-gray-500">
                        Por: {entry.updatedBy}
                      </p>
                    )}
                    {entry.locationAddress && (
                      <div className="flex items-start gap-1.5 mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <IconMapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{entry.locationAddress}</span>
                      </div>
                    )}
                    {entry.notes && (
                      <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded italic">
                        Nota: {entry.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-3">
          Estados posibles de la entrega:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            Pendiente
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            Camión Asignado
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
            En Ruta
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-300"></span>
            Completado
          </span>
        </div>
      </div>

      {/* Confirmation modal */}
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Confirmar Cambio de Estado"
        centered
      >
        <div className="space-y-4">
          <p>
            ¿Deseas cambiar el estado a <strong>{nextStatusInfo?.label}</strong>
            ?
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
