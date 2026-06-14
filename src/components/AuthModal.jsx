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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay backdrop-blur-sm px-4 py-4 sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl animate-fadeInScale max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[32px] sm:rounded-[40px]"
        onClick={(e) => e.stopPropagation()}
      >
        <AuthPage initialIsLogin={initialMode === "login"} inModal onClose={onClose} />
      </div>
    </div>
  );
}
