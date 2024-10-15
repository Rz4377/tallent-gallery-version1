import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Create the context
export const DarkModeContext = createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
}>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Create the provider component
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check if user has dark mode preference in local storage
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme === 'true') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Create a hook for easier access to the context
export const useDarkMode = () => useContext(DarkModeContext);