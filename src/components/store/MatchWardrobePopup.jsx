import React from 'react';
import { X } from 'lucide-react';

const MatchWardrobePopup = ({ isOpen, onClose, isArabic }) => {
  if (!isOpen) return null;

  const matches = [
    { id: 1, name: isArabic ? 'بلوزة سوداء' : 'Black blouse', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
    { id: 2, name: isArabic ? 'بلوزة سوداء' : 'Black blouse', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
    { id: 3, name: isArabic ? 'بلوزة سوداء' : 'Black blouse', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
    { id: 4, name: isArabic ? 'بلوزة سوداء' : 'Black blouse', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className={`relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl transition-all scale-in-center ${isArabic ? 'rtl' : 'ltr'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {isArabic ? 'مطابقة من الخزانة' : 'Match from wardrobe'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-2 gap-6">
          {matches.map((item) => (
            <div 
              key={item.id} 
              className="relative p-1 rounded-[1.5rem] border-2 border-transparent bg-origin-border"
              style={{
                background: 'linear-gradient(white, white) padding-box, linear-gradient(to bottom right, #FFA35C, #8ED321) border-box'
              }}
            >
              <div className="flex flex-col items-center p-4">
                <div className="w-full aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50">
                   <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <span className="text-lg font-black text-gray-900">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchWardrobePopup;