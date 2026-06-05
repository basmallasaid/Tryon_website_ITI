import React, { useState } from "react";

export default function RegisterForm({ isVisible, onRegister, toggleAuth }) {
  return (
    <div className={`absolute right-0 top-0 flex h-full w-full flex-col justify-center p-8 transition-all duration-700 md:w-[60%] md:p-16 ${
      !isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
    }`}>
      <div className="mx-auto w-full max-w-md">
        <h2 className="text-3xl font-bold text-black">Create Your Style Profile</h2>
        <p className="mb-8 mt-2 text-gray-500">Start building your personalized wardrobe</p>
        <form onSubmit={onRegister} className="space-y-4">
          <div className="flex gap-4">
            <input name="fname" placeholder="First name" required className="w-1/2 rounded-xl border border-gray-300 p-4 text-sm outline-none" />
            <input name="lname" placeholder="Last name" required className="w-1/2 rounded-xl border border-gray-300 p-4 text-sm outline-none" />
          </div>
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-xl border border-gray-300 p-4 text-sm outline-none" />
          <input name="password" type="password" placeholder="Password" required className="w-full rounded-xl border border-gray-300 p-4 text-sm outline-none" />
          <input name="confirmPassword" type="password" placeholder="Confirm password" required className="w-full rounded-xl border border-gray-300 p-4 text-sm outline-none" />
          <button type="submit" className="w-full rounded-xl bg-[#40B9FF] py-4 font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#89D4FF]">Create Account</button>
          
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
            <span className="text-xs font-bold text-[#40B9FF]">OR</span>
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
          </div>

          <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-4 font-bold text-black transition-all hover:bg-gray-50">
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-4 text-center text-xs text-gray-600">
            Already have account?{" "}
            <button type="button" onClick={toggleAuth} className="font-bold text-[#40B9FF] hover:underline">login now</button>
          </p>
        </form>
      </div>
    </div>
  );
}