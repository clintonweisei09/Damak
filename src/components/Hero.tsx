import React from 'react';
import { ArrowRight, ShieldCheck, Sprout, Sun, Calendar, Wheat, MessageCircle, MapPin } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onExploreSectors: () => void;
  onOpenFarmGate?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onShopClick, 
  onExploreSectors, 
  onOpenFarmGate,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-emerald-200/80">
      {/* Background radiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Damak Farm Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-900 mb-4 self-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 border border-emerald-300 rounded-full uppercase tracking-wider text-[11px] text-emerald-950 shadow-2xs">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Damak Farm · Organic &amp; Heritage Farmstead · Turbo, Eldoret</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/80 border border-amber-300 rounded-full text-[11px] font-mono font-bold text-amber-950">
                🇰🇪 47 Counties Delivery
              </span>
            </div>

            {/* Headline exclusively as Damak Farm */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] font-black text-[#0D381E] tracking-tight mb-4">
              Rare Heirloom Produce &amp; <br />
              <span className="text-emerald-700">Heritage Livestock.</span>
            </h1>

            {/* Description detailing all 8 sectors */}
            <p className="text-base sm:text-lg text-[#2E4735] leading-relaxed max-w-xl mb-6">
              Welcome to Damak Farm in Turbo, Eldoret. We breed pure indigenous chickens, pedigree rabbits, guinea fowl, gentle cavies, freshwater tilapia and catfish, heritage turkeys, a wide range of duck breeds, and nutrient-dense organic crop harvests.
            </p>

            {/* Clean Action Buttons (No M-Pesa express button on homepage) */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 mb-6 w-full">
              <button
                onClick={onExploreSectors}
                className="w-full sm:w-auto px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#124D2A] to-[#1E6B3C] rounded-xl hover:from-[#0D381E] hover:to-[#124D2A] active:scale-[0.98] transition-all shadow-md shadow-emerald-900/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>Explore Farm Sectors</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-emerald-950 bg-white border-2 border-emerald-300 hover:bg-emerald-50 rounded-xl active:scale-[0.98] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Wheat className="w-4 h-4 text-emerald-700" />
                <span>Shop All Produce &amp; Livestock</span>
              </button>

              {onOpenFarmGate && (
                <button
                  onClick={onOpenFarmGate}
                  className="w-full sm:w-auto px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-950" />
                  <span>Visit Farm</span>
                </button>
              )}

              <a
                href="https://wa.me/254797736534?text=Hello%20Damak%20Farm%20Turbo,%20I%20would%20like%20to%20inquire%20about%20produce%20and%20livestock%20orders"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Farm Origin Signoff */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#DDE7DA] text-xs text-[#526656]">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Turbo, Eldoret, Kenya</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1 font-bold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ethically Raised &amp; Organically Grown</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Countrywide Delivery Across All 47 Counties</span>
            </div>
          </div>

          {/* Right Column: Damak Farm Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-emerald-300/80 bg-emerald-950 shadow-xl group">
              <img
                src="/src/assets/images/damak_chickens_1794209334968.jpg"
                alt="Damak Farm pastures with free-range poultry, waterfowl, and vegetable beds"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Bottom caption overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-emerald-950/95 via-emerald-950/60 to-transparent text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Turbo, Eldoret, Kenya
                    </span>
                    <p className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                      Damak Farm Homestead
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-[11px] bg-emerald-900/90 backdrop-blur-md border border-emerald-400/40 px-2.5 py-1 rounded-lg text-emerald-100 font-mono font-bold">
                      Est. 1998
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Impact Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 mt-8 border-t border-emerald-200/80">
          <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="block font-serif text-2xl font-black text-emerald-800">
              8 Sectors
            </span>
            <span className="text-xs font-bold text-emerald-950 mt-0.5 block">
              Chickens, Rabbits &amp; Ducks
            </span>
            <span className="text-[11px] text-emerald-700 block">Guinea fowl, fish, cavies, crops</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="block font-serif text-2xl font-black text-emerald-800">
              47
            </span>
            <span className="text-xs font-bold text-emerald-950 mt-0.5 block">
              Kenyan Counties Served
            </span>
            <span className="text-[11px] text-emerald-700 block">Careful live parcel transport</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="block font-serif text-2xl font-black text-emerald-800">
              100%
            </span>
            <span className="text-xs font-bold text-emerald-950 mt-0.5 block">
              Organically Reared
            </span>
            <span className="text-[11px] text-emerald-700 block">Zero synthetic chemicals</span>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="block font-serif text-2xl font-black text-emerald-800">
              Fri – Sun
            </span>
            <span className="text-xs font-bold text-emerald-950 mt-0.5 block">
              Farm Gate Visiting
            </span>
            <span className="text-[11px] text-emerald-700 block">10 AM – 4 PM in Turbo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
