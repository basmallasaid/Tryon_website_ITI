import React from "react";

export default function SlidingOverlay({ view, onToggle, onForgot, inModal }) {
  const overlayRight = view === "login" || view === "otp" || view === "reset";
  const isOtp = view === "otp";
  const isForgot = view === "forgot";
  const isLogin = view === "login";
  const isReset = view === "reset";

  return (
    <div className={`absolute top-0 z-20 hidden h-full w-[40%] flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white transition-all duration-700 ease-in-out md:flex rounded-3xl  ${
      overlayRight ? "translate-x-[150%]" : "translate-x-0"
    }`} style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/2.png')" }}>
      <div className={`flex flex-col items-center text-center ${inModal ? 'p-8' : 'p-12'}`}>
        {isOtp ? (
          <>
            <div className={`${inModal ? 'w-14 h-14 mb-5' : 'w-20 h-20 mb-6'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h1 className={`font-bold ${inModal ? 'mb-3 text-4xl' : 'mb-4 text-5xl'}`}>
              Verify Your Identity
            </h1>
            <p className={`opacity-90 leading-relaxed ${inModal ? 'text-base' : 'mb-0 text-lg'}`}>
              To protect your wardrobe and style preferences, please confirm it's really you.
            </p>
          </>
        ) : isForgot ? (
          <>
            <h1 className={`font-bold ${inModal ? 'mb-3 text-4xl' : 'mb-4 text-5xl'}`}>
              <span className="block mb-2">Reset Your</span>
              <span className="block">Password</span>
            </h1>
            <p className={`opacity-90 ${inModal ? 'mb-6 text-base' : 'mb-10 text-lg'}`}>
              Remember your password?
            </p>
            <button onClick={onToggle} className={`rounded-xl border-2 border-white font-semibold transition-all active:scale-95 ${inModal ? 'px-12 py-2.5 text-lg' : 'px-16 py-3 text-xl'}`}>
              Back to Login
            </button>
          </>
        ) : isReset ? (
          <>
            <h1 className={`font-bold ${inModal ? 'mb-3 text-5xl' : 'mb-2 text-6xl'}`}>Redolapy</h1>
            <h2 className={`font-semibold ${inModal ? 'mb-6 text-lg' : 'mb-10 text-xl'}`}>Secure Your Atelier</h2>
            <p className={`opacity-90 leading-relaxed ${inModal ? 'text-sm' : 'text-base'}`}>
              Protect your digital fashion sanctuary. A stronger password ensures your curated wardrobe remains exclusively yours.
            </p>
          </>
        ) : isLogin ? (
          <>
            <h1 className={`font-bold ${inModal ? 'mb-3 text-4xl' : 'mb-4 text-5xl'}`}>
              <span className="block mb-2">Welcome</span>
              <span className="block">Back</span>
            </h1>
            <p className={`opacity-90 ${inModal ? 'mb-6 text-base' : 'mb-10 text-lg'}`}>
              Don't Have an account?
            </p>
            <button onClick={onToggle} className={`rounded-xl border-2 border-white font-semibold transition-all active:scale-95 ${inModal ? 'px-12 py-2.5 text-lg' : 'px-16 py-3 text-xl'}`}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <h1 className={`font-bold ${inModal ? 'mb-3 text-4xl' : 'mb-4 text-5xl'}`}>
              <span className="block mb-2">Welcome To</span>
            </h1>
            <h2 className={`font-bold ${inModal ? 'mb-5 text-4xl' : 'mb-8 text-5xl'}`}>Redolapy</h2>
            <p className={`opacity-90 ${inModal ? 'mb-6 text-base' : 'mb-10 text-lg'}`}>
              Already have an account?
            </p>
            <button onClick={onToggle} className={`rounded-xl border-2 border-white font-semibold transition-all active:scale-95 ${inModal ? 'px-12 py-2.5 text-lg' : 'px-16 py-3 text-xl'}`}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}