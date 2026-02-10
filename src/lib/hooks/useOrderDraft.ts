import { useEffect } from "react";
import useOrderStore from "@/lib/store/OrderStore";
import { notifications } from "@mantine/notifications";

const DRAFT_KEY_PREFIX = "order_draft_";
const DRAFT_EXPIRY_DAYS = 7;

interface OrderDraft {
  bulkOrder: any[];
  palletOrder: any[];
  address: any;
  userId: string | undefined;
  timestamp: number;
  orderType: "bulk" | "pallet";
}

/**
 * Hook to auto-save and restore order drafts
 */
export function useOrderDraft(orderType: "bulk" | "pallet") {
  const { bulkOrder, palletOrder, address, userId, addBulk, addPallet, addAddress, addUserId } =
    useOrderStore();

  const draftKey = `${DRAFT_KEY_PREFIX}${orderType}`;

  // Save draft to localStorage
  const saveDraft = () => {
    try {
      const draft: OrderDraft = {
        bulkOrder,
        palletOrder,
        address,
        userId,
        timestamp: Date.now(),
        orderType,
      };

      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Load draft from localStorage
  const loadDraft = (): OrderDraft | null => {
    try {
      const stored = localStorage.getItem(draftKey);
      if (!stored) return null;

      const draft: OrderDraft = JSON.parse(stored);

      // Check if draft has expired
      const expiryTime = DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - draft.timestamp > expiryTime) {
        localStorage.removeItem(draftKey);
        return null;
      }

      return draft;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  };

  // Clear draft
  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  // Restore draft to store
  const restoreDraft = (draft: OrderDraft) => {
    try {
      if (draft.orderType === "bulk" && draft.bulkOrder.length > 0) {
        draft.bulkOrder.forEach((item) => addBulk(item));
      } else if (draft.orderType === "pallet" && draft.palletOrder.length > 0) {
        draft.palletOrder.forEach((item) => addPallet(item));
      }

      if (draft.address) {
        addAddress(draft.address);
      }

      if (draft.userId) {
        addUserId(draft.userId);
      }

      notifications.show({
        title: "Borrador restaurado",
        message: "Se ha recuperado tu pedido sin finalizar",
        color: "blue",
      });
    } catch (error) {
      console.error("Error restoring draft:", error);
      notifications.show({
        title: "Error",
        message: "No se pudo restaurar el borrador",
        color: "red",
      });
    }
  };

  // Auto-save on changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const items = orderType === "bulk" ? bulkOrder : palletOrder;
      if (items.length > 0 || address.fromAddress?.address) {
        saveDraft();
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [bulkOrder, palletOrder, address, userId, orderType]);

  // Check for existing draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      const items = draft.orderType === "bulk" ? draft.bulkOrder : draft.palletOrder;
      const currentItems = orderType === "bulk" ? bulkOrder : palletOrder;

      // Only restore if current order is empty
      if (items.length > 0 && currentItems.length === 0) {
        // Show confirmation
        if (
          window.confirm(
            "Se encontró un pedido sin finalizar. ¿Deseas recuperarlo?"
          )
        ) {
          restoreDraft(draft);
        } else {
          clearDraft();
        }
      }
    }
  }, []); // Run only on mount

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    restoreDraft,
  };
}
