import React from 'react';
import { useTranslation } from 'react-i18next';

const WardrobeFilters = ({ categories, activeFilter, onFilterChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={`px-10 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
            activeFilter?.toLowerCase() === cat.toLowerCase()
            ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 scale-105'
            : 'bg-surface-elevated text-text-secondary border border-[var(--border)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          {cat === 'All' ? t('wardrobe.all') : t('wardrobe.opt_' + cat.toLowerCase(), cat)}
        </button>
      ))}
    </div>
  );
};

export default WardrobeFilters;