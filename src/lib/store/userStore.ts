import { create } from "zustand";
import { User } from "@/lib/types/authTypes";

type UserStoreState = {
  currentUser: User | null;
};

type UserStoreActions = {
  setCurrentUser: (user: User | null) => void;
  clearUser: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearUser: () => set({ currentUser: null }),
}));
export default useUserStore;
