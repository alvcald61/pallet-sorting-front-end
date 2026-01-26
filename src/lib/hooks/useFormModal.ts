/**
 * Generic hook for managing modal form state
 * 
 * Handles opening/closing modals and tracking selected items for editing
 */

import { useState } from 'react';

export function useFormModal<T>() {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);

  const openCreate = () => {
    setSelected(null);
    setOpened(true);
  };

  const openEdit = (item: T) => {
    setSelected(item);
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
    setSelected(null);
  };

  return {
    opened,
    selected,
    openCreate,
    openEdit,
    close,
  };
}

export default useFormModal;
