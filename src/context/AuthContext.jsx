import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { getAuth, setAuth, removeAuth } from "../utils/tokenUtils";
import { clearUserCaches } from "../services/indexedDB";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = getAuth();
    if (stored) setUser(stored);
  }, []);

  const login = useCallback((userData) => {
    setAuth(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    const currentUser = user;
    removeAuth();
    setUser(null);
    if (currentUser) {
      const userId = currentUser.id || currentUser._id;
      clearUserCaches(userId).catch(() => {});
    }
  }, [user]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}