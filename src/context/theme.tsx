import React from 'react';

type TColorMode = 'dark' | 'light';

export const ThemeContext = React.createContext<any>(undefined);
export const getInitialTheme = (): TColorMode => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme') as TColorMode;
    if (typeof storedPrefs !== 'undefined') {
      return storedPrefs;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};
interface IThemeProviderProps {
  initialTheme: TColorMode;
  children: any;
}
export const ThemeProvider = ({ initialTheme, children }: IThemeProviderProps) => {
  const [theme, setTheme] = React.useState(getInitialTheme());

  const rawSetTheme = (newTheme: string) => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      const isDark = newTheme === 'dark';

      root.classList.remove(isDark ? 'light' : 'dark');
      root.classList.add(newTheme);

      localStorage.setItem('color-theme', newTheme);
    }
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  React.useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
