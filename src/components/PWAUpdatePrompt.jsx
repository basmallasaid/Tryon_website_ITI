import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PWAUpdatePrompt() {
  const { t } = useTranslation();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateWorker, setUpdateWorker] = useState(null);

  useEffect(() => {
    const handleSWUpdate = (event) => {
      if (event.detail) {
        setNeedRefresh(true);
        setUpdateWorker(event.detail);
      }
    };

    window.addEventListener("swUpdated", handleSWUpdate);
    return () => window.removeEventListener("swUpdated", handleSWUpdate);
  }, []);

  const updateApp = () => {
    if (updateWorker) {
      updateWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] animate-slideUp">
      <div className="bg-surface-elevated border border-[var(--border)] rounded-2xl shadow-2xl p-4 max-w-sm">
        <p className="text-sm font-semibold text-text-primary mb-3">
          {t("pwa.updateAvailable") || "New version available!"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={updateApp}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-95 transition-all cursor-pointer"
          >
            {t("pwa.update") || "Update"}
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="px-4 py-2 border border-[var(--border)] text-text-secondary rounded-xl text-sm font-bold hover:bg-[var(--bg-secondary)] transition-all cursor-pointer"
          >
            {t("pwa.dismiss") || "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}
