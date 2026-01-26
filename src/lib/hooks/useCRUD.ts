/**
 * Generic hook for CRUD operations
 * 
 * Provides unified state management and handlers for Create, Read, Update, Delete operations
 * with automatic notifications and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';

interface UseCRUDOptions<T, CreateData, UpdateData> {
  fetchFn: () => Promise<{ data: T[] }>;
  createFn: (data: CreateData) => Promise<{ data: T }>;
  updateFn: (id: string | number, data: UpdateData) => Promise<{ data: T }>;
  deleteFn: (id: string | number) => Promise<void | { message: string }>;
  entityName: string; // e.g., "Cliente", "Chofer", "Camión"
  getItemId: (item: T) => string | number;
  getItemDisplayName?: (item: T) => string; // For delete confirmation
}

export function useCRUD<T, CreateData = Partial<T>, UpdateData = Partial<T>>(
  options: UseCRUDOptions<T, CreateData, UpdateData>
) {
  const {
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    entityName,
    getItemId,
    getItemDisplayName,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn();
      setItems(response.data || []);
    } catch (err) {
      const errorMessage = `Error al cargar ${entityName.toLowerCase()}s`;
      setError(errorMessage);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: errorMessage,
      });
      console.error(`Error fetching ${entityName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, entityName]);

  // Create new item
  const create = useCallback(
    async (data: CreateData) => {
      try {
        setLoading(true);
        await createFn(data);
        notifications.show({
          color: 'green',
          title: 'Éxito',
          message: `${entityName} creado correctamente`,
        });
        await fetch();
      } catch (err) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: `Error al crear ${entityName.toLowerCase()}`,
        });
        console.error(`Error creating ${entityName}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createFn, entityName, fetch]
  );

  // Update existing item
  const update = useCallback(
    async (id: string | number, data: UpdateData) => {
      try {
        setLoading(true);
        await updateFn(id, data);
        notifications.show({
          color: 'green',
          title: 'Éxito',
          message: `${entityName} actualizado correctamente`,
        });
        await fetch();
      } catch (err) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: `Error al actualizar ${entityName.toLowerCase()}`,
        });
        console.error(`Error updating ${entityName}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateFn, entityName, fetch]
  );

  // Delete item (with confirmation)
  const remove = useCallback(
    async (item: T) => {
      const id = getItemId(item);
      const displayName = getItemDisplayName 
        ? getItemDisplayName(item) 
        : `este ${entityName.toLowerCase()}`;

      if (!window.confirm(`¿Estás seguro de que deseas eliminar ${displayName}?`)) {
        return;
      }

      try {
        setLoading(true);
        await deleteFn(id);
        notifications.show({
          color: 'green',
          title: 'Éxito',
          message: `${entityName} eliminado correctamente`,
        });
        await fetch();
      } catch (err) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: `Error al eliminar ${entityName.toLowerCase()}`,
        });
        console.error(`Error deleting ${entityName}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [deleteFn, entityName, getItemId, getItemDisplayName, fetch]
  );

  // Auto-fetch on mount
  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
  };
}

export default useCRUD;
