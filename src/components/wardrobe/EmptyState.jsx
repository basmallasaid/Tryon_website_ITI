import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyState = ({ onAdd }) => {
  const { t } = useTranslation();
  return (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="relative mb-12">
      {/* هالة خلفية ناعمة */}
      <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-full blur-3xl scale-150 animate-pulse" />
      
      {/* صورة الـ UFO كما طلبت */}
      <img 
        src="/ufo-empty.png" 
        alt="Empty Wardrobe" 
        className="w-72 md:w-96 h-auto relative z-10 drop-shadow-2xl" 
      />
    </div>

    <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-3 tracking-tight">
      {t('wardrobe.empty')}
    </h2>
    <p className="text-text-disabled font-medium text-lg mb-10 max-w-sm">
      {t('wardrobe.emptyDesc')}
    </p>

    <button 
      onClick={onAdd}
      className="bg-[var(--primary)] text-white px-14 py-4 rounded-[1.5rem] font-black shadow-xl hover:scale-105 hover:brightness-90 transition-all active:scale-95 uppercase tracking-widest text-sm"
    >
      {t('wardrobe.addFirstItem')}
    </button>
  </div>
  );
};

export default EmptyState;