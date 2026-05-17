import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { User } from '../types';
import { authApi } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          const { user, token } = res.data.data!;
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          const message = axios.isAxiosError(err)
            ? err.response?.data?.message || 'Login failed'
            : 'Login failed';
          throw new Error(message);
        }
      },

      register: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register({ name, email, password, role });
          const { user, token } = res.data.data!;
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          const message = axios.isAxiosError(err)
            ? err.response?.data?.message || 'Registration failed'
            : 'Registration failed';
          throw new Error(message);
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        try {
          const res = await authApi.getMe();
          set({ user: res.data.data!.user });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      },
    }),
    { name: 'auth-store', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);
