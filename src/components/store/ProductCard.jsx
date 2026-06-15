import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../../context/FavoritesContext';
import MatchWardrobePopup from './MatchWardrobePopup'; 

const getProductId = (product) => product._id?.$oid || product._id || product.id;

const ProductCard = ({ product, store, viewMode, hasMatches, matches }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { isFavorite, addItem, removeItem } = useFavorites();
  const productId = getProductId(product);
  const favorited = isFavorite(productId);
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [matchError, setMatchError] = useState(null);
  
  const isArabic = i18n.language === "ar";
  const displayName = isArabic && product.name_ar ? product.name_ar : product.name;
  const brandName = store?.name || 'Brand';
  const imageUrl = product.images?.[0] ;

  const isList = viewMode === 'list';

  const handleSeeMatch = () => {
    setIsMatchOpen(true);
  };

  const handleTryOn = () => {
    navigate('/tryOn', { state: { productImage: imageUrl, productName: displayName } });
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (favorited) {
      removeItem(productId);
    } else {
      addItem(productId, 'PRODUCT');
    }
  };

  return (
    <>
      <div className={`group relative flex bg-surface-elevated rounded-[2rem] border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${isArabic ? 'rtl' : 'ltr'} ${
        isList ? 'flex-row h-64 w-full' : 'flex-col h-full'
      }`}>
        
        {/* Image Container */}
        <div className={`relative bg-[var(--bg-secondary)] overflow-hidden flex-shrink-0 transition-all duration-500 ${
          isList ? 'w-48 md:w-64 h-full' : 'aspect-[4/5] w-full'
        }`}>
          <div className="absolute top-4 z-20 flex w-full px-4 items-start">
              {hasMatches === true && matches?.length > 0 && (
                <span className="bg-[var(--color-brand-secondary)] text-white text-[10px] px-3 py-1.5 rounded-full shadow-sm font-bold uppercase tracking-wider">
                    {t("stores.matchWardrobe")}
                </span>
              )}
              <button
                  onClick={handleFavorite}
                  className={`ms-auto p-2 bg-white/90 backdrop-blur-md rounded-full transition-all shadow-sm hover:scale-110 ${favorited ? 'text-accent-pink' : 'text-text-disabled hover:text-accent-pink'}`}
              >
                  <Heart size={20} className={favorited ? 'fill-accent-pink' : ''} />
              </button>
          </div>
          <img src={imageUrl} alt={displayName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <a href={product.purchase_url || "#"} target="_blank" rel="noreferrer" className="absolute inset-0 bg-overlay backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-white font-black">{t("stores.viewStore")}<ArrowRight size={22} className={isArabic ? 'rotate-180' : ''} /></div>
          </a>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="text-[17px] font-black text-text-primary leading-tight truncate">{displayName}</h3>
              <span className="text-[17px] font-black text-text-primary whitespace-nowrap">{product.price} {product.currency || 'EGP'}</span>
            </div>
            <p className="text-text-disabled text-sm font-bold uppercase tracking-wider mb-4">{brandName}</p>
          </div>

          <div className="flex items-center gap-8">
            {hasMatches === true && matches?.length > 0 && (
              <button 
                onClick={handleSeeMatch}
                className="flex-1 bg-[var(--color-brand-secondary)] text-white py-3 rounded-[8px] text-[13px] font-black hover:bg-[var(--secondary)] transition-all shadow-md shadow-[var(--accent-light)]"
              >
                {t("stores.seeMatch")}
              </button>
            )}
            <button onClick={handleTryOn} className="flex-1 flex items-center justify-center gap-2 bg-[var(--Primary-Brand-color)] text-white py-3 rounded-[8px] text-[13px] font-black hover:bg-[var(--color-primary-hover)] transition-all shadow-md shadow-[var(--primary-light)]/30 group/tryon">
              <Sparkles size={16} className="group-hover/tryon:rotate-12 transition-transform" />
              {t("stores.tryOn")}
            </button>
          </div>
        </div>
      </div>

      <MatchWardrobePopup 
        isOpen={isMatchOpen} 
        onClose={() => { setIsMatchOpen(false); setMatchError(null); }} 
        isArabic={isArabic}
        matches={matches || []} 
        loading={false} 
        error={matchError}
      />
    </>
  );
};

export default ProductCard;