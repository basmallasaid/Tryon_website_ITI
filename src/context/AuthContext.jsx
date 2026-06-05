import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, setAuth, removeAuth } from "../utils/tokenUtils";

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

  const logout = () => {
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