import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    isDarkMode: boolean;
    toggleTheme: () => void;
    setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDarkMode: true, // Default to dark mode
            toggleTheme: () => set((state) => {
                const newMode = !state.isDarkMode;
                // Update the document class for Tailwind
                if (newMode) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                }
                return { isDarkMode: newMode };
            }),
            setDarkMode: (isDark: boolean) => set(() => {
                if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                }
                return { isDarkMode: isDark };
            }),
        }),
        {
            name: 'nexusbiz-theme',
            onRehydrateStorage: () => (state) => {
                // Apply saved theme on load
                if (state?.isDarkMode) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                }
            },
        }
    )
);
