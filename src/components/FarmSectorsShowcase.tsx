import React, { useState } from 'react';
import { 
  ShoppingBag, Check, ArrowRight, ShieldCheck, Sparkles, 
  MapPin, Phone, MessageCircle, Info 
} from 'lucide-react';
import { Product, ProductCategory } from '../types/farm';
import { PRODUCTS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';

interface FarmSectorsShowcaseProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenFarmGate: () => void;
}

interface SectorConfig {
  id: string;
  category: ProductCategory;
  title: string;
  badge: string;
  icon: string;
  lead: string;
  image: string;
  highlights: string[];
}

export const FarmSectorsShowcase: React.FC<FarmSectorsShowcaseProps> = ({
  onSelectProduct,
  onAddToCart,
  onOpenFarmGate,
}) => {
  const { formatPrice } = useCurrency();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((prev) => (prev === product.id ? null : prev));
    }, 1500);
  };

  const sectors: SectorConfig[] = [
    {
      id: 'chickens',
      category: 'chickens',
      title: 'Chickens & Hatching Eggs',
      badge: 'Free-Range Pastured',
      icon: '🐓',
      lead: 'Hardy pure indigenous Kienyeji, massive ornamental Brahma giants, and high-fertility hatching eggs gathered daily from our Turbo breeding runs.',
      image: '/src/assets/images/damak_chickens_1794209334968.jpg',
      highlights: [
        'Vaccinated against Newcastle, Gumboro & Fowl Pox',
        'Acclimated to pasture foraging and natural clovers',
        'Tested 90%+ egg fertility with daily morning collection',
      ],
    },
    {
      id: 'rabbits',
      category: 'rabbits',
      title: 'Pedigree Farm Rabbits',
      badge: 'Docile Heritage Lines',
      icon: '🐇',
      lead: 'Large-boned pedigree Flemish Giants, prolific New Zealand Whites, and fast-growing California Whites raised in hygienic, well-ventilated wooden rabbitries.',
      image: '/src/assets/images/farm_rabbits_cavies_1792425696079.jpg',
      highlights: [
        'Docile, calm temperaments handled daily by farm stewards',
        'Fed on sun-cured timothy grass hay and fresh garden greens',
        'High mothering ability and prolific litter sizes',
      ],
    },
    {
      id: 'guinea-fowls',
      category: 'guinea-fowls',
      title: 'Guinea Fowls',
      badge: 'Orchard Guardians',
      icon: '🪶',
      lead: 'Alert, vigilant pearl grey and royal purple guinea fowl. Supreme natural biological tick and insect hunters for regenerative homesteads.',
      image: '/src/assets/images/guinea_fowl_turkeys_1792425695679.jpg',
      highlights: [
        'Exceptional natural tick, worm, and insect pest control',
        'Thick-shelled, rich-yolked hatching eggs',
        'Hardy free-range foragers with natural flock roosting instincts',
      ],
    },
    {
      id: 'guinea-pigs',
      category: 'guinea-pigs',
      title: 'Guinea Pigs (Cavies)',
      badge: 'Friendly & Socialized',
      icon: '🐹',
      lead: 'Whimsical Rosette Abyssinian and English Crested cavies. Friendly, calm, and raised on high-fiber timothy hay and vitamin C rich farm produce.',
      image: '/src/assets/images/farm_rabbits_cavies_1792425696079.jpg',
      highlights: [
        'Bonded pairs socialized for quiet, gentle companionship',
        'Distinctive symmetrical rosette swirls and forehead crowns',
        'Raised strictly on natural pasture grass and farm vegetables',
      ],
    },
    {
      id: 'fish',
      category: 'fish',
      title: 'Fish & Freshwater Aquaculture',
      badge: 'Fresh Spring-Fed Ponds',
      icon: '🐟',
      lead: 'Vigorous Nile Tilapia monosex fingerlings, hardy African catfish, and fresh harvest table fish raised in spring-fed ponds at Damak Farm.',
      image: '/src/assets/images/damak_fish_1794209361443.jpg',
      highlights: [
        'Supplied in oxygenated transport bags for countrywide transit',
        'High feed conversion ratio and rapid uniform growth',
        'Table fish cleaned, dressed, and packed fresh on ice',
      ],
    },
    {
      id: 'turkeys',
      category: 'turkeys',
      title: 'Heritage Turkeys',
      badge: 'Pasture Reared',
      icon: '🦃',
      lead: 'Historic American Bourbon Red and massive Broad-Breasted Bronze turkeys. Robust, alert foragers capable of natural mating on open clover meadows.',
      image: '/src/assets/images/guinea_fowl_turkeys_1792425695679.jpg',
      highlights: [
        'Historic heritage lines with rich, natural flavor',
        'Naturally mating flocks suited for homestead regeneration',
        '6-week fully vaccinated poults and fertile hatching clutches',
      ],
    },
    {
      id: 'ducks',
      category: 'ducks',
      title: 'Wide Range of Duck Breeds',
      badge: 'Waterfowl Sanctuary',
      icon: '🦆',
      lead: 'Prolific White Pekins, silent Muscovy brooders, upright Indian Runners, and iridescent wild-type Mallards grazing Damak Farm’s natural wetlands.',
      image: '/src/assets/images/damak_ducks_1794209349283.jpg',
      highlights: [
        'Jumbo Pekin: heavy table waterfowl and reliable egg layers',
        'Muscovy: quackless, silent, legendary natural incubators',
        'Indian Runner: pest and snail patrol that lay up to 280 eggs/year',
      ],
    },
    {
      id: 'crop-produce',
      category: 'crop-produce',
      title: 'Organic Crop Produce',
      badge: 'Living Soil Harvest',
      icon: '🥦',
      lead: 'Fractal Romanesco cauliflower, antioxidant purple majesty fingerlings, candy-stripe Chioggia beets, rainbow chard, and fresh pearl oyster mushrooms.',
      image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
      highlights: [
        'Zero synthetic sprays, pesticides, or artificial chemicals',
        'Harvested at morning dew for crispness and nutrition',
        'Carefully sorted, packed in eco-friendly canvas and crates',
      ],
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12 bg-[#FAF8F5]">
      {sectors.map((sec, index) => {
        const sectorProducts = PRODUCTS.filter((p) => p.category === sec.category);
        const isAlternate = index % 2 === 1;

        return (
          <section
            key={sec.id}
            id={sec.id}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
          >
            {/* Header & Feature Card */}
            <div
              className={`rounded-3xl border-2 border-emerald-300/80 bg-white shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-8 ${
                isAlternate ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Media Column */}
              <div
                className={`lg:col-span-5 relative min-h-[280px] sm:min-h-[320px] bg-emerald-950 overflow-hidden ${
                  isAlternate ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img
                  src={sec.image}
                  alt={sec.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-400/40 text-emerald-100 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span>{sec.icon}</span>
                  <span>{sec.badge}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-amber-300 font-mono text-[11px] font-bold px-3 py-1 rounded-lg border border-amber-400/30">
                  Damak Farm · Turbo, Eldoret
                </div>
              </div>

              {/* Text & Specs Column */}
              <div
                className={`lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between space-y-5 ${
                  isAlternate ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                    <span>Damak Farm Enterprise</span>
                    <span>·</span>
                    <span className="text-amber-800 font-serif italic">Kenyan Provenance</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#0D381E] tracking-tight mb-2 flex items-center gap-2">
                    <span>{sec.title}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[#2E4735] leading-relaxed mb-4">
                    {sec.lead}
                  </p>

                  {/* Highlights checklist */}
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                    {sec.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Purebred Lineage &amp; Veterinary Assured</span>
                  </div>
                  <a
                    href="https://wa.me/254797736534?text=Hello%20Damak%20Farm,%20I%20am%20inquiring%20about%20orders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-800 hover:text-emerald-950 font-bold underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Custom Flock Inquiries</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Product Cards Grid for this Sector */}
            {sectorProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sectorProducts.map((product) => {
                  const isAdded = addedProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="bg-white rounded-2xl border border-emerald-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-emerald-950">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.badgeNote && (
                          <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                            {product.badgeNote}
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-white/95 text-emerald-950 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {product.scientificOrBreedName && (
                            <span className="text-[10px] text-emerald-700 font-mono italic block truncate">
                              {product.scientificOrBreedName}
                            </span>
                          )}
                          <h4 className="font-serif text-lg font-bold text-[#0D381E] leading-snug group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                            {product.unit}
                          </span>
                          <p className="text-xs text-[#3E5245] leading-relaxed line-clamp-2 mt-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Card Action footer */}
                        <div className="pt-3 border-t border-emerald-100 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-emerald-800 font-mono font-bold">
                              {product.inStock ? `✓ ${product.stockCount} Available` : 'Sold Out'}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleQuickAdd(product, e)}
                              disabled={!product.inStock}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#124D2A] hover:bg-[#0D381E] text-white shadow-xs'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-200" />
                                  <span>Add to Bag</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Quick Order via WhatsApp */}
                          <a
                            href={`https://wa.me/254797736534?text=${encodeURIComponent(
                              `Hello Damak Farm, I would like to order: ${product.name} (Quantity: 1, Price: KSh ${product.price.toLocaleString()}). Please confirm availability and delivery to my location.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                            <span>Quick Order via WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
