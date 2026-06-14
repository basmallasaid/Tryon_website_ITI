import React, { useEffect } from "react";
import AuthPage from "../pages/Auth/AuthPage";

export default function AuthModal({ isOpen, onClose, initialMode }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <AuthPage initialIsLogin={initialMode === "login"} inModal onClose={onClose} />
      </div>
    </div>
  );
}
