import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Shirt } from 'lucide-react';

const WardrobeHealth = ({ itemCount }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-surface-elevated rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-[var(--border)] flex items-center gap-8 relative overflow-hidden">
      <div className="p-5 bg-[var(--color-brand-secondary)] rounded-2xl text-white shadow-lg shrink-0">
        <Sparkles size={32} />
      </div>
      <div className="z-10 flex-1">
        <h1 className="text-4xl font-black text-text-primary tracking-tight mb-2">{t('wardrobe.health')}</h1>
        <p className="text-text-secondary font-medium max-w-2xl leading-relaxed">
          {t('wardrobe.healthDesc', { count: itemCount })} {t('wardrobe.healthColor')} <span className="text-text-primary font-bold underline decoration-[var(--secondary)]">{t('wardrobe.defaultColor')}</span>.
        </p>
      </div>
    </div>
  );
};

export default WardrobeHealth;