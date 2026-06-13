import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const savedSettings = (() => {
  try {
    const raw = localStorage.getItem("admin_settings");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lang: "en" };
})();

i18n.use(initReactI18next).init({
  resources,
  lng: savedSettings.lang || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  ns: ["translation"],
  defaultNS: "translation",
});

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
  const settings = (() => {
    try {
      const raw = localStorage.getItem("admin_settings");
      if (raw) return JSON.parse(raw);
    } catch {}
    return { lang: "en" };
  })();
  settings.lang = lng;
  localStorage.setItem("admin_settings", JSON.stringify(settings));
});

export default i18n;
