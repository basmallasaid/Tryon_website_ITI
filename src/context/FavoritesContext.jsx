import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getFavorites, addFavorite, removeFavorite, fetchItemDetails } from "../api/favorites_services/favoritesService";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      const raw = data?.favorites ?? data?.items ?? [];
      const enriched = await Promise.all(
        raw.map(async (fav) => {
          const details = await fetchItemDetails(fav.itemId, fav.itemType).catch(() => ({}));
          return { ...fav, ...details };
        })
      );
      setItems(enriched);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addItem = async (itemId, itemType) => {
    try {
      const res = await addFavorite(itemId, itemType);
      let newItem = res?.favorite ?? res?.data ?? res;
      if (!newItem?._id) newItem = { itemId, itemType };
      const details = await fetchItemDetails(itemId, itemType).catch(() => ({}));
      newItem = { ...newItem, itemId, ...details };
      setItems((prev) => {
        if (prev.some((i) => i.itemId === itemId)) return prev;
        return [...prev, newItem];
      });
    } catch (e) {
      console.error("addItem failed:", e.response?.data || e.message);
      throw e;
    }
  };

  const removeItem = async (targetItemId) => {
    try {
      const favorite = items.find((i) => i.itemId === targetItemId);
      if (!favorite) return;
      await removeFavorite(favorite._id);
      setItems((prev) => prev.filter((i) => i._id !== favorite._id));
    } catch (e) {
      console.error("removeItem failed:", e.response?.data || e.message);
      throw e;
    }
  };

  const isFavorite = (itemId) => items.some((i) => i.itemId === itemId);

  return (
    <FavoritesContext.Provider
      value={{
        items,
        loading,
        error,
        refetch: fetchFavorites,
        addItem,
        removeItem,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
