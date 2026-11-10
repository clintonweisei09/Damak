import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Megaphone, ChevronLeft, ChevronRight, Tag, ShieldCheck } from 'lucide-react';

interface AdItem {
  id: string;
  badge: string;
  sponsor: string;
  headline: string;
  subtext: string;
  ctaText: string;
  discountCode: string;
  discountAmount: string;
  bgGradient: string;
  accentColor: string;
  detailStory: string;
}

const ADS: AdItem[] = [
  {
    id: 'ad-1',
    badge: 'Limited Seasonal Offer',
    sponsor: 'Damak Nursery & Living Soil',
    headline: 'Organic Heirloom Seedling & Starter Plugs Sale — 25% Off',
    subtext: 'Cold-hardy Romanesco, Rainbow Chard, and Purple Fingerling starts ready for transplanting.',
    ctaText: 'Claim 25% Voucher',
    discountCode: 'HARVEST25',
    discountAmount: '25% OFF',
    bgGradient: 'from-[#064E3B] via-[#047857] to-[#022C22]',
    accentColor: 'text-emerald-300',
    detailStory: 'Get 25% off all seedling plugs and cold-frame starter trays. Cultivated in living worm-cast soil for fast root establishment.'
  },
  {
    id: 'ad-2',
    badge: 'Homestead Equipment Partner',
    sponsor: 'Valley Solar Fencing & Co-op',
    headline: 'Predator-Proof Poultry Netting & Solar Energizers',
    subtext: 'Keep free-ranging Guinea Fowl and Bourbon Red Turkeys secure against nocturnal predators.',
    ctaText: 'Explore Poultry Tech',
    discountCode: 'SOLARFENCE',
    discountAmount: 'FREE BATTERY',
    bgGradient: 'from-[#78350F] via-[#B45309] to-[#451A03]',
    accentColor: 'text-amber-300',
    detailStory: 'Solar-powered portable electric poultry mesh tested on pasture terrain. Quick setup and reliable protection for roaming birds.'
  },
  {
    id: 'ad-3',
    badge: 'Limited Harvest Drop',
    sponsor: 'Damak Apiary & Pantry Kitchen',
    headline: 'Raw Wildflower Honeycomb & Black Garlic Gift Crates',
    subtext: 'Receive a handcrafted cedar wood box and honey dipper with any 2 apiary jars.',
    ctaText: 'Order Honey Gift',
    discountCode: 'BEEHONEY',
    discountAmount: 'FREE CRATE',
    bgGradient: 'from-[#854D0E] via-[#CA8A04] to-[#713F12]',
    accentColor: 'text-yellow-200',
    detailStory: 'Pure untreated virgin honeycomb cut straight from our top-bar hives. Paired with 60-day slow-fermented organic black garlic.'
  },
  {
    id: 'ad-4',
    badge: 'Bulk Animal Nutrition',
    sponsor: 'High Meadow Timothy & Hay',
    headline: 'Save on 3-Bale Sun-Cured Meadow Hay Bundles',
    subtext: 'First-cut dust-extracted coarse timothy hay for Flemish Giants and farm cavies.',
    ctaText: 'Reserve Hay Bale',
    discountCode: 'TIMOTHYHAY',
    discountAmount: 'SAVE KSh 1,200',
    bgGradient: 'from-[#4C1D95] via-[#6D28D9] to-[#3B0764]',
    accentColor: 'text-purple-200',
    detailStory: 'Ensure your rabbits and cavies receive continuous abrasive silica fiber to maintain teeth wear and healthy digestive motility.'
  }
];

export const RotatingAdsBanner: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activePromoModal, setActivePromoModal] = useState<AdItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto rotation every 6 seconds
  useEffect(() => {
    if (isPaused || activePromoModal) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % ADS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, activePromoModal]);

  const currentAd = ADS[currentIdx];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % ADS.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + ADS.length) % ADS.length);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Changing Ad Banner with Dynamic Background Colors */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentAd.bgGradient} p-4 sm:p-5 text-white shadow-md transition-all duration-700 border border-white/10`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          {/* Ad Content */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <Megaphone className="w-5 h-5 text-white animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/30 border border-white/20 px-2 py-0.5 rounded text-white">
                  {currentAd.badge}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {currentAd.sponsor}
                </span>
                <span className="text-xs font-bold text-amber-300">
                  [{currentAd.discountAmount}]
                </span>
              </div>

              <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-snug truncate">
                {currentAd.headline}
              </h4>
              <p className="text-xs text-white/85 line-clamp-1 mt-0.5">
                {currentAd.subtext}
              </p>
            </div>
          </div>

          {/* Action & Controls */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {/* CTA button with background */}
            <button
              onClick={() => setActivePromoModal(currentAd)}
              className="px-4 py-2 bg-white text-gray-950 font-bold text-xs rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentAd.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-1 bg-black/25 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={handlePrev}
                aria-label="Previous advertisement"
                className="p-1 hover:bg-white/20 rounded text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1 text-white/90">
                {currentIdx + 1}/{ADS.length}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next advertisement"
                className="p-1 hover:bg-white/20 rounded text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic progress indicators */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10">
          {ADS.map((ad, idx) => (
            <button
              key={ad.id}
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Jump to ad ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIdx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
          <span className="text-[10px] text-white/60 ml-auto font-medium">
            Sponsored Agro-Partner Spotlight
          </span>
        </div>
      </div>

      {/* Promo Offer Detail Modal */}
      {activePromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#FCFAF6] rounded-3xl border-2 border-emerald-300 shadow-2xl overflow-hidden p-6 space-y-4">
            <button
              onClick={() => setActivePromoModal(null)}
              aria-label="Close promo modal"
              className="absolute top-4 right-4 p-2 text-emerald-950 hover:bg-emerald-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
                {activePromoModal.badge}
              </span>
              <span className="text-xs text-[#55695C]">
                {activePromoModal.sponsor}
              </span>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#113824]">
              {activePromoModal.headline}
            </h3>

            <p className="text-xs text-[#3E5244] leading-relaxed">
              {activePromoModal.detailStory}
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Use Discount Code at Checkout
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg font-bold text-[#113824] bg-white px-4 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                  {activePromoModal.discountCode}
                </span>
                <button
                  onClick={() => handleCopyCode(activePromoModal.discountCode)}
                  className="px-3 py-2 bg-[#164E2D] hover:bg-[#113824] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <p className="text-[11px] text-emerald-700">
                Discount applied: <strong>{activePromoModal.discountAmount}</strong>
              </p>
            </div>

            <button
              onClick={() => setActivePromoModal(null)}
              className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Continue Browsing Farm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
