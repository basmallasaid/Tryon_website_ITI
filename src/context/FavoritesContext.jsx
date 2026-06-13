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
import Swal from "sweetalert2";
import i18n from "../i18n/i18n";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrichmentMaps, setEnrichmentMaps] = useState(null);
  const removingRef = useRef(new Set());

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

  const addItem = async (itemId, itemType) => {
    try {
      const res = await addFavorite(itemId, itemType);
      const newItem = enrichFavorite(
        res?.favorite ?? { _id: "", itemId, itemType },
        enrichmentMaps || { wardrobeMap: {}, productsMap: {}, tryonMap: {}, recycleMap: {} }
      );
      setItems((prev) => {
        if (prev.some((i) => i.itemId === itemId)) return prev;
        return [...prev, newItem];
      });
      showToast('success', i18n.t('fav.addedSuccess'));
    } catch {
      showToast('error', i18n.t('fav.addedError'));
    }
  };

  const removeItem = async (originalItemId) => {
    const match = items.find((i) => i.itemId === originalItemId);
    if (!match) return;
    if (removingRef.current.has(originalItemId)) return;
    removingRef.current.add(originalItemId);

    const result = await Swal.fire({
      title: i18n.t('fav.removeConfirmTitle'),
      text: i18n.t('fav.removeConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: i18n.t('fav.removeConfirmButton'),
      cancelButtonText: i18n.t('fav.removeCancelButton'),
    });
    if (!result.isConfirmed) {
      removingRef.current.delete(originalItemId);
      return;
    }

    try {
      await removeFavorite(match._id);
      setItems((prev) => prev.filter((i) => i._id !== match._id));
      showToast('success', i18n.t('fav.removedSuccess'));
      removingRef.current.delete(originalItemId);
    } catch {
      showToast('error', i18n.t('fav.removedError'));
      removingRef.current.delete(originalItemId);
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
