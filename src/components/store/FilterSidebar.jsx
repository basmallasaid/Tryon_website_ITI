import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true); 

  return (
    <div className="group border-b border-gray-100/60 py-6 last:border-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between mb-2 cursor-pointer group-hover:opacity-80 transition-opacity"
      >
        <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.15em]">
          {title}
        </h3>
        <ChevronDown
          size={14}
          className={`text-gray-300 transition-transform duration-300 ${
            isOpen ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>

     
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen 
            ? "grid-rows-[1fr] opacity-100 mt-4" 
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({
  options,
  filters,
  setFilters,
  maxPriceLimit,
  products,
}) => {
  const { t } = useTranslation();
  
  const toggleArrayFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((i) => i !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="w-full xl:w-80 bg-[#FEFEFE] rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-fit xl:sticky xl:top-8 border border-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#40B9FF]/10 rounded-lg text-[#40B9FF]">
            <SlidersHorizontal size={18} />
          </div>

          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {t("stores.filters")}
          </h2>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-[10px] font-black text-gray-400 hover:text-[#40B9FF] transition-colors uppercase tracking-widest"
        >
          {t("stores.reset")}
        </button>
      </div>

      {/* Categories */}
      <FilterSection title={t("stores.categories")}>
        <div className="space-y-3.5">
          {options.categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group/label"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.includes(cat)}
                  onChange={() =>
                    toggleArrayFilter('selectedCategories', cat)
                  }
                  className="peer appearance-none w-5 h-5 rounded-lg border-2 border-gray-100 checked:bg-[#40B9FF] checked:border-[#40B9FF] transition-all duration-300 cursor-pointer"
                />

                <Check
                  className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  strokeWidth={4}
                />
              </div>

              <span className="text-[13px] font-bold text-gray-500 group-hover:label:text-gray-900 capitalize transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title={t("stores.brands")}>
        <div className="space-y-3.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {options.brands.map((b) => (
            <label
              key={b.id}
              className="flex items-center gap-3 cursor-pointer group/label"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={filters.selectedBrands.includes(b.id)}
                  onChange={() => toggleArrayFilter('selectedBrands', b.id)}
                  className="peer appearance-none w-5 h-5 rounded-lg border-2 border-gray-100 checked:bg-[#40B9FF] checked:border-[#40B9FF] transition-all duration-300 cursor-pointer"
                />

                <Check
                  className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  strokeWidth={4}
                />
              </div>

              <span className="text-[13px] font-bold text-gray-500 group-hover:label:text-gray-900 transition-colors">
                {b.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title={t("stores.colors")}>
        <div className="flex flex-wrap gap-3">
          {options.colors.map((color) => {
            const isActive = filters.selectedColors.includes(color);

            return (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() =>
                  toggleArrayFilter('selectedColors', color)
                }
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-sm
                ${
                  isActive
                    ? 'border-[#40B9FF] scale-110 shadow-lg shadow-[#40B9FF]/20'
                    : 'border-white hover:border-gray-200'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              >
                {isActive && (
                  <Check
                    size={12}
                    className={
                      color.toLowerCase() === 'white' ||
                      color.toLowerCase() === 'beige'
                        ? 'text-black'
                        : 'text-white'
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Seasons */}
      <FilterSection title={t("stores.season")}>
        <div className="flex flex-wrap gap-2">
          {options.seasons.map((season) => (
            <button
              key={season}
              onClick={() =>
                toggleArrayFilter('selectedSeasons', season)
              }
              className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all duration-300
              ${
                filters.selectedSeasons.includes(season)
                  ? 'bg-[#40B9FF] border-[#40B9FF] text-white shadow-md shadow-[#40B9FF]/20'
                  : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
              }`}
            >
              {season.toUpperCase()}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title={t("stores.priceRange")}>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max={maxPriceLimit}
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                maxPrice: parseInt(e.target.value),
              }))
            }
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#40B9FF]"
          />

          <div className="flex justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-300 uppercase">
                {t("stores.limit")}
              </span>

              <span className="text-[13px] font-black text-gray-400 tracking-tighter">
                0
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-300 uppercase">
                {t("stores.current")}
              </span>

              <span className="text-[13px] font-black text-[#40B9FF] tracking-tighter">
                {filters.maxPrice}
                <small className="text-[10px] opacity-60 font-bold ml-1">
                  {products?.[0]?.currency || 'EGP'}
                </small>
              </span>
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;