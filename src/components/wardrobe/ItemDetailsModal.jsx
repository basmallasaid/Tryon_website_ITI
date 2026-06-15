import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, CloudSun, Palette, Layers, User, Sparkles, PenLine } from 'lucide-react';

const ColorDot = ({ color }) => (
  <span
    className="inline-block w-3 h-3 rounded-full border border-[var(--border)] flex-shrink-0 shadow-sm"
    style={{ backgroundColor: color?.toLowerCase() || 'var(--border)' }}
  />
);

const ItemDetailsModal = ({ item, onClose, onDelete }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-surface-elevated w-full max-w-3xl max-h-[90vh] md:max-h-none rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 border border-[var(--border)] md:overflow-hidden overflow-y-auto">
        
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rtl:left-3 z-20 p-1.5 bg-surface-elevated/90 backdrop-blur-sm rounded-full text-text-secondary shadow-md md:hidden"
        >
          <X size={18} />
        </button>

        {/* Left Side: Image Section */}
        <div className="md:w-[40%] md:min-h-[500px] bg-[var(--bg-secondary)] overflow-hidden relative group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right Side: Details Section */}
        <div className="md:w-[60%] p-5 md:p-8 flex flex-col justify-between bg-surface-elevated">
          {/* Close Button Desktop */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 rtl:left-6 p-2 hover:bg-[var(--bg-secondary)] rounded-full text-text-disabled hover:text-text-primary transition-all"
          >
            <X size={24} />
          </button>

          <div>
            {/* Header */}
            <div className="mb-6 md:mb-8 pr-6 rtl:pl-6">
              <div className="flex items-center gap-2 rtl:flex-row-reverse mb-2">
                <div className="w-6 md:w-8 h-1 bg-[var(--color-brand-secondary)] rounded-full" />
                <span className="text-[var(--color-brand-secondary)] font-black tracking-widest uppercase text-[10px] md:text-[11px]">
                  {t('wardrobe.itemDetails')}
                </span>
              </div>
              <h2 className="text-lg md:text-2xl font-black text-text-primary ">
                {item.name}
              </h2>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 max-[400px]:grid-cols-1 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6">
              <DetailRow
                icon={<ShoppingBag size={18} />}
                label={t('wardrobe.category')}
                value={item.category}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<CloudSun size={18} />}
                label={t('wardrobe.season')}
                value={Array.isArray(item.season) ? item.season.join(', ') : item.season}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<Sparkles size={18} />}
                label={t('wardrobe.style')}
                value={item.style || '-'}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<Palette size={18} />}
                label={t('wardrobe.color')}
                value={
                  <span className="flex items-center gap-2">
                    <ColorDot color={item.color} />
                    {item.color}
                  </span>
                }
                customColor={item.color}
              />
              <DetailRow
                icon={<Layers size={18} />}
                label={t('wardrobe.pattern')}
                value={item.pattern || '-'}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<User size={18} />}
                label={t('wardrobe.gender')}
                value={item.gender || '-'}
                color="var(--color-primary)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 md:gap-4 mt-6 md:mt-10">
            {onDelete && (
              <button
                onClick={() => onDelete(item._id)}
                className="p-3 md:p-4 text-[var(--color-accent-orange)] rounded-xl md:rounded-2xl hover:opacity-80 transition-all hover:scale-105 active:scale-95"
                title={t('wardrobe.delete')}
              >
                <Trash2 size={18} className="md:w-[22px] md:h-[22px]" />
              </button>
            )}
            <button
              onClick={() => { onClose(); navigate(`/wardrobe/edit/${item._id}`); }}
              className="flex-1 bg-[var(--color-primary)] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-[var(--border)] hover:shadow-[var(--border)] transition-all flex items-center justify-center gap-2 md:gap-3 rtl:flex-row-reverse active:scale-[0.98]"
            >
              <PenLine size={16} className="md:w-[20px] md:h-[20px]" />
              <span className="text-xs md:text-sm tracking-wide">{t('wardrobe.view')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, color, customColor }) => (
  <div className="flex items-start gap-2.5 md:gap-3.5 rtl:flex-row-reverse group">
    {/* Icon Container */}
    <div 
      className="p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-300 bg-[var(--bg-secondary)] text-text-disabled group-hover:shadow-sm"
      style={{ 
        color: customColor ? customColor.toLowerCase() : (color || 'inherit'),
        backgroundColor: customColor ? `${customColor}15` : `${color}15` 
      }}
    >
      {icon}
    </div>
    
    {/* Label & Value */}
    <div className="flex flex-col min-w-0 pt-0.5">
      <span className="text-[9px] md:text-[10px] font-bold text-text-disabled uppercase tracking-tighter mb-0.5">
        {label}
      </span>
      <div className="text-xs md:text-sm font-bold text-text-primary capitalize truncate">
        {value}
      </div>
    </div>
  </div>
);

export default ItemDetailsModal;
