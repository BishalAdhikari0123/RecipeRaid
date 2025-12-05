import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isPremium: boolean;
  totalRaidsCompleted: number;
  totalScore: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setAuth: (user, token) => {
        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
