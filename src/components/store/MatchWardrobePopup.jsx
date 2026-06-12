import React from 'react';
import { X, Loader2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

const ColorDot = ({ color }) => (
  <span
    className="inline-block w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
    style={{ backgroundColor: color?.toLowerCase() || '#ccc' }}
  />
);

const MatchWardrobePopup = ({ isOpen, onClose, isArabic, matches, loading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay with Glassmorphism */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Main Popup Content */}
      <div className={`relative bg-[#FEFEFE] w-full max-w-4xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden transition-all duration-500 scale-in-center ${isArabic ? 'rtl' : 'ltr'}`}>
        
        {/* Top Header Section */}
        <div className="flex justify-between items-center px-10 py-8 border-b border-gray-50">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-[var(--color-brand-secondary)]/10 rounded-2xl">
                <Sparkles size={22} className="text-[var(--color-brand-secondary)]" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                    {isArabic ? 'مطابقة من الخزانة' : 'Match from wardrobe'}
                </h2>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest opacity-70">
                    {isArabic ? 'بناءً على ذكاء الأنماط' : 'Based on style intelligence'}
                </p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-300 text-gray-400 hover:text-gray-900 hover:rotate-90"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dynamic Body Content */}
        <div className="p-8">
            {loading ? (
            /* Premium Loading State */
            <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-[var(--color-brand-secondary)] animate-spin" strokeWidth={3} />
                    <div className="absolute inset-0 bg-[var(--color-brand-secondary)]/10 animate-ping rounded-full"></div>
                </div>
                <p className="text-gray-500 font-black mt-6 tracking-tight">
                    {isArabic ? 'جاري البحث في خزانتك...' : 'SEARCHING YOUR WARDROBE...'}
                </p>
            </div>
            ) : error ? (
            /* Clean Error State */
            <div className="flex flex-col items-center justify-center py-20 bg-rose-50/50 rounded-[2rem] border border-rose-100">
                <AlertCircle size={48} className="text-rose-400 mb-4" />
                <p className="text-rose-600 font-black text-lg uppercase tracking-tight">{isArabic ? 'فشل الاتصال' : 'Connection Failed'}</p>
                <p className="text-rose-400 text-xs mt-2 font-bold opacity-80">{error}</p>
            </div>
            ) : matches.length === 0 ? (
            /* Minimalist Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <X size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-black text-lg tracking-tight">
                    {isArabic ? 'لا توجد قطع مطابقة حالياً' : 'NO MATCHING PIECES FOUND'}
                </p>
                <p className="text-gray-400 text-xs font-bold uppercase mt-2 max-w-xs leading-relaxed">
                    Try adding more basics to your wardrobe for better AI suggestions.
                </p>
            </div>
            ) : (
            /* Modern Scrollable Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-3 pl-1 custom-scrollbar pb-4">
                {matches.map((match, index) => (
                <div
                    key={match.item.id || index}
                    className="group relative bg-white p-1 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
                    style={{
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(to bottom right, #FFA35C, #8ED321) border-box',
                    border: '2px solid transparent'
                    }}
                >
                    <div className="flex gap-5 p-5">
                        {/* Image Container */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-gray-50 border border-gray-100/50 group-hover:scale-[1.02] transition-transform duration-500">
                            <img
                                src={match.item.image}
                                alt={match.item.name}
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Match Badge inside image */}
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <span className="text-[14px] font-black text-gray-900">{match.score}</span>
                                <span className="text-[9px] font-black text-gray-400 uppercase">%</span>
                            </div>
                        </div>

                        {/* Content Right */}
                        <div className="flex flex-col flex-grow min-w-0 justify-between py-1">
                            <div className="flex flex-col gap-1.5">
                                <span className="font-black text-gray-900 text-[15px] leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-[var(--color-brand-secondary)] transition-colors">
                                    {match.item.name}
                                </span>
                                
                                {/* Labels Center */}
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
                                        <ColorDot color={match.item.color} />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{match.item.color}</span>
                                    </div>
                                    <div className="px-2.5 py-1 bg-gray-50 rounded-full">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{match.item.style}</span>
                                    </div>
                                </div>
                            </div>

                            {/* View Detail Interaction */}
                            <button className="flex items-center gap-2 text-[10px] font-black text-[var(--color-brand-secondary)] uppercase tracking-[0.1em] mt-auto hover:opacity-70 transition-opacity">
                                {isArabic ? 'رؤية التفاصيل' : 'View Details'}
                                <ChevronRight size={14} strokeWidth={3} className={isArabic ? 'rotate-180' : ''} />
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Subtle Footer Decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FFA35C] via-[#40B9FF] to-[#8ED321] opacity-30"></div>
      </div>
    </div>
  );
};

export default MatchWardrobePopup;