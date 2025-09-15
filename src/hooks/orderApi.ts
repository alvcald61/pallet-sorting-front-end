import { useState, useEffect, useCallback } from "react";
import { CreateOrderRequest, Order } from "@/lib/types/orderRequest";
import { createOrder, getOrders } from "@/lib/api/order/orderApi";

interface UseOrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export const useOrders = () => {
  const [state, setState] = useState<UseOrdersState>({
    orders: [],
    loading: false,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const orders = await getOrders();
      setState((prev) => ({ ...prev, orders, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  }, []);

  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const newOrder = await createOrder(orderData);
      setState((prev) => ({
        ...prev,
        orders: [...prev.orders, newOrder],
        loading: false,
      }));
      return newOrder;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error al crear orden",
      }));
      throw error;
    }
  }, []);

  // const updateOrder = useCallback(
  //   async (id: string, orderData: Partial<Order>) => {
  //     setState((prev) => ({ ...prev, loading: true, error: null }));
  //     try {
  //       const updatedOrder = await orderApi.updateOrder(id, orderData);
  //       setState((prev) => ({
  //         ...prev,
  //         orders: prev.orders.map((order) =>
  //           order.id === id ? updatedOrder : order
  //         ),
  //         loading: false,
  //       }));
  //       return updatedOrder;
  //     } catch (error) {
  //       setState((prev) => ({
  //         ...prev,
  //         loading: false,
  //         error:
  //           error instanceof Error
  //             ? error.message
  //             : "Error al actualizar orden",
  //       }));
  //       throw error;
  //     }
  //   },
  //   []
  // );

  // const deleteOrder = useCallback(async (id: string) => {
  //   setState((prev) => ({ ...prev, loading: true, error: null }));
  //   try {
  //     await orderApi.deleteOrder(id);
  //     setState((prev) => ({
  //       ...prev,
  //       orders: prev.orders.filter((order) => order.id !== id),
  //       loading: false,
  //     }));
  //   } catch (error) {
  //     setState((prev) => ({
  //       ...prev,
  //       loading: false,
  //       error:
  //         error instanceof Error ? error.message : "Error al eliminar orden",
  //     }));
  //     throw error;
  //   }
  // }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    ...state,
    refetch: fetchOrders,
    createOrder,
    // updateOrder,
    // deleteOrder,
  };
};
