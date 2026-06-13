import { useState } from "react";
import { Heart, HeartOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { showToast } from "../../utils/toast";

const SOURCE_LABELS = {
  Wardrobe: "WARDROBE",
  Store: "FROM STORE",
  "Try On": "RECENT TRY-ON",
  Recycle: "RECENT RECYCLE",
};

const SOURCE_COLORS = {
  "FROM STORE": "bg-accent-pink/10 text-accent-pink",
  WARDROBE: "bg-accent-orange/10 text-accent-orange",
  "RECENT TRY-ON": "bg-primary/10 text-primary",
  "RECENT RECYCLE": "bg-brand-secondary/10 text-brand-secondary",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCategory(item) {
  if (item.category) return item.category;
  const raw = (item.source || item.source_type || item.itemType || "").toLowerCase();
  if (raw === "store" || raw === "product") return "Store";
  if (raw === "wardrobe") return "Wardrobe";
  if (raw === "try-on" || raw === "tryon") return "Try On";
  if (raw === "recycle") return "Recycle";
  return "Store";
}

function getSourceLabel(item) {
  const cat = getCategory(item);
  return SOURCE_LABELS[cat] || cat.toUpperCase() || "FROM STORE";
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-bg-secondary font-roboto flex flex-col items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-surface-elevated flex items-center justify-center mb-6 shadow-sm">
        <Heart size={52} className="text-primary" />
      </div>
      <h2 className="text-[36px] leading-[38px] font-black text-text-primary text-center px-4">
        Your favorites are lonely.
      </h2>
    </div>
  );
}

function FavoritesList({ items, removeItem }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [removingIds, setRemovingIds] = useState(new Set());

  const filtered = items.filter((item) => {
    if (activeFilter === "All") return true;
    const cat = getCategory(item);
    if (activeFilter === "Store") return cat === "Store";
    if (activeFilter === "Wardrobe") return cat === "Wardrobe";
    if (activeFilter === "Recent Try-On") return cat === "Try On";
    if (activeFilter === "Recent Recycle") return cat === "Recycle";
    return false;
  });

  const handleRemove = async (item) => {
    const id = item._id || item.id;
    setRemovingIds((prev) => new Set(prev).add(id));
    try {
      await removeItem(item.itemId || item.item_id || id);
    } catch {
      showToast('error', 'Failed to remove item from favorites');
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary font-roboto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-3">
            Favorites
          </h1>
          <p className="text-text-disabled text-base font-medium max-w-xl">
            Start exploring our curated collections to build your digital favorite screen.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {["All", "Store", "Wardrobe", "Recent Try-On", "Recent Recycle"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-surface-elevated text-text-disabled border border-border-strong hover:border-primary hover:text-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-icon-disabled/30 flex items-center justify-center mb-4">
              <HeartOff size={40} className="text-text-disabled" />
            </div>
            <p className="text-text-disabled text-lg font-medium">
              No {activeFilter.toLowerCase()} favorites found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((item) => {
              const id = item._id || item.id;
              const isRemoving = removingIds.has(id);
              const sourceLabel = getSourceLabel(item);
              const badgeColor = SOURCE_COLORS[sourceLabel] || "bg-border-strong text-text-secondary";
              const imageUrl = item.image || item.images?.[0] || item.image_url || "https://via.placeholder.com/300x400?text=No+Image";

              return (
                <div
                  key={id}
                  className="group relative bg-surface-elevated rounded-[1.5rem] border border-border-strong/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[3/4] bg-bg-secondary overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.title || item.name || "Favorite item"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <button
                      onClick={() => handleRemove(item)}
                      disabled={isRemoving}
                      className="absolute top-3 right-3 p-2 bg-surface-elevated/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 hover:bg-rose-50 hover:scale-110 disabled:opacity-50 cursor-pointer z-10"
                    >
                      {isRemoving ? (
                        <Loader2 size={16} className="animate-spin text-accent-pink" />
                      ) : (
                        <Heart size={16} className="text-accent-pink fill-accent-pink" />
                      )}
                    </button>
                    <span
                      className={`absolute bottom-3 left-3 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm ${badgeColor}`}
                    >
                      {sourceLabel}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-black text-text-primary leading-tight truncate mb-2">
                      {item.title || item.name || "Untitled"}
                    </h3>
                    <p className="text-xs font-medium text-text-disabled">
                      {formatDate(item.createdAt || item.created_at || item.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Fav() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { items, loading, error, removeItem } = useFavorites();

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-secondary font-roboto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="w-28 h-28 rounded-full bg-icon-disabled/30 flex items-center justify-center mb-6">
            <Heart size={44} className="text-text-disabled" />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-2">Favorites</h2>
          <p className="text-text-disabled text-sm font-medium text-center max-w-md">
            {t("fav.loginToView", "Log in to see your favorite items")}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary font-roboto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary font-roboto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-accent-pink font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-brand-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all"
          >
            {t("fav.retry", "Retry")}
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) return <EmptyState />;

  return <FavoritesList items={items} removeItem={removeItem} />;
}
