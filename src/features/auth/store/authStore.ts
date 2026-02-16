import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../../../services/types';

interface AuthState {
  user: AuthUser | null;
  preferredTenantId?: string;
  setUser: (user: AuthUser | null) => void;
  setPreferredTenantId: (tenantId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      preferredTenantId: undefined,
      setUser: (user) => set({ user }),
      setPreferredTenantId: (preferredTenantId) => set({ preferredTenantId }),
      logout: () => set({ user: null }),
    }),
    { name: 'fidelidade-auth' },
  ),
);
