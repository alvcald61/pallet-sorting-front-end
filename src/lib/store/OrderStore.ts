import { Pallet } from '@/lib/types/palletType';
import { create } from 'zustand';
import { Bulk } from '@/lib/types/bulkType';
// Note: 'create' as a default export is a deprecated import. 

type OrderStoreState = { bulkOrder: Bulk[], palletOrder: Pallet[] }

type OrderStoreActions = {
  addBulk: (newElement: Bulk) => void
  addPallet: (newElement: Pallet) => void
}

type OrderStore = OrderStoreState & OrderStoreActions;

const useOrderStore = create<OrderStore>((set) => ({
  bulkOrder: [],
  palletOrder: [],
  addBulk: (newElement) => set((state) => ({
    bulkOrder: [...state.bulkOrder, newElement],
  })),
  addPallet: (newElement) => set((state) => ({
    palletOrder: [...state.palletOrder, newElement],
  }))
}));

export default useOrderStore;