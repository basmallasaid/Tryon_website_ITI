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
            ? 'bg-[#40B9FF] text-white shadow-lg shadow-blue-100 scale-105'
            : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          {cat === 'All' ? t('wardrobe.all') : t('wardrobe.opt_' + cat.toLowerCase(), cat)}
        </button>
      ))}
    </div>
  );
};

export default WardrobeFilters;