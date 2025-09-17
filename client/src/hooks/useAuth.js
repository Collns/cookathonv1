
import { create } from 'zustand'

type AuthState = {
  token: string | null
  user: any | null
  setAuth: (token: string, user: any) => void
  clear: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clear: () => set({ token: null, user: null })
}))
