import React from "react";

export default function SlidingOverlay({ isLogin, toggleAuth }) {
  return (
    <div className={`absolute top-0 z-20 hidden h-full w-[40%] flex-col items-center justify-center bg-[#40B9FF] text-white transition-all duration-700 ease-in-out md:flex rounded-3xl  ${
      isLogin ? "translate-x-[150%]" : "translate-x-0"
    }`}>
      <div className="flex flex-col items-center p-12 text-center">
        <h1 className="mb-4 text-5xl font-bold transition-all duration-500 text-center">
          {isLogin ? (
            <>
              <span className="block mb-2">Welcome</span>
              <span className="block">Back</span>
            </>
          ) : (     
            <>
              <span className="block">Welcome To</span>
              
            </>
          )}
        </h1>
        <h2 className="mb-8 text-5xl font-bold">{isLogin ? "" : "Redolapy"}</h2>
        <p className="mb-10 text-lg opacity-90">
          {isLogin ? "Don't Have an account?" : "Already have an account?"}
        </p>
        <button onClick={toggleAuth} className="rounded-xl border-2 border-white px-16 py-3 text-xl font-semibold transition-all active:scale-95">
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </div>
  );
}