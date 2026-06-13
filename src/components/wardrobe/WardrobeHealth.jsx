import React from 'react';
import { Sparkles, Shirt } from 'lucide-react';

const WardrobeHealth = ({ itemCount }) => (
  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex items-center gap-8 relative overflow-hidden">
    <div className="p-5 bg-[var(--color-brand-secondary)] rounded-2xl text-white shadow-lg shadow-lime-100">
      <Sparkles size={32} />
    </div>
    <div className="z-10">
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Wardrobe Health</h1>
      <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">
        You have {itemCount} items synced. 85% match your current minimalist aesthetic profile. 
        Your most worn color this month is <span className="text-gray-900 font-bold underline decoration-[#8ED321]">Slate Gray</span>.
      </p>
    </div>
  </div>
);

export default WardrobeHealth;