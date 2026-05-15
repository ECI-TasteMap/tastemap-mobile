import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type UserRole = 'user' | 'restaurant' | null;

interface AuthState {
  role: UserRole;
<<<<<<< Updated upstream
  // TODO: populate from real auth response when login endpoint is connected
  userId: string | null;
  setRole: (role: UserRole) => void;
  setUserId: (id: string | null) => void;
=======
  token: string | null;
  setRole: (role: UserRole) => void;
  setToken: (token: string | null) => void;
>>>>>>> Stashed changes
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
<<<<<<< Updated upstream
  userId: null,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  logout: () => set({ role: null, userId: null }),
=======
  token: null,
  setRole: (role) => set({ role }),
  setToken: (token) => set({ token }),
  logout: () => {
    supabase.auth.signOut();
    set({ role: null, token: null });
  },
>>>>>>> Stashed changes
}));
