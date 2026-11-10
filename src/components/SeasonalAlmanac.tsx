import React, { useState } from 'react';
import { Calendar, Sun, CloudRain, Snowflake, Wind, Check, Clock } from 'lucide-react';

interface SeasonalAlmanacProps {
  onOpenFarmGate?: () => void;
}

export const SeasonalAlmanac: React.FC<SeasonalAlmanacProps> = ({ onOpenFarmGate }) => {
  const [selectedSeason, setSelectedSeason] = useState<'autumn' | 'winter' | 'spring' | 'summer'>('autumn');

  const seasons = [
    {
      id: 'autumn',
      name: 'Autumn (In Season Now)',
      icon: Wind,
      badge: 'Peak Harvest',
      crops: [
        'Fractal Romanesco Cauliflower',
        'Purple Majesty Heirloom Fingerlings',
        'Chioggia Candy-Stripe Beets',
        'Rainbow Swiss Chard',
        'Aged 60-Day Black Garlic'
      ],
      livestockFocus: 'Guinea fowl flock field clearing; heritage Bourbon Red turkeys feeding on clover & apples; rabbit hutch winterizing.'
    },
    {
      id: 'winter',
      name: 'Winter',
      icon: Snowflake,
      badge: 'Cold Storage & Root Cellar',
      crops: [
        'Frost-Sweetened Parsnips & Leeks',
        'Cellar-Stored Heirloom Tubers',
        'Greenhouse Winter Herbs',
        'Solar-Cured Timothy Meadow Hay'
      ],
      livestockFocus: 'Heated watering founts; high-calorie forage rations for cavies & rabbits; indoor aviary winter roosts.'
    },
    {
      id: 'spring',
      name: 'Spring',
      icon: Sun,
      badge: 'Breeding & Seedling Starts',
      crops: [
        'Wild Garlic & Spring Dandelion Greens',
        'Heirloom Tomato & Pepper Starts',
        'Tender French Breakfast Radishes',
        'Baby Spinach & Chives'
      ],
      livestockFocus: 'Guinea fowl egg hatching; Bourbon Red poult brooding; Flemish Giant spring kits.'
    },
    {
      id: 'summer',
      name: 'Summer',
      icon: Sun,
      badge: 'Abundant Pasture',
      crops: [
        'Peruvian Lemon Drop Chillies',
        'San Marzano Heritage Tomatoes',
        'Raw Wildflower Honeycomb',
        'Genovese Sweet Basil'
      ],
      livestockFocus: 'Full free-range tick pasture foraging; outdoor cavy grass grazing tractors; high clover pastures.'
    }
  ];

  const current = seasons.find((s) => s.id === selectedSeason) || seasons[0];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6738] mb-2">
            <span>Homestead Almanac & Schedule</span>
            <span aria-hidden="true">·</span>
            <span>From Damak Farm</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E261E] tracking-tight mb-4">
            The Damak Seasonal Calendar
          </h2>
          <p className="text-base text-[#555C4D]">
            We follow the rhythm of the sun and soil. See what is actively harvested this week and plan your livestock additions across the agrarian seasons.
          </p>
        </div>

        {/* Season Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EFEBE4] rounded-xl mb-8 max-w-2xl">
          {seasons.map((season) => {
            const isActive = selectedSeason === season.id;
            return (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.id as any)}
                className={`flex-1 min-w-[120px] py-2.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#2E4222] text-[#FAF8F5] font-semibold shadow-xs'
                    : 'text-[#4F5649] hover:text-[#1E261E] hover:bg-[#E4DED4]'
                }`}
              >
                {season.name}
              </button>
            );
          })}
        </div>

        {/* Selected Season Display */}
        <div className="bg-white rounded-2xl border border-[#DFD8CC] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-[#1E261E]">
                  {current.name}
                </span>
                <span className="text-[11px] font-semibold text-[#3E5C2D] bg-[#EAE4D8] px-2.5 py-0.5 rounded-sm">
                  {current.badge}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E6738] mb-3">
                  Featured Crops Harvested This Season:
                </h4>
                <div className="space-y-2">
                  {current.crops.map((crop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[#32392D] p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE4D8]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#3E5C2D] shrink-0" />
                      <span className="font-medium">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-6 space-y-6">
              <div className="p-5 bg-[#F6F3EC] rounded-xl border border-[#DFD8CC]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E4222] mb-2">
                  Animal Husbandry & Flock Care Focus:
                </h4>
                <p className="text-xs sm:text-sm text-[#464D3F] leading-relaxed">
                  {current.livestockFocus}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#DFD8CC] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E261E]">
                    <Clock className="w-4 h-4 text-[#3E5C2D]" />
                    <span>Farm Gate Visiting & Collection Hours:</span>
                  </div>
                  {onOpenFarmGate && (
                    <button
                      onClick={onOpenFarmGate}
                      className="px-3.5 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border border-amber-300 rounded-lg shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Visit Farm
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#52594B]">
                  <div>
                    <span className="font-semibold block text-[#1E261E]">Friday & Saturday:</span>
                    <span>9:00 AM – 5:00 PM</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[#1E261E]">Sunday:</span>
                    <span>11:00 AM – 3:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
