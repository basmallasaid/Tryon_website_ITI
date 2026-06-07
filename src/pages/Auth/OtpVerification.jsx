import React, { useState, useRef, useEffect } from "react";

export default function OtpVerification({ isVisible, email, onVerify, onBackToLogin, inModal }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isVisible) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isVisible]);

  const handleChange = (index, value) => {
    if (value && !value.match(/^\d$/)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp.join(""));
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const maskEmail = (email) => {
    if (!email) return "your email";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className={`absolute left-0 top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ${
      isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
    } ${inModal ? "p-6 md:p-10" : "p-8 md:p-16"}`}>
      <div className="mx-auto w-full max-w-md">
        <h2 className={`font-bold text-black ${inModal ? "text-2xl" : "text-3xl"}`}>Enter Verification Code</h2>
        <p className={`mt-2 text-gray-500 leading-relaxed ${inModal ? "mb-6 text-sm" : "mb-8"}`}>
          We sent a 6-digit code to your email {maskEmail(email)}. Enter it below to proceed.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-6 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-[52px] h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all duration-200 ${
                  digit
                    ? "bg-[#f1f8e9] border-2 border-[#A6E22E] text-gray-800"
                    : "bg-[#f0f3ff] border-2 border-transparent focus:bg-white focus:border-[#A6E22E]"
                } ${inModal ? 'w-[46px] h-12 text-xl' : 'w-[52px] h-14 text-2xl'}`}
              />
            ))}
          </div>

          <button type="submit" className={`w-full rounded-xl bg-[#40B9FF] font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#89D4FF] inline-flex items-center justify-center gap-2 ${inModal ? "py-3" : "py-4"}`}>
            Verify & Continue <span>→</span>
          </button>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-semibold text-gray-700">
              Didn't receive the code?{" "}
              <button type="button" className="underline hover:text-gray-900">Resend Code</button>
            </p>

            <p className={`text-sm font-semibold ${timeLeft > 0 ? "text-[#FF7E41]" : "text-gray-400"}`}>
              Request a new code in {formatTime(timeLeft)}
            </p>

            <div className="pt-2">
              <button type="button" onClick={onBackToLogin} className="inline-flex items-center gap-1 font-semibold text-[#A6E22E] border-b border-[#A6E22E] pb-0.5 text-sm hover:opacity-80">
                <span>←</span> Back to Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
