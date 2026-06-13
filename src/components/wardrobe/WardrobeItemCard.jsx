import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

const WardrobeItemCard = ({ item, onClick }) => {
  const { isFavorite, addItem, removeItem } = useFavorites();
  const favorited = isFavorite(item._id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (favorited) {
      removeItem(item._id);
    } else {
      addItem(item._id, 'WARDROBE');
    }
  };

  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-50"
    >
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      <button
        onClick={handleFavorite}
        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 hover:scale-110 z-10 cursor-pointer"
      >
        <Heart
          size={18}
          className={favorited ? 'fill-accent-pink text-accent-pink' : 'text-gray-500'}
        />
      </button>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-6 left-6 rtl:right-6 text-white">
        <p className="text-xs font-black opacity-60 tracking-widest mb-1 uppercase">{item.category}</p>
        <h3 className="text-lg font-bold">{item.name}</h3>
    </div>
  );
};

export default WardrobeItemCard;