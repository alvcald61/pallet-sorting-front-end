import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

/**
 * Configuration for CRUD operations using React Query
 */
interface UseCRUDWithQueryConfig<T, TCreate = Partial<T>, TUpdate = TCreate> {
  // Query key for React Query cache
  queryKey: string[];
  // API functions
  fetchFn: () => Promise<{ data: T[] }>;
  createFn: (data: TCreate) => Promise<{ data: T }>;
  updateFn: (id: string | number, data: TUpdate) => Promise<{ data: T }>;
  deleteFn: (id: string | number) => Promise<void | { message: string }>;
  // Display configuration
  entityName: string;
  getItemId: (item: T) => string | number;
  getItemDisplayName: (item: T) => string;
  // Optional query options
  queryOptions?: Omit<UseQueryOptions<{ data: T[] }>, "queryKey" | "queryFn">;
}

/**
 * Enhanced useCRUD hook with React Query
 * Provides automatic caching, background refetching, and optimistic updates
 */
export function useCRUDWithQuery<
  T,
  TCreate = Partial<T>,
  TUpdate = TCreate
>(config: UseCRUDWithQueryConfig<T, TCreate, TUpdate>) {
  const {
    queryKey,
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    entityName,
    getItemId,
    getItemDisplayName,
    queryOptions,
  } = config;

  const queryClient = useQueryClient();

  // Fetch items with React Query
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: fetchFn,
    ...queryOptions,
  });

  const items = data?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: (response) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey });
      notifications.show({
        color: "green",
        title: "Éxito",
        message: `${entityName} creado correctamente`,
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al crear ${entityName.toLowerCase()}: ${error.message}`,
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: TUpdate }) =>
      updateFn(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update cache
      queryClient.setQueryData(queryKey, (old: { data: T[] } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((item: T) =>
            getItemId(item) === id ? { ...item, ...data } : item
          ),
        };
      });

      return { previousData };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al actualizar ${entityName.toLowerCase()}: ${error.message}`,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Éxito",
        message: `${entityName} actualizado correctamente`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically remove from cache
      queryClient.setQueryData(queryKey, (old: { data: T[] } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((item: T) => getItemId(item) !== id),
        };
      });

      return { previousData };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      notifications.show({
        color: "red",
        title: "Error",
        message: `Error al eliminar ${entityName.toLowerCase()}: ${error.message}`,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Éxito",
        message: `${entityName} eliminado correctamente`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Helper function to delete with confirmation
  const remove = (item: T) => {
    const displayName = getItemDisplayName(item);
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar ${displayName}?`
      )
    ) {
      deleteMutation.mutate(getItemId(item));
    }
  };

  return {
    // Data
    items,
    loading: isLoading || isRefetching,
    error,
    
    // Actions
    create: createMutation.mutate,
    update: (id: string | number, data: TUpdate) =>
      updateMutation.mutate({ id, data }),
    remove,
    refetch,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
