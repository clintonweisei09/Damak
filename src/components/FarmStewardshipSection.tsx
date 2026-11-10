import React from 'react';
import { ShieldCheck, Heart, Droplets, Sun, Calendar, Sparkles, Check, ArrowRight } from 'lucide-react';
import { farmImageUrl } from '../assets/farmImageUrl';

interface FarmStewardshipSectionProps {
  onOpenFarmGate: () => void;
  onAdviceClick: () => void;
}

export const FarmStewardshipSection: React.FC<FarmStewardshipSectionProps> = ({
  onOpenFarmGate,
  onAdviceClick,
}) => {
  return (
    <section id="stewardship" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F3F8F0] to-[#FAF8F5] border-b border-[#D8E6D4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Visual Story */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-200/90 shadow-xl bg-emerald-950">
              <img
                src={farmImageUrl('/src/assets/images/damak_farm_owners_1792425696095.jpg')}
                alt="Damak Farm founders and stewards inspecting organic vegetable harvests"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-[420px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent flex items-end p-6 sm:p-8">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                    Ridgefield Homestead · Est. 1998
                  </span>
                  <p className="font-serif text-white font-bold text-xl sm:text-2xl mt-1">
                    Hands-On Stewards of Living Soil
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-5 -right-3 sm:right-6 bg-white rounded-2xl p-4 shadow-lg border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                🌱
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">100% Organically Managed</span>
                <span className="block text-[11px] text-slate-500">Zero synthetic chemical fertilizers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Values & Ecosystem */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Generational Farm Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D381E] tracking-tight mb-5" style={{ textWrap: 'balance' }}>
              Cultivating Soil Health, Rare Harvests & Happy Animals.
            </h2>

            <p className="text-base sm:text-lg text-[#324939] leading-relaxed mb-6">
              Unlike industrial monoculture farms, Damak Farm operates as a living, closed-loop biological system. We nurture beneficial fungal mycorrhizae in our loam beds, harvest deep well groundwater, and give our heritage fowl and rabbits open, sunlit living environments.
            </p>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Pure Well-Watered Terraces</h4>
                  <p className="text-xs text-slate-600">Irrigated from deep underground aquifer wells without chlorination or synthetic runoff chemicals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Regenerative Compost & Vermiculture</h4>
                  <p className="text-xs text-slate-600">All crop residues and poultry manure are cured into rich organic humus before nourishing new seedling beds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Safaricom M-Pesa Integrated</h4>
                  <p className="text-xs text-slate-600">Order from anywhere and complete payments directly on your phone with instant STK Push confirmation.</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenFarmGate}
                className="px-6 py-3.5 text-sm font-bold text-white bg-[#124D2A] hover:bg-[#0D381E] rounded-xl transition-all shadow-md shadow-emerald-900/15 cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Visit Us This Weekend</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onAdviceClick}
                className="px-5 py-3.5 text-sm font-semibold text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Read Husbandry Journal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
