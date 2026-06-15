import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, setAuth, removeAuth } from "../utils/tokenUtils";
import { logoutApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = getAuth();
    if (stored) setUser(stored);
  }, []);

  const login = (userData) => {
    setAuth(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // ignore - clear local state regardless
    }
    removeAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
