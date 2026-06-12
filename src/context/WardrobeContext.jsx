import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getWardrobeApi } from "../api/wardrobeApi";

const WardrobeContext = createContext();

export function WardrobeProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWardrobe = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getWardrobeApi();
      const data = res.data;
      setItems(Array.isArray(data) ? data : data?.items ?? data?.wardrobe ?? data?.products ?? []);
    } catch (err) {
      console.error("Failed to fetch wardrobe:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWardrobe();
  }, [fetchWardrobe]);

  return (
    <WardrobeContext.Provider value={{ items, loading, refetch: fetchWardrobe }}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  return useContext(WardrobeContext);
}
