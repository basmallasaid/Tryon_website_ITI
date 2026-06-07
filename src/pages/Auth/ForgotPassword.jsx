import React from "react";

export default function ForgotPassword({ isVisible, onForgot, onBackToLogin, inModal }) {
  return (
    <div className={`absolute right-0 top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ${
      isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
    } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'}`}>
      <div className="mx-auto w-full max-w-md">
        <h2 className={`font-bold text-black ${inModal ? 'text-2xl' : 'text-3xl'}`}>Forgot Password?</h2>
        <p className={`mt-2 text-gray-500 leading-relaxed ${inModal ? 'mb-6 text-sm' : 'mb-8'}`}>
          No worries! It happens to the best of us. Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
        <form onSubmit={onForgot} className={inModal ? 'space-y-3' : 'space-y-4'}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">Email</label>
            <input name="email" type="email" placeholder="enter your email" required className={`w-full rounded-xl border border-gray-300 text-sm outline-none ${inModal ? 'p-3' : 'p-4'}`} />
          </div>
          <button type="submit" className={`w-full rounded-xl bg-[#40B9FF] font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#89D4FF] ${inModal ? 'py-3' : 'py-4'}`}>Send Reset Link</button>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
            <span className="text-xs font-bold text-[#40B9FF]">OR</span>
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
          </div>

          <p className="text-center text-xs text-gray-400">Didn't receive the email? Check your spam folder</p>

          <p className="text-center text-xs text-gray-400">
            <button type="button" className="font-semibold text-gray-400 hover:text-gray-600">Try a different email address</button>
          </p>

          <div className="pt-2 text-center">
            <button type="button" onClick={onBackToLogin} className="inline-flex items-center gap-1 font-semibold text-[#A6E22E] border-b border-[#A6E22E] pb-0.5 text-sm hover:opacity-80">
              <span>←</span> Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
