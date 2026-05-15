import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type UserRole = 'user' | 'restaurant' | null;

interface AuthState {
  role: UserRole;
  userId: string | null;
  token: string | null;
  setRole: (role: UserRole) => void;
  setUserId: (id: string | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userId: null,
  token: null,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  setToken: (token) => set({ token }),
  logout: () => {
    supabase.auth.signOut();
    set({ role: null, userId: null, token: null });
  },
}));
