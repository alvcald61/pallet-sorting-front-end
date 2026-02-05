"use client";

import React from "react";
import { OrderStatus } from "@/lib/utils/enums";
import {
  IconCancel,
  IconCheck,
  IconPackageExport,
  IconPencilCheck,
  IconSearch,
  IconTruck,
} from "@tabler/icons-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  variant?: "badge" | "banner";
}

/**
 * Get color and icon for each order status
 */
function getStatusConfig(status: OrderStatus) {
  const configs: Record<
    OrderStatus,
    {
      color: string;
      bgColor: string;
      borderColor: string;
      icon: any;
      description: string;
    }
  > = {
    [OrderStatus.REVIEW]: {
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: <IconSearch />,
      description: "En revisión - Esperando aprobación",
    },
    [OrderStatus.PRE_APPROVED]: {
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: <IconPencilCheck />,
      description: "Pre-aprobado - Esperando confirmación",
    },
    [OrderStatus.APPROVED]: {
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: <IconCheck />,
      description: "Aprobado - Listo para transporte",
    },
    [OrderStatus.IN_PROGRESS]: {
      color: "text-cyan-700",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      icon: <IconTruck />,
      description: "En camino - Transporte en progreso",
    },
    [OrderStatus.DELIVERED]: {
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: <IconPackageExport />,
      description: "Entregado - Orden completada",
    },
    [OrderStatus.DENIED]: {
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: <IconCancel />,
      description: "Denegado - Orden rechazada",
    },
  };

  return configs[status];
}

export default function OrderStatusBadge({
  status,
  variant = "badge",
}: OrderStatusBadgeProps) {
  const config = getStatusConfig(status);

  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color} ${config.bgColor} border ${config.borderColor}`}
      >
        <span className="material-symbols-outlined text-base">
          {config.icon}
        </span>
        {status}
      </span>
    );
  }

  // Banner variant - more prominent display
  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor}`}
      style={{ borderLeftColor: config.color }}
    >
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined text-2xl ${config.color}`}>
          {config.icon}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${config.color}`}>{status}</p>
          <p className="text-xs text-gray-600 mt-1">{config.description}</p>
        </div>
      </div>
    </div>
  );
}
