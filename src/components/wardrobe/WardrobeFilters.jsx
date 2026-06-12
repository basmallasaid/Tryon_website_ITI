import React from 'react';

const WardrobeFilters = ({ categories, activeFilter, onFilterChange }) => (
  <div className="flex flex-wrap gap-4">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onFilterChange(cat)}
        className={`px-10 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
          // المقارنة هنا أصبحت تحول النص لـ lowercase لضمان الدقة
          activeFilter?.toLowerCase() === cat.toLowerCase() 
          ? 'bg-[#40B9FF] text-white shadow-lg shadow-blue-100 scale-105' 
          : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
        }`}
      >
        {cat.toUpperCase()} {/* عرض النص بحروف كبيرة لشكل أجمل */}
      </button>
    ))}
  </div>
);

export default WardrobeFilters;