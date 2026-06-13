import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

export default function Layout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthModal({ isOpen: true, mode: location.state.openAuth });
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const openAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const closeAuth = () => setAuthModal({ isOpen: false, mode: "login" });

  return (
    <div className="w-[100%] max-w-[1920px] mx-auto">
      <Navbar onOpenAuth={openAuth} />

      <Outlet />

      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        initialMode={authModal.mode}
      />
    </div>
  );
}
