import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrichmentMaps, setEnrichmentMaps] = useState(null);

  // Track in-flight requests to prevent duplicate calls
  const pendingRef = useRef(new Set());

  const fetchAll = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);
      const [favData, maps] = await Promise.all([
        getFavorites(),
        fetchEnrichmentData(),
      ]);
      setEnrichmentMaps(maps);
      const raw = favData?.favorites ?? favData?.items ?? [];
      setItems(raw.map((fav) => enrichFavorite(fav, maps)));
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to load favorites.";
      setError(msg);
      showToast('error', i18n.t('fav.loadError'));
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setError(null);
      pendingRef.current.clear();
    }
  }, [user]);

  /*
   * Optimistic addItem:
   * 1. Immediately add a placeholder item to state
   * 2. Send API request in background
   * 3. On success → replace placeholder with real item from server
   * 4. On failure → rollback (remove placeholder), show error toast
   */
  const addItem = async (itemId, itemType) => {
    if (pendingRef.current.has(`add:${itemId}`)) return;
    pendingRef.current.add(`add:${itemId}`);

    const emptyMaps = { wardrobeMap: {}, productsMap: {}, tryonMap: {}, recycleMap: {} };

    // Store previous state for rollback
    const prevItems = items;

    // Check if already in favorites
    if (prevItems.some((i) => i.itemId === itemId)) {
      pendingRef.current.delete(`add:${itemId}`);
      return;
    }

    // Create optimistic item
    const optimisticItem = enrichFavorite(
      { _id: `optimistic_add_${Date.now()}`, itemId, itemType },
      enrichmentMaps || emptyMaps,
    );
    setItems((prev) => [...prev, optimisticItem]);

    try {
      const res = await addFavorite(itemId, itemType);
      // Backend returns { favorites: [...] } — find the newly created one
      const newFav = res?.favorites?.find(
        (f) => (f.itemId?.$oid ?? f.itemId) === itemId,
      );
      const realItem = enrichFavorite(
        newFav ?? { _id: "", itemId, itemType },
        enrichmentMaps || emptyMaps,
      );
      // Replace optimistic item with real server data
      setItems((prev) =>
        prev.map((i) => (i._id === optimisticItem._id ? realItem : i)),
      );
      showToast('success', i18n.t('fav.addedSuccess'));
    } catch {
      // Rollback: restore previous state
      setItems(prevItems);
      showToast('error', i18n.t('fav.addedError'));
    } finally {
      pendingRef.current.delete(`add:${itemId}`);
    }
  };

  /*
   * Optimistic removeItem:
   * 1. Immediately remove item from state
   * 2. Send API request in background using the favorite document _id
   * 3. On success → keep removed state
   * 4. On failure → rollback (re-add item), show error toast
   */
  const removeItem = async (originalItemId) => {
    if (pendingRef.current.has(`remove:${originalItemId}`)) return;
    pendingRef.current.add(`remove:${originalItemId}`);

    // If an add is still in-flight, the item hasn't been persisted yet — just
    // cancel the pending add and remove from state without calling the API.
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

    // Store previous state for rollback
    const prevItems = items;

    // Immediately remove from UI
    setItems((prev) => prev.filter((i) => i._id !== match._id));

    try {
      await removeFavorite(match._id);
      showToast('success', i18n.t('fav.removedSuccess'));
    } catch {
      // Rollback: restore previous state
      setItems(prevItems);
      showToast('error', i18n.t('fav.removedError'));
    } finally {
      pendingRef.current.delete(`remove:${originalItemId}`);
    }
  };

  const isFavorite = (itemId) => items.some((i) => i.itemId === itemId);

  return (
    <FavoritesContext.Provider
      value={{ items, loading, error, refetch: fetchAll, addItem, removeItem, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
