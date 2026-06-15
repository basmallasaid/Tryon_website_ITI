import { WifiOff, RefreshCw, Home, CloudOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

export default function OfflinePage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-20 font-sans"
      style={{ minHeight: "60vh" }}
    >
      {/* Decorative background elements — matches NotFound page style */}
      <div className="absolute top-[-8%] right-[-8%] w-[35%] h-[35%] rounded-full border-[16px] border-dashed border-primary/5 animate-[spin_50s_linear_infinite]" />
      <div className="absolute bottom-[-8%] left-[-8%] w-[28%] h-[28%] rounded-full border-[12px] border-dashed border-secondary/5 animate-[spin_35s_linear_infinite_reverse]" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Animated WiFi-Off Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(79,195,255,0.1), rgba(166,226,46,0.1))"
                  : "linear-gradient(135deg, rgba(64,185,255,0.1), rgba(142,211,33,0.1))",
              }}
            >
              <WifiOff
                size={48}
                className="text-[var(--primary)]"
                strokeWidth={2}
              />
            </div>
            {/* Subtle pulse ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: "transparent",
                border: "2px solid var(--primary)",
                opacity: 0.15,
                animationDuration: "2.5s",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tight mb-4">
          {t("offline.title")}
        </h2>

        {/* Subtitle */}
        <p className="text-lg font-semibold text-[var(--primary)] mb-3">
          {t("offline.subtitle")}
        </p>

        {/* Description */}
        <p className="text-base font-medium text-text-disabled mb-10 leading-relaxed max-w-lg mx-auto">
          {t("offline.description")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-[var(--primary)] px-10 py-4 font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer"
          >
            <RefreshCw size={20} strokeWidth={3} />
            {t("offline.retry")}
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-3 rounded-[1.5rem] border-2 border-[var(--border)] bg-surface-elevated px-10 py-4 font-black uppercase tracking-widest text-text-secondary transition-all hover:bg-[var(--bg-secondary)] hover:border-[var(--border)] active:scale-95 cursor-pointer"
          >
            <Home size={20} strokeWidth={3} />
            {t("offline.goHome")}
          </button>
        </div>

        {/* Bottom decorative divider — matches NotFound style */}
        <div className="mt-14 flex items-center justify-center gap-3 text-text-disabled">
          <CloudOff size={22} />
          <div className="h-px w-20 bg-[var(--border)]" />
          <WifiOff size={22} />
          <div className="h-px w-20 bg-[var(--border)]" />
          <CloudOff size={22} />
        </div>
      </div>
    </div>
  );
}
