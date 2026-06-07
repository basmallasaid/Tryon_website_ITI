import React from 'react';
import { Heart, Sparkles, ExternalLink } from 'lucide-react';

const ProductCard = ({ product, store }) => {
  const imageUrl = product.images?.[0];
  const logoUrl = store?.logo_url;
  const brandName = store?.name || "Brand";

  return (
    <div className="group relative flex flex-col bg-white rounded-[1.5rem] border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      {/* View Badge - Pill Style */}
      <div className="absolute top-4 left-4 z-10">
        {product.purchase_url && (
          <a
            href={product.purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-[#40B9FF] hover:text-white transition-all duration-300 group/view"
          >
            <span>VIEW</span>
            <ExternalLink size={10} className="group-hover/view:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-rose-500 hover:scale-110 transition-all duration-300 shadow-sm border border-gray-50">
        <Heart size={18} />
      </button>

      {/* Image Section */}
      <div className="relative aspect-[3/4] bg-[#F9FAFB] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-[15px] font-bold text-gray-900 truncate tracking-tight mb-1">
          {product.name}
        </h3>
        
        {/* Brand/Store Logo Container */}
        <div className="h-7 flex items-center mb-4 mt-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={brandName} 
              className="h-full object-contain max-w-[40px] grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500" 
            />
          ) : (
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.1em]">{brandName}</span>
          )}
        </div>
        
        {/* Footer: Price & Try-On */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                {product.currency === "USD" ? "EGP" : product.currency}
             </span>
             <span className="text-lg font-black text-gray-900 leading-none tracking-tight">
               {product.price}
             </span>
          </div>
          
          <a 
            href={product.purchase_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#40B9FF]/10 text-[#40B9FF] px-4 py-2 rounded-xl text-[12px] font-extrabold hover:bg-[#40B9FF] hover:text-white transition-all duration-300 group/tryon shadow-sm shadow-[#40B9FF]/5"
          >
            <Sparkles size={14} className="group-hover/tryon:rotate-12 transition-transform" />
            TRY-ON
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;