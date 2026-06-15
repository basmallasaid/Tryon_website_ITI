import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import OfflinePage from "./OfflinePage/OfflinePage";

// المسارات التي يمكن تصفحها بدون إنترنت
const CACHED_PATHS = ["/", "/about", "/about-recycle", "/about-tryon", "/contact-us"];

export default function Layout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });
  const isOnline = useOnlineStatus();

  // حالة للتأكد من أن التطبيق جاهز لعرض حالة الأوفلاين (لتجنب الوميض عند أول تحميل)
  const [isReady, setIsReady] = useState(false);

  // تحديث اللغة والاتجاه
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // تفعيل التحقق بعد أول رندر مباشرة لضمان استقرار حالة isOnline
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // منطق فتح نافذة تسجيل الدخول تلقائياً
  useEffect(() => {
    if (location.state?.openAuth && isOnline) {
      window.history.replaceState({}, "");
      setAuthModal({ isOpen: true, mode: location.state.openAuth });
    }
  }, [location.state, isOnline]);

  const openAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const closeAuth = () => setAuthModal({ isOpen: false, mode: "login" });

  // فحص هل المسار الحالي ضمن الكاش أم لا
  const isPageCached = CACHED_PATHS.includes(location.pathname);

  /**
   * الشرط المحدث:
   * 1. يجب أن يكون التطبيق جاهز (isReady) لتجنب الخطأ في أول ثانية.
   * 2. يجب أن تكون الحالة أوفلاين (!isOnline).
   * 3. يجب ألا يكون المسار الحالي ضمن الكاش (!isPageCached).
   */
  const showOfflinePage = isReady && !isOnline && !isPageCached;

  return (
    <div className="w-[100%] max-w-[1920px] mx-auto min-h-screen flex flex-col">
      <Navbar onOpenAuth={openAuth} />

      <main className="flex-grow">
        {showOfflinePage ? (
          <OfflinePage key={location.pathname} />
        ) : (
          /* وضع key هنا يجبر الكمبيوتر على إعادة فحص الحالة عند الانتقال */
          <Outlet key={location.pathname} />
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        initialMode={authModal.mode}
      />
    </div>
  );
}