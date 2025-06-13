
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'; // Changed 'use' back to 'useContext'

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark

  useEffect(() => {
    // This effect runs once on mount to initialize theme from localStorage
    // The FOUC script in index.html handles the very initial paint
    const storedTheme = localStorage.getItem('nufa-theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      // Default to dark if nothing in localStorage or no system preference check
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    // This effect applies the theme class to <html> and updates localStorage
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nufa-theme', theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext); // Changed from use(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};