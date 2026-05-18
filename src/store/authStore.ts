import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type UserRole = 'user' | 'restaurant' | null;

interface AuthState {
  role: UserRole;
  userId: string | null;             // Supabase UUID
  backendUserId: string | null;      // Backend MongoDB ObjectId
  token: string | null;
  email: string | null;
  activeRestaurantId: string | null; // Selected restaurant for owner flow
  setRole: (role: UserRole) => void;
  setUserId: (id: string | null) => void;
  setBackendUserId: (id: string | null) => void;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setActiveRestaurantId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userId: null,
  backendUserId: null,
  token: null,
  email: null,
  activeRestaurantId: null,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  setBackendUserId: (backendUserId) => set({ backendUserId }),
  setToken: (token) => set({ token }),
  setEmail: (email) => set({ email }),
  setActiveRestaurantId: (activeRestaurantId) => set({ activeRestaurantId }),
  logout: () => {
    supabase.auth.signOut();
    set({ role: null, userId: null, backendUserId: null, token: null, email: null, activeRestaurantId: null });
  },
}));
