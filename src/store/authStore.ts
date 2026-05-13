import { create } from 'zustand';

export type UserRole = 'user' | 'restaurant' | null;

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  logout: () => set({ role: null }),
}));
