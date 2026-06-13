import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, CloudSun, Palette, Layers, User, Sparkles, Eye } from 'lucide-react';

const ColorDot = ({ color }) => (
  <span
    className="inline-block w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 shadow-sm"
    style={{ backgroundColor: color?.toLowerCase() || '#ccc' }}
  />
);

const ItemDetailsModal = ({ item, onClose, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 border border-gray-100">
        
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 shadow-md md:hidden"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image Section */}
        <div className="md:w-[40%] bg-gray-50 overflow-hidden relative group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right Side: Details Section */}
        <div className="md:w-[60%] p-6 md:p-8 flex flex-col justify-between bg-white">
          {/* Close Button Desktop */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 transition-all"
          >
            <X size={24} />
          </button>

          <div>
            {/* Header */}
            <div className="mb-8 pr-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-[var(--color-brand-secondary)] rounded-full" />
                <span className="text-[var(--color-brand-secondary)] font-black tracking-widest uppercase text-[11px]">
                  {t('wardrobe.itemDetails')}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 ">
                {item.name}
              </h2>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
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
          <div className="flex items-center gap-4 mt-10">
            {onDelete && (
              <button
                onClick={() => onDelete(item._id)}
                className="p-4 bg-rose-50 text-[var(--color-accent-orange)] rounded-2xl hover:bg-rose-100 transition-all hover:scale-105 active:scale-95"
                title={t('wardrobe.delete')}
              >
                <Trash2 size={22} />
              </button>
            )}
            <button
              onClick={() => { onClose(); navigate(`/wardrobe/edit/${item._id}`); }}
              className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-200  hover:shadow-gray-300 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Eye size={20} />
              <span className="text-sm tracking-wide">{t('wardrobe.view')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, color, customColor }) => (
  <div className="flex items-start gap-3.5 group">
    {/* Icon Container */}
    <div 
      className="p-2.5 rounded-xl transition-all duration-300 bg-gray-50 text-gray-400 group-hover:shadow-sm"
      style={{ 
        color: customColor ? customColor.toLowerCase() : (color || 'inherit'),
        backgroundColor: customColor ? `${customColor}15` : `${color}15` 
      }}
    >
      {icon}
    </div>
    
    {/* Label & Value */}
    <div className="flex flex-col min-w-0 pt-0.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">
        {label}
      </span>
      <div className="text-sm font-bold text-gray-700 capitalize truncate">
        {value}
      </div>
    </div>
  </div>
);

export default ItemDetailsModal;