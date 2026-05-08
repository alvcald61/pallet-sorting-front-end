import { create } from "zustand"
import { User } from "@/lib/types/authTypes"

type AuthState = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

type AuthActions = {
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true, error: null }),
  clearAuth: () => set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))

export default useAuthStore
