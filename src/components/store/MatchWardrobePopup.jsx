import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Loader2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

const ColorDot = ({ color }) => (
  <span
    className="inline-block w-2.5 h-2.5 rounded-full ring-2 ring-surface-elevated shadow-sm flex-shrink-0"
    style={{ backgroundColor: color?.toLowerCase() || '#ccc' }}
  />
);

const MatchWardrobePopup = ({ isOpen, onClose, isArabic, matches, loading, error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-overlay backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      
      <div className={`relative bg-surface-elevated w-full max-w-4xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.15)] border border-[var(--border)] overflow-hidden transition-all duration-500 scale-in-center ${isArabic ? 'rtl' : 'ltr'}`}>
        
        <div className="flex justify-between items-center px-10 py-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-[var(--color-brand-secondary)]/10 rounded-2xl">
                <Sparkles size={22} className="text-[var(--color-brand-secondary)]" />
             </div>
             <div>
                 <h2 className="text-2xl font-black text-text-primary tracking-tight leading-none mb-1">
                    {t("stores.matchFromWardrobe")}
                </h2>
                 <p className="text-[11px] text-text-disabled font-bold uppercase tracking-widest opacity-70">
                    {t("stores.styleIntelligence")}
                </p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-[var(--bg-secondary)] hover:bg-[var(--surface)] rounded-full transition-all duration-300 text-text-secondary hover:text-text-primary hover:rotate-90"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8">
            {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-[var(--color-brand-secondary)] animate-spin" strokeWidth={3} />
                    <div className="absolute inset-0 bg-[var(--color-brand-secondary)]/10 animate-ping rounded-full"></div>
                </div>
                <p className="text-text-secondary font-black mt-6 tracking-tight">
                    {t("stores.searchingWardrobe")}
                </p>
            </div>
            ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-error-bg rounded-[2rem] border border-error-border">
                <AlertCircle size={48} className="text-error-text mb-4" />
                <p className="text-error-text font-black text-lg uppercase tracking-tight">{t("stores.connectionFailed")}</p>
                <p className="text-error-text text-xs mt-2 font-bold opacity-80">{error}</p>
            </div>
            ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4">
                    <X size={32} className="text-text-disabled" />
                </div>
                <p className="text-text-secondary font-black text-lg tracking-tight">
                    {t("stores.noMatchingPieces")}
                </p>
                <p className="text-text-secondary text-xs font-bold uppercase mt-2 max-w-xs leading-relaxed">
                    {t("stores.noMatchingHint")}
                </p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-3 pl-1 custom-scrollbar pb-4">
                {matches.map((match, index) => (
                <div
                    key={match.item._id || match.item.id || index}
                    className="group relative bg-surface-elevated p-1 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
                    style={{
                    background: 'linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(to bottom right, #FFA35C, #8ED321) border-box',
                    border: '2px solid transparent'
                    }}
                >
                    <div className="flex gap-5 p-5">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-[var(--bg-secondary)] border border-[var(--border)]/50 group-hover:scale-[1.02] transition-transform duration-500">
                            <img
                                src={match.item.image}
                                alt={match.item.name}
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute top-2 left-2 bg-surface-elevated/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <span className="text-[14px] font-black text-text-primary">{match.score}</span>
                                <span className="text-[9px] font-black text-text-disabled uppercase">%</span>
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow min-w-0 justify-between py-1">
                            <div className="flex flex-col gap-1.5">
                                <span className="font-black text-text-primary text-[15px] leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-[var(--color-brand-secondary)] transition-colors">
                                    {match.item.name}
                                </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-secondary)] rounded-full">
                                        <ColorDot color={match.item.color} />
                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-tighter">{match.item.color}</span>
                                    </div>
                                    <div className="px-2.5 py-1 bg-[var(--bg-secondary)] rounded-full">
                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-tighter">{match.item.style}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. تحديث الزر ليقوم بالتنقل */}
                            <button 
                                onClick={() => {
                                    onClose();
                                    navigate(`/wardrobe/edit/${match.item._id || match.item.id}`);
                                }}
                                className="flex items-center gap-2 text-[10px] font-black text-[var(--color-brand-secondary)] uppercase tracking-[0.1em] mt-auto hover:opacity-70 transition-opacity"
                            >
                                {t("stores.viewDetails")}
                                <ChevronRight size={14} strokeWidth={3} className={isArabic ? 'rotate-180' : ''} />
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        <div className="h-2 w-full bg-gradient-to-r from-[#FFA35C] via-[#40B9FF] to-[#8ED321] opacity-30"></div>
      </div>
    </div>
  );
};

export default MatchWardrobePopup;