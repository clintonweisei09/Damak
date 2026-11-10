import React from 'react';

export const EnterpriseTicker: React.FC = () => {
  const enterprises = [
    { label: 'Indigenous & Brahma Chickens', icon: '🐓' },
    { label: 'Pedigree Farm Rabbits', icon: '🐇' },
    { label: 'Pearl & Royal Guinea Fowls', icon: '🪶' },
    { label: 'Gentle Farm Cavies (Guinea Pigs)', icon: '🐹' },
    { label: 'Freshwater Tilapia & Catfish Ponds', icon: '🐟' },
    { label: 'Heritage Bourbon Red Turkeys', icon: '🦃' },
    { label: 'Wide Range of Duck Breeds', icon: '🦆' },
    { label: 'Fractal Romanesco & Organic Crops', icon: '🥦' },
    { label: 'Fertile Hatching Eggs Clutches', icon: '🥚' },
    { label: 'Countrywide Delivery Across 47 Counties', icon: '🚚' },
    { label: 'Weekend Farm Gate Visits (Turbo, Eldoret)', icon: '🏡' },
  ];

  return (
    <div className="w-full bg-[#0D381E] border-y border-emerald-700/60 py-3 overflow-hidden select-none">
      <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
        {/* Double array for infinite seamless looping */}
        {[...enterprises, ...enterprises].map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-100 hover:text-white transition-colors"
          >
            <span className="text-sm">{item.icon}</span>
            <span>{item.label}</span>
            <span className="text-emerald-500/60 font-black ml-4">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};
