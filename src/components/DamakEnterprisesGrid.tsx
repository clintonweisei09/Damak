import React from 'react';
import { ArrowRight, Check, Sprout, ShoppingBag, Globe, GraduationCap, MapPin } from 'lucide-react';

interface DamakEnterprisesGridProps {
  onSelectCategory: (category: string) => void;
  onOpenFarmGate: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const DamakEnterprisesGrid: React.FC<DamakEnterprisesGridProps> = ({
  onSelectCategory,
  onOpenFarmGate,
  onNavigateSection,
}) => {
  const pillars = [
    {
      id: 'farm',
      category: 'FARM',
      title: 'The Working Farm',
      subtitle: 'Multi-Enterprise Production in Turbo, Eldoret',
      image: '/src/assets/images/hero_damak_farm_1792425694152.jpg',
      badge: 'Living Farm',
      description: 'Breeding Dorper sheep, dairy goats, heritage poultry, pigs, tilapia aquaculture, and high-value horticulture under integrated regenerative management.',
      highlights: [
        'Pedigree Dorper sheep & dairy goats (Saanen, Toggenburg)',
        'Free-range Kienyeji, Brahma poultry & speckled guinea fowl',
        'Bio-active living soil vegetable terraces & tilapia ponds',
      ],
      actionText: 'Explore Farm Production',
      actionHandler: () => onNavigateSection('catalog'),
    },
    {
      id: 'shop',
      category: 'SHOP',
      title: 'Farm Produce & Animals',
      subtitle: 'Direct From Our Farm to Your Door',
      image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
      badge: 'Direct Harvest',
      description: 'Order fresh farm vegetables, fertilized hatching eggs, breeding livestock, and custom farm boxes with 100% verified M-Pesa checkout.',
      highlights: [
        'Romanesco cauliflower, purple fingerlings & fresh harvests',
        'Fertile guinea & Kienyeji hatching eggs collected daily',
        'Countrywide express transport across all 47 counties',
      ],
      actionText: 'Shop Harvest Catalog',
      actionHandler: () => onNavigateSection('catalog'),
    },
    {
      id: 'marketplace',
      category: 'MARKETPLACE',
      title: 'Farmer Network & Supplies',
      subtitle: 'Verified Agricultural Inputs & Equipment',
      image: '/src/assets/images/guinea_fowl_turkeys_1792425695679.jpg',
      badge: 'All 47 Counties',
      description: 'Bridging quality equipment, specialized farm starter kits, high-protein alternative feeds (Azolla), and supplies for productive Kenyan farming.',
      highlights: [
        'Complete farm starter packages & brooder equipment',
        'High-protein Azolla starter colonies for livestock feeds',
        'Verified supplier partnerships with doorstep delivery',
      ],
      actionText: 'Explore Marketplace',
      actionHandler: () => onNavigateSection('catalog'),
    },
    {
      id: 'academy',
      category: 'ACADEMY & VISITS',
      title: 'Practical Farm Training',
      subtitle: 'Hands-on Workshops & Guided Farm Tours',
      image: '/src/assets/images/damak_farm_owners_1792425696095.jpg',
      badge: 'Weekend Tours',
      description: 'Visit our farm in Turbo, Eldoret. Gain practical experience in livestock management, poultry brooding, fish pond setup, and soil biology.',
      highlights: [
        'Guided weekend tours: Friday through Sunday (10 AM – 4 PM)',
        'Hands-on livestock husbandry & poultry brooding sessions',
        'Direct consultation with farm stewards & pickup point',
      ],
      actionText: 'Schedule Farm Visit',
      actionHandler: onOpenFarmGate,
    },
  ];

  return (
    <section id="enterprises" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-emerald-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Vinfarm's What We Do */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
            <Sprout className="w-3.5 h-3.5 text-emerald-800" />
            <span>Integrated Agribusiness · What We Do</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#0D381E] tracking-tight mb-2">
            Grow. Nurture. Sustain.
          </h2>
          <p className="text-sm sm:text-base text-[#3E5245] leading-relaxed">
            From our primary breeding paddocks in Turbo to nationwide doorstep delivery, explore our four core agricultural pillars.
          </p>
        </div>

        {/* 2x2 Clean Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-emerald-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-emerald-950">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-400/40 text-emerald-100 font-bold text-xs px-3 py-1 rounded-lg">
                  {item.badge}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-amber-300 font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-amber-400/30">
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-[#0D381E] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3E5245] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Clean bullet points */}
                  <ul className="space-y-2 text-xs text-slate-700">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                  <button
                    onClick={item.actionHandler}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-[#124D2A] hover:bg-[#0D381E] rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
