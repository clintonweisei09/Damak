import React, { useState, useMemo } from 'react';
import { Sprout, Sun, Droplets, Sparkles, ArrowRight, ShieldCheck, Heart, Info, X, Check, ShoppingBag, TrendingUp, Calendar, Clock, CheckCircle2, Leaf } from 'lucide-react';
import { FARM_CROPS, FarmCrop } from '../data/crops';
import { Product } from '../types/farm';
import { PRODUCTS } from '../data/products';

interface CropsSectionProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const CropsSection: React.FC<CropsSectionProps> = ({
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [growthFilter, setGrowthFilter] = useState<'all' | 'harvest-ready' | 'maturing'>('all');
  const [inspectedCrop, setInspectedCrop] = useState<FarmCrop | null>(null);
  const [addedCropId, setAddedCropId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Crops' },
    { id: 'rare-heirloom', label: 'Rare Heirloom Specialties' },
    { id: 'greens-brassicas', label: 'Superfood Greens & Brassicas' },
    { id: 'roots-tubers', label: 'Heirloom Roots & Tubers' },
    { id: 'herbs-berries', label: 'Orchard & Botanical Herbs' },
  ];

  // Calculate Terrace Average Growth Progress
  const averageGrowth = useMemo(() => {
    const total = FARM_CROPS.reduce((acc, c) => acc + (c.growthProgress?.percentage || 0), 0);
    return Math.round(total / FARM_CROPS.length);
  }, []);

  const harvestReadyCount = useMemo(() => {
    return FARM_CROPS.filter((c) => (c.growthProgress?.percentage || 0) >= 85).length;
  }, []);

  const filteredCrops = useMemo(() => {
    let result = selectedCategory === 'all'
      ? FARM_CROPS
      : FARM_CROPS.filter((c) => c.category === selectedCategory);

    if (growthFilter === 'harvest-ready') {
      result = result.filter((c) => (c.growthProgress?.percentage || 0) >= 85);
    } else if (growthFilter === 'maturing') {
      result = result.filter((c) => (c.growthProgress?.percentage || 0) < 85);
    }

    return result;
  }, [selectedCategory, growthFilter]);

  const handleBuyCrop = (crop: FarmCrop) => {
    // Find matching product in catalog
    const matchingProduct = PRODUCTS.find((p) =>
      p.name.toLowerCase().includes(crop.name.split(' ')[0].toLowerCase()) ||
      crop.name.toLowerCase().includes(p.name.split(' ')[0].toLowerCase())
    ) || PRODUCTS[0];

    onAddToCart(matchingProduct, 1);
    setAddedCropId(crop.id);
    setTimeout(() => {
      setAddedCropId((prev) => (prev === crop.id ? null : prev));
    }, 1500);
  };

  return (
    <section id="crops" className="py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F4F9F2] to-[#FAF8F5] border-b border-[#D8E6D3] relative overflow-hidden">
      {/* Decorative organic background aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with vibrant styling */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/90 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 shadow-2xs">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Living Botanical Heritage · Real-Time Growth Tracking</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#113824] tracking-tight leading-[1.15]">
              What We Grow on Damak Farm
            </h2>
            <p className="text-base sm:text-lg text-[#3E5244] mt-3 leading-relaxed">
              Our organic soil nourishes extraordinary crops: rare logarithmic Romanesco, anthocyanin-rich purple fingerlings, Venetian candy-striped beets, vibrant rainbow chard, and sun-drenched Peruvian peppers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Live Terrace Growth Progress Badge */}
            <div className="px-4 py-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm text-xs text-[#284E36] min-w-[240px]">
              <div className="flex items-center justify-between font-bold text-[#113824] mb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Terrace Growth Index:</span>
                </span>
                <span className="font-mono text-emerald-700 font-extrabold text-sm bg-emerald-100 px-2 py-0.5 rounded-md">
                  {averageGrowth}% Mature
                </span>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden mb-1">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${averageGrowth}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#55695C] font-medium">
                <span>{harvestReadyCount} Varieties Ready to Pick</span>
                <span>Dawn Harvest Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Editorial Crop Showcase (Non-Horizontal Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border-2 border-emerald-200/90 p-6 sm:p-8 shadow-lg mb-14">
          {/* Vertical Portrait Frame with Arched Botanical Styling */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-t-full rounded-b-3xl overflow-hidden border-4 border-emerald-300 shadow-xl bg-emerald-950 group">
              <img
                src="/src/assets/images/vibrant_crops_patch_1792426298694.jpg"
                alt="Vibrant colorful crops at Damak Farm in sunrise golden hour"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Vertical Editorial Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/20 to-transparent flex flex-col justify-between p-6">
                <div className="self-center mt-6">
                  <span className="inline-block px-3 py-1 bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
                    🌾 Vertical Botanical Terrace
                  </span>
                </div>

                <div className="text-white text-center pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 block mb-1">
                    Morning Dew Harvest
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    Living Soil Terraces
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1 line-clamp-2">
                    Harvested between 5:30 AM and 8:00 AM for maximum natural brix sugars and cellular crispness.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Agrarian Field Highlights & Soil Parameters */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Field Almanac · Direct From Soil</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#113824] leading-tight">
                Generational Heirlooms Nurtured in Living Humus
              </h3>
              <p className="text-xs sm:text-sm text-[#3E5244] leading-relaxed mt-2">
                Unlike industrial monoculture farms, Damak Farm arranges crops in polycultural bands. This vertical planting philosophy mimics forest canopies, maximizing photosynthetic sunlight capture while companion roots exchange vital mineral micronutrients.
              </p>
            </div>

            {/* 4 Interactive Field Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div 
                onClick={() => setSelectedCategory('rare-heirloom')}
                className="p-3.5 bg-emerald-50/80 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                  <span>Field 1: High Terraces</span>
                  <span className="text-emerald-700 text-[10px] font-mono group-hover:translate-x-1 transition-transform">Filter ›</span>
                </div>
                <p className="font-serif text-sm font-bold text-[#113824]">
                  Fractal Romanesco & Brassicas
                </p>
                <span className="text-[11px] text-[#55695C] block mt-0.5">
                  Fed with aerated worm-casting teas
                </span>
              </div>

              <div 
                onClick={() => setSelectedCategory('roots-tubers')}
                className="p-3.5 bg-purple-50/80 hover:bg-purple-100/80 rounded-2xl border border-purple-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                  <span>Field 2: South Loam</span>
                  <span className="text-purple-700 text-[10px] font-mono group-hover:translate-x-1 transition-transform">Filter ›</span>
                </div>
                <p className="font-serif text-sm font-bold text-purple-950">
                  Purple Fingerlings & Beets
                </p>
                <span className="text-[11px] text-[#635370] block mt-0.5">
                  Dressed with cold cavy & rabbit manure
                </span>
              </div>

              <div 
                onClick={() => setSelectedCategory('greens-brassicas')}
                className="p-3.5 bg-rose-50/80 hover:bg-rose-100/80 rounded-2xl border border-rose-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1">
                  <span>Field 3: Raised Furrows</span>
                  <span className="text-rose-700 text-[10px] font-mono group-hover:translate-x-1 transition-transform">Filter ›</span>
                </div>
                <p className="font-serif text-sm font-bold text-rose-950">
                  Bright Lights Rainbow Chard
                </p>
                <span className="text-[11px] text-[#70525A] block mt-0.5">
                  Nitrogen-fixed with crimson clover
                </span>
              </div>

              <div 
                onClick={() => setSelectedCategory('herbs-berries')}
                className="p-3.5 bg-amber-50/80 hover:bg-amber-100/80 rounded-2xl border border-amber-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                  <span>Greenhouse & Hedgerows</span>
                  <span className="text-amber-700 text-[10px] font-mono group-hover:translate-x-1 transition-transform">Filter ›</span>
                </div>
                <p className="font-serif text-sm font-bold text-amber-950">
                  Lemon Drop Chillies & Berries
                </p>
                <span className="text-[11px] text-[#78644A] block mt-0.5">
                  Adjacent to Damak top-bar apiary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category & Growth Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/90 rounded-2xl border border-emerald-200 shadow-xs">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#164E2D] text-white shadow-sm'
                      : 'text-[#3E5244] hover:text-[#113824] hover:bg-emerald-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Growth Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-emerald-50 rounded-xl border border-emerald-200 text-xs shrink-0 self-start sm:self-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2">Growth:</span>
            <button
              onClick={() => setGrowthFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                growthFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              All Stages
            </button>
            <button
              onClick={() => setGrowthFilter('harvest-ready')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                growthFilter === 'harvest-ready'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Ready to Pick ({harvestReadyCount})
            </button>
            <button
              onClick={() => setGrowthFilter('maturing')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                growthFilter === 'maturing'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              In Growth Cycle
            </button>
          </div>
        </div>

        {/* Crops Grid with Colorful Botanical Cards and Growth Progress Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredCrops.map((crop) => {
            const isAdded = addedCropId === crop.id;
            const progress = crop.growthProgress;
            return (
              <div
                key={crop.id}
                className="group bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Crop Image Header (Non-Horizontal Portrait Frame) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-emerald-50">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Vibrant Category Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className={`${crop.categoryColor.badgeBg} text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs`}>
                      {crop.categoryLabel}
                    </span>
                    {progress.percentage >= 85 && (
                      <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Ready to Harvest</span>
                      </span>
                    )}
                  </div>

                  {/* Quick Inspect Button */}
                  <button
                    onClick={() => setInspectedCrop(crop)}
                    aria-label={`Inspect botanical details of ${crop.name}`}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-emerald-900 rounded-lg shadow-sm backdrop-blur-xs transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Botanical Profile</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#113824] group-hover:text-emerald-700 transition-colors leading-snug mb-1">
                      {crop.name}
                    </h3>
                    <p className="text-xs italic text-[#55695C] mb-2.5">
                      {crop.botanicalName}
                    </p>

                    {/* LIVE GROWTH PROGRESS BAR */}
                    <div className="p-3 bg-gradient-to-br from-emerald-50/90 to-amber-50/60 rounded-xl border border-emerald-200/90 space-y-1.5 mb-3.5 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#113824] flex items-center gap-1 text-[11px] truncate pr-1">
                          <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">Stage {progress.stageNumber}/4: {progress.currentStage}</span>
                        </span>
                        <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          progress.percentage >= 85
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-200 text-amber-950 border border-amber-300'
                        }`}>
                          {progress.percentage}%
                        </span>
                      </div>

                      {/* Animated Progress Bar Track */}
                      <div className="w-full bg-emerald-200/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-emerald-300/60">
                        <div 
                          className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 h-full rounded-full transition-all duration-700 relative"
                          style={{ width: `${progress.percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#55695C] pt-0.5 font-medium">
                        <span>Day {progress.currentDay} of {progress.totalDays}</span>
                        <span className={progress.daysUntilHarvest <= 7 ? 'text-emerald-800 font-bold' : 'text-amber-900'}>
                          {progress.daysUntilHarvest <= 5 ? '✓ Dawn Pick Ready' : `⏱️ Pick in ${progress.daysUntilHarvest} days`}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#3E5244] leading-relaxed line-clamp-2 mb-3">
                      {crop.story}
                    </p>

                    {/* Crop stats */}
                    <div className="space-y-1.5 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs text-[#284E36] mb-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[#55695C]">Maturity Cycle:</span>
                        <span className="font-mono text-[#113824] font-bold">{crop.daysToMaturity}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[#55695C]">Brix / Sweetness:</span>
                        <span className="font-bold text-amber-700">{crop.brixSweetness}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectedCrop(crop)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                    >
                      Field Profile ›
                    </button>

                    <button
                      onClick={() => handleBuyCrop(crop)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#164E2D] hover:bg-[#113824] text-white active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order Harvest</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Companion Planting Matrix */}
        <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-6 sm:p-10 shadow-md">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Biological Harmony & Soil Stewardship
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#113824]">
              How Damak Farm Grows Crops Without Synthetic Sprays
            </h3>
            <p className="text-xs sm:text-sm text-[#4E6738] mt-2 leading-relaxed">
              In nature, monocultures do not exist. We pair rare heirloom crops with natural biological protectors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-serif font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-serif text-base font-bold text-[#113824] mb-1">
                Cold Rabbit Manure
              </h4>
              <p className="text-xs text-[#3E5244] leading-relaxed">
                Rabbit and cavy manure is non-burning &ldquo;cold&rdquo; organic gold. We dress purple fingerling beds directly, providing slow-release humic vitality.
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-serif font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-serif text-base font-bold text-[#113824] mb-1">
                Guinea Fowl Tick Patrol
              </h4>
              <p className="text-xs text-[#3E5244] leading-relaxed">
                Our free-roaming Pearl Guinea fowl systematically forage field borders, consuming ticks, beetles, and hornworms without disturbing delicate plant roots.
              </p>
            </div>

            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-serif font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-serif text-base font-bold text-[#113824] mb-1">
                Borage & Nasturtiums
              </h4>
              <p className="text-xs text-[#3E5244] leading-relaxed">
                Interplanted along Romanesco beds to emit natural aromatics that confuse cabbage moths, while their edible blooms feed our honeybees.
              </p>
            </div>

            <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-serif font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-serif text-base font-bold text-[#113824] mb-1">
                Dawn Harvest Timing
              </h4>
              <p className="text-xs text-[#3E5244] leading-relaxed">
                All greens, brassicas, and berries are cut between 5:30 AM and 8:00 AM while cell pressure is peaked, locking in crisp texture and natural sugars.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Detail Modal */}
      {inspectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectedCrop(null)}
              aria-label="Close details"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-emerald-950 border border-emerald-200 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-square sm:aspect-[4/3] max-h-72 w-full bg-emerald-900 overflow-hidden">
              <img
                src={inspectedCrop.image}
                alt={inspectedCrop.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className={`${inspectedCrop.categoryColor.badgeBg} text-white text-xs font-bold px-2.5 py-1 rounded-md mb-2 inline-block`}>
                    {inspectedCrop.categoryLabel}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {inspectedCrop.name}
                  </h3>
                  <p className="text-xs italic text-emerald-200">
                    {inspectedCrop.botanicalName}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  Heritage Story & Agrarian Background
                </h4>
                <p className="text-xs sm:text-sm text-[#3E5244] leading-relaxed">
                  {inspectedCrop.story}
                </p>
              </div>

              {/* GROWTH PIPELINE PROGRESS TIMELINE */}
              <div className="p-4 bg-gradient-to-br from-[#F4F9F2] to-amber-50/50 rounded-2xl border-2 border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Live Field Growth Progress ({inspectedCrop.growthProgress.percentage}% Matured)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-md">
                    Day {inspectedCrop.growthProgress.currentDay} / {inspectedCrop.growthProgress.totalDays}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-emerald-200/60 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-300">
                  <div
                    className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 h-full rounded-full transition-all duration-700 relative"
                    style={{ width: `${inspectedCrop.growthProgress.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </div>
                </div>

                {/* 4 Multi-Stage Visual Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {inspectedCrop.growthProgress.stages.map((stg, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-2.5 rounded-xl border text-[11px] flex flex-col justify-between transition-all ${
                        stg.completed
                          ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                          : stg.current
                          ? 'bg-white border-emerald-500 ring-2 ring-emerald-300/50 text-emerald-950 font-bold shadow-xs'
                          : 'bg-white/60 border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-emerald-800">
                          Stage {sIdx + 1}
                        </span>
                        {stg.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : stg.current ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs font-semibold leading-tight mb-1">{stg.name}</span>
                      <span className="text-[10px] text-[#55695C] font-mono">{stg.dayRange}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-bold text-[#113824] block mb-1">Soil Companion:</span>
                  <p className="text-[#3E5244]">{inspectedCrop.soilCompanion}</p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">Harvest Protocol:</span>
                  <p className="text-[#4E3F24]">{inspectedCrop.harvestMethod}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-[#113824] block mb-1">Culinary Inspiration:</span>
                <p className="text-[#3E5244] leading-relaxed">{inspectedCrop.culinaryUse}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {inspectedCrop.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-xs text-[#55695C]">
                  Organically grown on Damak Farm terraces
                </span>
                <button
                  onClick={() => {
                    handleBuyCrop(inspectedCrop);
                    setInspectedCrop(null);
                  }}
                  className="px-6 py-2.5 bg-[#164E2D] hover:bg-[#113824] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Harvest Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
