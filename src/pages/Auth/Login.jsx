import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ isVisible, onLogin, onForgot, inModal }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`absolute left-0 top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ${
      isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
    } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'}`}>
      <div className="mx-auto w-full max-w-md">
        <h2 className={`font-bold text-black ${inModal ? 'text-3xl' : 'text-4xl'}`}>Login</h2>
        <p className={`mt-2 font-semibold text-gray-500 ${inModal ? 'mb-6 text-sm' : 'mb-10'}`}>Continue your styling Journey</p>
        <form onSubmit={onLogin} className={inModal ? 'space-y-3' : 'space-y-6'}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">Email</label>
            <input name="email" type="email" placeholder="enter your email" required className={`w-full rounded-xl border border-gray-300 text-sm focus:border-[#40B9FF] outline-none ${inModal ? 'p-3' : 'p-4'}`} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="create strong password"
                required
                className={`w-full rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:border-[#40B9FF] focus:outline-none ${inModal ? 'p-3' : 'p-4'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right">
              <button type="button" onClick={onForgot} className="text-xs font-semibold text-[#40B9FF] hover:underline">Forget password</button>
            </div>
          </div>
          <button type="submit" className={`w-full rounded-xl bg-[#40B9FF] font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#89D4FF] ${inModal ? 'py-3' : 'py-4'}`}>login</button>
          
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
            <span className="text-xs font-bold text-[#40B9FF]">OR</span>
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
          </div>

          <button type="button" className={`flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 font-bold text-black transition-all hover:bg-gray-50 ${inModal ? 'py-3' : 'py-4'}`}>
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}