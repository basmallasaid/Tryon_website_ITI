import React from 'react';

const EmptyState = ({ onAdd, isArabic }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="relative mb-12">
      {/* هالة خلفية ناعمة */}
      <div className="absolute inset-0 bg-[#40B9FF]/10 rounded-full blur-3xl scale-150 animate-pulse" />
      
      {/* صورة الـ UFO كما طلبت */}
      <img 
        src="/ufo-empty.png" 
        alt="Empty Wardrobe" 
        className="w-72 md:w-96 h-auto relative z-10 drop-shadow-2xl" 
      />
    </div>

    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
      {isArabic ? 'خزانتك فارغة حالياً' : 'Your wardrobe is empty'}
    </h2>
    <p className="text-gray-400 font-medium text-lg mb-10 max-w-sm">
      {isArabic ? 'ابدأ بإضافة ملابسك لتبني خزانتك الرقمية' : 'add clothes to your wardrobe to get start'}
    </p>

    <button 
      onClick={onAdd}
      className="bg-[#40B9FF] text-white px-14 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:scale-105 hover:bg-[#35a8eb] transition-all active:scale-95 uppercase tracking-widest text-sm"
    >
      {isArabic ? 'أضف أول قطعة' : 'Add First Item'}
    </button>
  </div>
);

export default EmptyState;