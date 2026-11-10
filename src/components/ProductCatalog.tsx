import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Eye, Check, Sprout, Filter, Sparkles, Feather, MessageCircle } from 'lucide-react';
import { Product, ProductCategory } from '../types/farm';
import { PRODUCTS, CATEGORY_LABELS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { farmImageUrl } from '../assets/farmImageUrl';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  selectedCategoryFilter?: ProductCategory;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onAddToCart,
  selectedCategoryFilter = 'all',
}) => {
  const { formatPrice } = useCurrency();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(selectedCategoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyRare, setOnlyRare] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Sync category if passed from parent nav
  React.useEffect(() => {
    if (selectedCategoryFilter) {
      setActiveCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const categories: ProductCategory[] = [
    'all',
    'chickens',
    'rabbits',
    'guinea-fowls',
    'guinea-pigs',
    'fish',
    'turkeys',
    'ducks',
    'crop-produce',
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesBreed = product.scientificOrBreedName?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBreed) {
          return false;
        }
      }
      // Filters
      if (onlyOrganic && !product.organic) return false;
      if (onlyRare && !product.rare) return false;

      return true;
    });
  }, [activeCategory, searchQuery, onlyOrganic, onlyRare]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((prev) => (prev === product.id ? null : prev));
    }, 1200);
  };

  return (
    <section id="catalog" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Clean Unboxed Kicker */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Direct From The Farmstead</span>
            <span aria-hidden="true">·</span>
            <span>Harvested Weekly</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-800 font-bold">M-Pesa Verified</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D381E] tracking-tight mb-4">
            Seasonal Produce & Heritage Livestock
          </h2>
          <p className="text-base text-[#3E5245]">
            Every item comes directly from our living soil fields, aviaries, and rabbitry. Rare heirloom botanical varieties and ethically stewarded heritage birds and small animals with full farm provenance.
          </p>
        </div>

        {/* Toolbar: Category Buttons & Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E2D9] w-full">
          {/* Functional Segmented Tabs (Horizontally scrollable on mobile, wrapping on desktop) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-xs overflow-x-auto max-w-full scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#164E2D] to-[#1E6B3C] text-white shadow-xs font-bold'
                      : 'text-[#3E5244] hover:text-[#113824] hover:bg-emerald-50'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* Search & Quick Toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700" />
              <input
                type="text"
                placeholder="Search rare crops, poultry, rabbits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FFFFFF] border-2 border-emerald-200 rounded-xl text-[#113824] placeholder:text-[#6A7F70] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-700 hover:text-emerald-950 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Rare Only Toggle */}
            <button
              onClick={() => setOnlyRare(!onlyRare)}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                onlyRare
                  ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-2xs'
                  : 'bg-white border-emerald-200 text-[#3E5244] hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Rare Only</span>
            </button>
          </div>
        </div>

        {/* Product Count Indicator */}
        <div className="flex items-center justify-between text-xs text-[#55695C] mb-6 font-medium">
          <span>
            Showing <strong className="font-mono tabular-nums text-emerald-900 font-bold">{filteredProducts.length}</strong> items in{' '}
            <em className="text-emerald-800 font-semibold">{CATEGORY_LABELS[activeCategory]}</em>
          </span>
          <span className="hidden sm:inline text-emerald-800 font-semibold">
            ✓ Damak Farm Certified Organic & Ethical Free-Range
          </span>
        </div>

        {/* Product Grid (3-column desktop baseline with uniform layout) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isAdded = addedProductId === product.id;
              
              // Dynamic vibrant badge color
              let badgeStyle = 'bg-emerald-700 text-white';
              if (product.category === 'rare-produce') {
                badgeStyle = 'bg-purple-700 text-white';
              } else if (product.category === 'poultry') {
                badgeStyle = 'bg-amber-700 text-white';
              } else if (product.category === 'small-animals') {
                badgeStyle = 'bg-emerald-700 text-white';
              } else if (product.category === 'pantry-starts') {
                badgeStyle = 'bg-amber-800 text-white';
              }

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group flex flex-col bg-[#FFFFFF] rounded-2xl border-2 border-emerald-100/90 overflow-hidden hover:border-emerald-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Lead with Imagery (65-70% visual focus) */}
                  <div className="relative aspect-[4/3] w-full bg-emerald-50 overflow-hidden">
                    <img
                      src={farmImageUrl(product.image)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Single vibrant badge tag */}
                    {product.badgeNote && (
                      <div className={`absolute top-3 left-3 ${badgeStyle} text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs`}>
                        {product.badgeNote}
                      </div>
                    )}

                    {/* Fast Quick Add Button on Hover */}
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      aria-label={`Add ${product.name} to cart`}
                      className={`absolute bottom-3 right-3 p-3 rounded-xl shadow-md transition-all duration-150 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white scale-105'
                          : 'bg-white/95 text-emerald-950 hover:bg-[#164E2D] hover:text-white backdrop-blur-xs'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Clean Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clean Unboxed Metadata with Typographic Separator */}
                      <div className="flex items-center gap-1.5 text-xs text-[#6F7666] mb-1.5">
                        <span className="font-semibold uppercase tracking-wider text-[11px]">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-[11px]">
                          {product.batchCode}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg font-bold text-[#1E261E] group-hover:text-[#2E4222] transition-colors leading-snug mb-1">
                        {product.name}
                      </h3>

                      {/* Scientific / Heritage Breed Name */}
                      {product.scientificOrBreedName && (
                        <p className="text-xs italic text-[#727969] mb-2.5">
                          {product.scientificOrBreedName}
                        </p>
                      )}

                      {/* Short Description */}
                      <p className="text-xs text-[#52594B] line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 border-t border-[#F0EAE1] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-serif text-xl font-bold text-emerald-950 font-mono-numbers">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-xs text-[#686F60] font-normal">
                              {product.unit}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#4E6738] font-medium block">
                            {product.shippingMethod === 'pickup-only'
                              ? 'Farm Gate Pickup Only'
                              : 'Pickup or Insulated Courier'}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                          }}
                          className="text-xs font-semibold text-[#2E4222] hover:text-[#182612] hover:underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </div>

                      {/* Quick Order via WhatsApp Button */}
                      <a
                        href={`https://wa.me/254797736534?text=${encodeURIComponent(
                          `Hello Damak Farm, I would like to order: ${product.name} (Quantity: 1, Price: KSh ${product.price.toLocaleString()}). Please confirm availability and delivery to my location.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                        <span>Quick Order via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-dashed border-[#D5CDC2] p-8">
            <Sprout className="w-8 h-8 text-[#7E8574] mx-auto mb-3" />
            <h4 className="font-serif text-lg font-bold text-[#1E261E] mb-1">
              No farm produce matches your criteria
            </h4>
            <p className="text-xs text-[#5D6454] max-w-md mx-auto mb-4">
              Try clearing your search query or switching categories to explore other available livestock and harvests.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setOnlyOrganic(false);
                setOnlyRare(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#2E4222] bg-[#EFEAE2] hover:bg-[#E5DFD4] rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
