import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Sparkles,
  Scissors,
  Compass
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFDFF] px-6 font-sans">
      
      {/* عناصر زخرفية خلفية مستوحاة من اللوجو */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full border-[20px] border-dashed border-[#40B9FF]/5 animate-[spin_60s_linear_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full border-[15px] border-dashed border-[#8ED321]/5 animate-[spin_40s_linear_infinite_reverse]"></div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        
        {/* اللوجو في الأعلى */}
        <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
           <img src="/logo.svg" alt="Redolapy Logo" className="h-14 md:h-20" />
        </div>

        {/* منطقة الـ 404 */}
        <div className="relative inline-block mb-8">
           <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-[#101828]">
             404
           </h1>
           {/* خط منقط يشبه اللوجو يمر عبر الرقم */}
           <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full pointer-events-none overflow-visible">
              <path 
                d="M-50,50 Q100,-20 250,50 T550,50" 
                fill="none" 
                stroke="#40B9FF" 
                strokeWidth="4" 
                strokeDasharray="12 8" 
                className="animate-[dash_3s_linear_infinite]"
              />
           </svg>
        </div>

        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">
            We've Lost the Thread!
          </h2>
          
          <p className="text-lg font-medium text-slate-400 mb-12 leading-relaxed">
            Oops! It seems this page has slipped out of our collection. 
            Don't worry, even the best styles need a little adjustment sometimes.
          </p>

          {/* الأزرار بتصميم Redolapy المعتاد */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-[#40B9FF] px-12 py-5 font-black uppercase tracking-widest text-white shadow-xl shadow-[#40B9FF]/20 transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <Home size={20} strokeWidth={3} />
              Back Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-3 rounded-[1.5rem] border-2 border-slate-200 bg-white px-12 py-5 font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            >
              <ArrowLeft size={20} strokeWidth={3} />
              Go Back
            </button>

          </div>
        </div>

        {/* أيقونة خفيفة في الأسفل لتعزيز شكل الـ Fashion */}
        <div className="mt-16 flex items-center justify-center gap-3 text-slate-200">
           <Compass size={24} />
           <div className="h-px w-20 bg-slate-100"></div>
           <Scissors size={24} />
           <div className="h-px w-20 bg-slate-100"></div>
           <Sparkles size={24} />
        </div>
      </div>

      {/* CSS Animation للخط المنقط */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .scale-in-center {
          animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
      `}} />
    </div>
  );
}