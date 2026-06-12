import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, CloudSun, Palette, Layers, User, Sparkles, PenLine } from 'lucide-react';

const ColorDot = ({ color }) => (
  <span
    className="inline-block w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 shadow-sm"
    style={{ backgroundColor: color?.toLowerCase() || '#ccc' }}
  />
);

const ItemDetailsModal = ({ item, onClose, onDelete, isArabic }) => {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] md:max-h-none rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 border border-gray-100 md:overflow-hidden overflow-y-auto">
        
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 shadow-md md:hidden"
        >
          <X size={18} />
        </button>

        {/* Left Side: Image Section */}
        <div className="md:w-[40%] md:min-h-[500px] bg-gray-50 overflow-hidden relative group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right Side: Details Section */}
        <div className="md:w-[60%] p-5 md:p-8 flex flex-col justify-between bg-white">
          {/* Close Button Desktop */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 transition-all"
          >
            <X size={24} />
          </button>

          <div>
            {/* Header */}
            <div className="mb-6 md:mb-8 md:pr-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 md:w-8 h-1 bg-[var(--color-brand-secondary)] rounded-full" />
                <span className="text-[var(--color-brand-secondary)] font-black tracking-widest uppercase text-[10px] md:text-[11px]">
                  {isArabic ? 'تفاصيل القطعة' : 'Item Details'}
                </span>
              </div>
              <h2 className="text-lg md:text-2xl font-black text-gray-900 ">
                {item.name}
              </h2>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 max-[400px]:grid-cols-1 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6">
              <DetailRow
                icon={<ShoppingBag size={18} />}
                label={isArabic ? 'التصنيف' : 'Category'}
                value={item.category}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<CloudSun size={18} />}
                label={isArabic ? 'الموسم' : 'Season'}
                value={Array.isArray(item.season) ? item.season.join(', ') : item.season}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<Sparkles size={18} />}
                label={isArabic ? 'الستايل' : 'Style'}
                value={item.style || '-'}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<Palette size={18} />}
                label={isArabic ? 'اللون' : 'Color'}
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
                label={isArabic ? 'النقش' : 'Pattern'}
                value={item.pattern || '-'}
                color="var(--color-primary)"
              />
              <DetailRow
                icon={<User size={18} />}
                label={isArabic ? 'الجنس' : 'Gender'}
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
                className="p-3 md:p-4 bg-rose-50 text-[var(--color-accent-orange)] rounded-xl md:rounded-2xl hover:bg-rose-100 transition-all hover:scale-105 active:scale-95"
                title={isArabic ? 'حذف' : 'Delete'}
              >
                <Trash2 size={18} className="md:w-[22px] md:h-[22px]" />
              </button>
            )}
            <button
              onClick={() => { onClose(); navigate(`/wardeobe/edit/${item._id}`); }}
              className="flex-1 bg-[var(--color-primary)] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98]"
            >
              <PenLine size={16} className="md:w-[20px] md:h-[20px]" />
              <span className="text-xs md:text-sm tracking-wide">{isArabic ? 'تعديل البيانات' : 'EDIT PIECE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, color, customColor }) => (
  <div className="flex items-start gap-2.5 md:gap-3.5 group">
    {/* Icon Container */}
    <div 
      className="p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-300 bg-gray-50 text-gray-400 group-hover:shadow-sm"
      style={{ 
        color: customColor ? customColor.toLowerCase() : (color || 'inherit'),
        backgroundColor: customColor ? `${customColor}15` : `${color}15` 
      }}
    >
      {icon}
    </div>
    
    {/* Label & Value */}
    <div className="flex flex-col min-w-0 pt-0.5">
      <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">
        {label}
      </span>
      <div className="text-xs md:text-sm font-bold text-gray-700 capitalize truncate">
        {value}
      </div>
    </div>
  </div>
);

export default ItemDetailsModal;