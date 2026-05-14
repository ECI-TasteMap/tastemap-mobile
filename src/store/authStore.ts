import { create } from 'zustand';

export type UserRole = 'user' | 'restaurant' | null;

interface AuthState {
  role: UserRole;
  // TODO: populate from real auth response when login endpoint is connected
  userId: string | null;
  setRole: (role: UserRole) => void;
  setUserId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userId: null,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  logout: () => set({ role: null, userId: null }),
}));
