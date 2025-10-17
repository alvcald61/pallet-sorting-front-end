import { Pallet } from "@/lib/types/palletType";
import { create } from "zustand";
import { Bulk } from "@/lib/types/bulkType";
// Note: 'create' as a default export is a deprecated import.

type OrderStoreState = {
  bulkOrder: Bulk[];
  palletOrder: Pallet[];
  address: Address;
};
type Address = {
  fromAddress: string;
  toAddress: string;
  date: string | null;
  time: string | null;
};

type OrderStoreActions = {
  addBulk: (newElement: Bulk) => void;
  addPallet: (newElement: Pallet) => void;
  addAddress: (newElement: Address) => void;
};

type OrderStore = OrderStoreState & OrderStoreActions;

const useOrderStore = create<OrderStore>((set) => ({
  bulkOrder: [],
  palletOrder: [],
  address: {} as Address,
  addBulk: (newElement) =>
    set((state) => ({
      bulkOrder: [...state.bulkOrder, newElement],
    })),
  addPallet: (newElement) =>
    set((state) => ({
      palletOrder: [...state.palletOrder, newElement],
    })),
  addAddress: (newElement) =>
    set((state) => ({
      ...state,
      address: newElement,
    })),
}));

export default useOrderStore;
