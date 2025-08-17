import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/services/auth';
import type { User } from '@/lib/types';

interface RegisterData {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoals: string[];
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  init: () => void;
  login: (identifier: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,

      // Initialize auth state from localStorage
      init: () => {
        try {
          // Always try to get current user from localStorage
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            set({ user: currentUser, isAuthenticated: true, isLoading: false, isInitialized: true });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
          }
        } catch (error) {
          console.error('❌ Failed to initialize auth state:', error);
          set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
        }
      },

      login: async (identifier: string) => {
        set({ isLoading: true });
        try {
          const user = authService.login(identifier);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        try {
          const user = authService.register(userData);
          set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>) => {
        try {
          const updatedUser = authService.updateProfile(updates);
          if (updatedUser) {
            set({ user: updatedUser });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Profile update failed:', error);
          return false;
        }
      },

      updatePreferences: async (preferences: Partial<User['preferences']>) => {
        try {
          const updatedUser = authService.updatePreferences(preferences);
          if (updatedUser) {
            set({ user: updatedUser });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Preferences update failed:', error);
          return false;
        }
      },
    }),
    {
      name: 'fit-body-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
