import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  fetchEnrichmentData,
  enrichFavorite,
} from "../api/favorites_services/favoritesService";
import { useAuth } from "./AuthContext";
import { showToast } from "../utils/toast";
import i18n from "../i18n/i18n";
import { getWardrobeItems, getProducts, clearUserCaches } from "../services/indexedDB";
import { syncFavoritesCache } from "../services/cacheService";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrichmentMaps, setEnrichmentMaps] = useState(null);
  const initialLoadDone = useRef(false);
  const pendingRef = useRef(new Set());
  const mapsRef = useRef(null);

  const loadCachedMaps = useCallback(async () => {
    const userId = user?.id || user?._id;
    if (!userId) return { productsMap: {}, wardrobeMap: {}, tryonMap: {}, recycleMap: {} };
    const [cachedProducts, cachedWardrobe] = await Promise.all([
      getProducts().catch(() => []),
      getWardrobeItems(userId).catch(() => []),
    ]);
    const maps = { productsMap: {}, wardrobeMap: {}, tryonMap: {}, recycleMap: {} };
    cachedProducts.forEach(p => { maps.productsMap[p._id] = p });
    cachedWardrobe.forEach(w => { maps.wardrobeMap[w._id] = w });
    return maps;
  }, [user]);

  useEffect(() => {
    if (!user?.token) return;
    loadCachedMaps().then(maps => {
      if (!mapsRef.current) {
        mapsRef.current = maps;
        setEnrichmentMaps(maps);
      }
    });
  }, [user?.token, loadCachedMaps]);

  const fetchAll = useCallback(async (force = false) => {
    if (!user?.token) {
      setItems([]);
      setLoading(false);
      return;
    }

    const userId = user.id || user._id;
    if (!initialLoadDone.current || force) setLoading(true);

    await syncFavoritesCache({
      userId,
      fetchFn: () => getFavorites().then(res => res?.favorites ?? res?.items ?? []),
      onData: async (raw) => {
        try {
          if (!mapsRef.current) {
            mapsRef.current = await loadCachedMaps();
            setEnrichmentMaps(mapsRef.current);
          }
          setItems(raw.map(fav => enrichFavorite(fav, mapsRef.current)));
          setError(null);

          const freshMaps = await fetchEnrichmentData().catch(() => null);
          if (freshMaps) {
            mapsRef.current = freshMaps;
            setEnrichmentMaps(freshMaps);
            setItems(raw.map(fav => enrichFavorite(fav, freshMaps)));
          }
        } catch (e) {
          const msg = e.response?.data?.message || e.message || "Failed to load favorites.";
          setError(msg);
          showToast('error', i18n.t('fav.loadError'));
        }
        setLoading(false);
        if (!initialLoadDone.current) initialLoadDone.current = true;
      },
      force,
    });
  }, [user?.token, loadCachedMaps]);

  useEffect(() => {
    initialLoadDone.current = false;
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setError(null);
      pendingRef.current.clear();
      initialLoadDone.current = false;
    }
  }, [user]);

  const addItem = useCallback(async (itemId, itemType) => {
    if (pendingRef.current.has(`add:${itemId}`)) return;
    pendingRef.current.add(`add:${itemId}`);

    const emptyMaps = { wardrobeMap: {}, productsMap: {}, tryonMap: {}, recycleMap: {} };
    const prevItems = items;

    if (prevItems.some((i) => i.itemId === itemId)) {
      pendingRef.current.delete(`add:${itemId}`);
      return;
    }

    const optimisticItem = enrichFavorite(
      { _id: `optimistic_add_${Date.now()}`, itemId, itemType },
      mapsRef.current || emptyMaps,
    );
    setItems((prev) => [...prev, optimisticItem]);
    showToast('success', i18n.t('fav.addedSuccess'));

    try {
      const res = await addFavorite(itemId, itemType);
      const newFav = res?.favorites?.find(
        (f) => (f.itemId?.$oid ?? f.itemId) === itemId,
      );
      if (newFav) {
        const realItem = enrichFavorite(
          newFav,
          mapsRef.current || emptyMaps,
        );
        setItems((prev) =>
          prev.map((i) => (i._id === optimisticItem._id ? realItem : i)),
        );
      }
    } catch {
      setItems(prevItems);
      showToast('error', i18n.t('fav.addedError'));
    } finally {
      pendingRef.current.delete(`add:${itemId}`);
    }
  }, [items]);

  const removeItem = useCallback(async (originalItemId) => {
    if (pendingRef.current.has(`remove:${originalItemId}`)) return;
    pendingRef.current.add(`remove:${originalItemId}`);

    if (pendingRef.current.has(`add:${originalItemId}`)) {
      pendingRef.current.delete(`add:${originalItemId}`);
      setItems((prev) => prev.filter((i) => i.itemId !== originalItemId));
      pendingRef.current.delete(`remove:${originalItemId}`);
      return;
    }

    const match = items.find((i) => i.itemId === originalItemId);
    if (!match) {
      pendingRef.current.delete(`remove:${originalItemId}`);
      return;
    }

    const prevItems = items;
    setItems((prev) => prev.filter((i) => i._id !== match._id));
    showToast('success', i18n.t('fav.removedSuccess'));

    try {
      await removeFavorite(match._id);
    } catch {
      setItems(prevItems);
      showToast('error', i18n.t('fav.removedError'));
    } finally {
      pendingRef.current.delete(`remove:${originalItemId}`);
    }
  }, [items]);

  const isFavorite = useCallback((itemId) => items.some((i) => i.itemId === itemId), [items]);

  const refetch = useCallback(() => fetchAll(true), [fetchAll]);

  const clearCache = useCallback(async () => {
    if (user) {
      const userId = user.id || user._id;
      await clearUserCaches(userId);
    }
    initialLoadDone.current = false;
  }, [user]);

  const providerValue = useMemo(() => ({
    items, loading, error, refetch, addItem, removeItem, isFavorite, clearCache
  }), [items, loading, error, refetch, addItem, removeItem, isFavorite, clearCache]);

  return (
    <FavoritesContext.Provider value={providerValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
