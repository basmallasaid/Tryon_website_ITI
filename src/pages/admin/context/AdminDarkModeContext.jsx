import { createContext, useContext, useState, useCallback } from 'react';

const AdminDarkModeContext = createContext();

const SETTINGS_KEY = 'admin_settings';

function loadDarkMode() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.darkMode === true;
    }
  } catch {}
  return false;
}

function saveDarkMode(value) {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.darkMode = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
  } catch {}
}

export function AdminDarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(loadDarkMode);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      saveDarkMode(next);
      return next;
    });
  }, []);

  return (
    <AdminDarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </AdminDarkModeContext.Provider>
  );
}

export function useAdminDarkMode() {
  return useContext(AdminDarkModeContext);
}
