import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
  applyTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // Default to light mode for new users
      isDark: false,

      setTheme: (theme: Theme) => {
        set({ theme });
        get().applyTheme(theme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      initializeTheme: () => {
        const { theme } = get();
        get().applyTheme(theme);
      },

      applyTheme: (theme: Theme) => {
        let isDark: boolean;
        
        if (theme === 'system') {
          // Only use system preference if user explicitly chose 'system'
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
          // Use explicit user choice (light or dark)
          isDark = theme === 'dark';
        }
        
        set({ isDark });
        
        // Apply to document
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
        
        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
        }
      },
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// System preference change listener - Only for users who explicitly chose 'system'
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useThemeStore.getState();
    // Only auto-update if user explicitly chose 'system' theme
    if (theme === 'system') {
      useThemeStore.getState().applyTheme('system');
    }
  });
}
