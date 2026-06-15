import { useTranslation } from "react-i18next";
import { X, Calendar, Sparkles } from "lucide-react";

const imgSrc = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    if (image.startsWith("data:") || image.startsWith("http")) return image;
    return `data:image/jpeg;base64,${image}`;
  }
  if (image.url) return image.url;
  if (image.uri) return image.uri;
  return null;
};

function formatDateLong(dateStr, locale = "en-US") {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getItemName(item, isArabic) {
  if (isArabic && item.name_ar) return item.name_ar;
  return item.name || "";
}

function getItemStyle(item, isArabic) {
  if (isArabic && item.style_ar) return item.style_ar;
  return item.style || item.category || "";
}

export default function OutfitDetailModal({ outfit, dayName, date, isArabic, onClose }) {
  const { t } = useTranslation();
  const dateLocale = isArabic ? "ar-EG" : "en-US";

  if (!outfit) return null;

  const items = outfit.items || [];
  const compositeImage = outfit.compositeImage || items[0]?.image || null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-elevated w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-surface-elevated/90 backdrop-blur-sm rounded-full text-text-secondary hover:text-[var(--accent-orange)] hover:bg-[var(--bg-secondary)] transition-all shadow-md md:hidden"
        >
          <X size={18} />
        </button>

        <div className="md:w-[45%] bg-[var(--bg-secondary)] relative group overflow-hidden">
          {compositeImage ? (
            <img
              src={imgSrc(compositeImage)}
              alt="Outfit"
              className="w-full h-64 md:h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-64 md:h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-text-disabled" />
            </div>
          )}
        </div>

        <div className="md:w-[55%] p-6 md:p-8 flex flex-col bg-surface-elevated overflow-y-auto">
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 p-2 hover:bg-[var(--bg-secondary)] rounded-full text-text-disabled hover:text-[var(--accent-orange)] transition-all"
          >
            <X size={24} />
          </button>

          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-brand-secondary rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">
                {dayName}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
              {t("recommendation.previousRecommendation")}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-text-disabled mb-6">
            <Calendar size={14} />
            <span className="text-sm font-medium">{formatDateLong(date, dateLocale)}</span>
          </div>

          {items.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-text-disabled mb-4">
                {t("recommendation.outfitItems")}
              </h3>
              <div className="flex flex-col gap-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-[var(--bg-secondary)] rounded-2xl p-3 border border-[var(--border)]"
                  >
                    <div className="w-16 h-16 bg-surface-elevated rounded-xl overflow-hidden p-1.5 flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img
                          src={imgSrc(item.image)}
                          alt={getItemName(item, isArabic)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Sparkles className="w-6 h-6 text-text-disabled" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-text-primary truncate">
                        {getItemName(item, isArabic) || t("recommendation.clothingItem")}
                      </h4>
                      <span className="text-[10px] font-black text-brand-secondary uppercase tracking-wider">
                        {getItemStyle(item, isArabic) || "Casual"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
