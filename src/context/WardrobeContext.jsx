import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getWardrobeApi } from "../api/wardrobeApi";
import { syncWardrobeCache, invalidateCache } from "../services/cacheService";

const WardrobeContext = createContext();

export function WardrobeProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  const fetchWardrobe = useCallback(async (force = false) => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const userId = user.id || user._id;

    if (!initialLoadDone.current || force) {
      setLoading(true);
    }

    try {
      await syncWardrobeCache({
        userId,
        fetchFn: () => getWardrobeApi(),
        onCacheLoaded: (cachedData) => {
          if (!initialLoadDone.current) {
            setItems(cachedData);
            setLoading(false);
            initialLoadDone.current = true;
          }
        },
        onData: (freshData) => {
          setItems(freshData || []);
          setLoading(false);
          initialLoadDone.current = true;
        },
        force,
      });
    } catch {
      setItems([]);
      setLoading(false);
      initialLoadDone.current = true;
    }
  }, [user]);

  useEffect(() => {
    initialLoadDone.current = false;
    fetchWardrobe();
  }, [fetchWardrobe]);

  const clearCache = useCallback(async () => {
    if (user) {
      const userId = user.id || user._id;
      await invalidateCache(userId, 'wardrobe');
    }
    initialLoadDone.current = false;
  }, [user]);

  return (
    <WardrobeContext.Provider value={{ items, loading, refetch: () => fetchWardrobe(true), clearCache }}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  return useContext(WardrobeContext);
}
