import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  fetchEnrichmentData,
  enrichFavorite,
} from "../api/favorites_services/favoritesService";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrichmentMaps, setEnrichmentMaps] = useState(null);

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
      setError(e.response?.data?.message || e.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addItem = async (itemId, itemType) => {
    const res = await addFavorite(itemId, itemType).catch(() => null);
    const newItem = enrichFavorite(
      res?.favorite ?? { _id: "", itemId, itemType },
      enrichmentMaps || { wardrobeMap: {}, productsMap: {}, tryonMap: {}, recycleMap: {} }
    );
    setItems((prev) => {
      if (prev.some((i) => i.itemId === itemId)) return prev;
      return [...prev, newItem];
    });
  };

  const removeItem = async (originalItemId) => {
    const match = items.find((i) => i.itemId === originalItemId);
    if (!match) return;
    await removeFavorite(match._id).catch(() => {});
    setItems((prev) => prev.filter((i) => i._id !== match._id));
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
