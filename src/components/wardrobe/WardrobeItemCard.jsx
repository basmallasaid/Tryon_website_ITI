import React from 'react';

const WardrobeItemCard = ({ item, onClick }) => (
  <div 
    onClick={() => onClick(item)}
    className="group relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-50"
  >
    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
    <div className="absolute bottom-6 left-6 rtl:right-6 text-white">
      <p className="text-xs font-black opacity-60 tracking-widest mb-1 uppercase">{item.category}</p>
      <h3 className="text-lg font-bold">{item.name}</h3>
    </div>
  </div>
);

export default WardrobeItemCard;