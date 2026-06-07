import { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

export default function Layout() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });

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
