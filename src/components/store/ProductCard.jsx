import React from 'react';
import { Heart, Sparkles, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, store, viewMode }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const displayName = isArabic && product.name_ar ? product.name_ar : product.name;
  const displayDescription = isArabic && product.description_ar ? product.description_ar : product.description;
  
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x600?text=No+Image';
  const logoUrl = store?.logo_url;
  const brandName = store?.name || 'Brand';

  const isList = viewMode === 'list';

  return (
    <div className={`group relative flex bg-white rounded-[1.5rem] border border-gray-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden ${isArabic ? 'rtl' : 'ltr'} ${
      isList ? 'flex-row h-56 md:h-60 w-full' : 'flex-col h-full'
    }`}>
      
      {/* View Badge - Pill Style */}
      <div className={`absolute top-3 z-10 ${isArabic ? 'right-3' : 'left-3'}`}>
        {product.purchase_url && (
          <a
            href={product.purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-gray-700 text-[9px] font-bold px-2.5 py-1.5 rounded-full shadow-sm hover:bg-[#40B9FF] hover:text-white transition-all duration-300 group/view"
          >
            <span>{isArabic ? 'عرض' : 'VIEW'}</span>
            <ExternalLink size={9} className="group-hover/view:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>

      {/* Wishlist Button */}
      <button className={`absolute top-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-rose-500 transition-all duration-300 shadow-sm ${isArabic ? 'left-3' : 'right-3'}`}>
        <Heart size={16} />
      </button>

      {/* Image Section - Reduced size in list mode */}
      <div className={`relative bg-[#F9FAFB] overflow-hidden flex-shrink-0 transition-all duration-500 ${
        isList ? 'w-36 md:w-52 h-full' : 'aspect-[3/4] w-full'
      }`}>
        <img
          src={imageUrl}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Section */}
      <div className={`p-4 md:p-5 flex flex-col flex-grow ${isList ? 'justify-between py-6' : ''}`}>
        
        <div className="flex flex-col gap-1">
          {/* Product Name - Smaller Font */}
          <h3 className="text-[14px] md:text-base font-bold text-gray-900 truncate tracking-tight group-hover:text-[#40B9FF] transition-colors">
            {displayName}
          </h3>

          {/* Brand Logo - Slimmer Height */}
          <div className={`flex items-center mt-1 ${isList ? 'h-8' : 'h-6'}`}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="h-full object-contain max-w-[60px] grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500"
              />
            ) : (
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{brandName}</span>
            )}
          </div>

          {isList && displayDescription && (
            <p className="text-gray-400 text-[13px] line-clamp-2 max-w-lg mt-2 leading-relaxed hidden md:block">
              {displayDescription}
            </p>
          )}
        </div>

        {/* Bottom Info: Price & Buttons */}
        <div className={`flex items-center justify-between border-t border-gray-50 pt-4 ${isList ? 'mt-0' : 'mt-auto'}`}>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-0.5">
              {product.currency === 'USD' ? 'EGP' : product.currency || 'EGP'}
            </span>
            <span className="text-lg font-black text-gray-900 leading-none tracking-tight">
              {product.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Try-On Button - Refined Padding */}
            <a
              href={product.purchase_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#40B9FF]/10 text-[#40B9FF] px-4 py-2 rounded-xl text-[11px] font-black hover:bg-[#40B9FF] hover:text-white transition-all duration-300 group/tryon shadow-sm shadow-[#40B9FF]/5"
            >
              <Sparkles size={13} className="group-hover/tryon:rotate-12 transition-transform" />
              {isArabic ? 'تجربة' : 'TRY-ON'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
