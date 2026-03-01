import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  getOrdersByPage,
  getOrderStatus,
  getDistributionImg,
  continueOrder,
  createOrder,
  updateOrderStatus,
} from "@/lib/api/order/orderApi";
import { uploadOrderDocument } from "@/lib/api/order/orderActions";
import { quickStatusUpdate } from "@/lib/api/transport/transportApi";
import { notifications } from "@mantine/notifications";
import { OrderFilters } from "@/lib/types/orderFilterTypes";
import { TransportStatus } from "@/lib/types/transportTypes";

const TRANSPORT_STATUS_LABELS: Record<TransportStatus, string> = {
  [TransportStatus.PENDING]: "Pendiente",
  [TransportStatus.TRUCK_ASSIGNED]: "Camión Asignado",
  [TransportStatus.EN_ROUTE_TO_WAREHOUSE]: "En Ruta al Almacén",
  [TransportStatus.ARRIVED_AT_WAREHOUSE]: "Llegó al Almacén",
  [TransportStatus.LOADING]: "Cargando",
  [TransportStatus.LOADING_COMPLETED]: "Carga Completada",
  [TransportStatus.EN_ROUTE_TO_DESTINATION]: "En Ruta al Destino",
  [TransportStatus.ARRIVED_AT_DESTINATION]: "Llegó al Destino",
  [TransportStatus.UNLOADING]: "Descargando",
  [TransportStatus.UNLOADING_COMPLETED]: "Descarga Completada",
  [TransportStatus.DELIVERED]: "Entregado",
};

/**
 * React Query hooks for Order operations
 */

// Fetch orders with pagination and filters
export const useOrders = (
  page: number,
  pageSize: number,
  isAdmin: boolean,
  filters?: OrderFilters,
  sort?: string, // Spring Boot format: "field,direction" e.g. "amount,desc"
) => {
  if (!sort) sort = "id,asc"; // Default sorting by creation date descending
  return useQuery({
    queryKey: ["orders", page, isAdmin, filters, sort],
    queryFn: () => getOrdersByPage({ page, pageSize, isAdmin, filters, sort }),
    staleTime: 2 * 60 * 1000, // 2 minutes - orders change frequently
  });
};

// Fetch single order by ID
export const useOrder = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch order status
export const useOrderStatus = (id: string) => {
  return useQuery({
    queryKey: ["order-status", id],
    queryFn: () => getOrderStatus(id),
    enabled: !!id,
    refetchInterval: 10000, // Poll every 10 seconds for status updates
    staleTime: 5000, // Consider stale after 5 seconds
  });
};

// Fetch distribution image
export const useDistributionImage = (id: string) => {
  return useQuery({
    queryKey: ["distribution-image", id],
    queryFn: () => getDistributionImg(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - images don't change
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      notifications.show({
        color: "green",
        title: "Éxito",
        message: "Orden creada correctamente",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al crear orden: ${error.message}`,
      });
    },
  });
};

// Continue order mutation
export const useContinueOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: continueOrder,
    onSuccess: (_, variables) => {
      // Invalidate both the specific order and the orders list
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({
        queryKey: ["order-status", variables.orderId],
      });

      notifications.show({
        color: "green",
        title: "Éxito",
        message: "Orden actualizada correctamente",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al actualizar orden: ${error.message}`,
      });
    },
  });
};

// Upload document mutation
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadOrderDocument,
    onSuccess: (_, variables) => {
      // Invalidate the order to refetch with new document
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });

      notifications.show({
        color: "green",
        title: "Éxito",
        message: "Documento subido correctamente",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al subir documento: ${error.message}`,
      });
    },
  });
};

// Quick transport status update mutation
export const useQuickStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      notes,
    }: {
      orderId: string;
      status: TransportStatus;
      notes?: string;
    }) => {
      const promises: Promise<void>[] = [quickStatusUpdate(orderId, status, notes)];
      if (status === TransportStatus.DELIVERED) {
        promises.push(updateOrderStatus(orderId, "DELIVERED"));
      }
      await Promise.all(promises);
    },
    onSuccess: (_, { orderId, status }) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order-status", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      notifications.show({
        color: "green",
        title: "Estado actualizado",
        message: `Transporte avanzó a: ${TRANSPORT_STATUS_LABELS[status] ?? status}`,
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al actualizar el estado: ${error.message}`,
      });
    },
  });
};
