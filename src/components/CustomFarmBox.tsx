import React, { useState } from 'react';
import { Package, Check, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { Product } from '../types/farm';
import { PRODUCTS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';

interface CustomFarmBoxProps {
  onAddCustomBoxToCart: (customProduct: Product) => void;
}

export const CustomFarmBox: React.FC<CustomFarmBoxProps> = ({ onAddCustomBoxToCart }) => {
  const { formatPrice } = useCurrency();
  const rareProduceItems = PRODUCTS.filter((p) => p.category === 'rare-produce');
  const pantryAndPoultryItems = PRODUCTS.filter(
    (p) => p.id === 'prod-guinea-eggs' || p.id === 'prod-aged-black-garlic' || p.id === 'prod-wildflower-honey'
  );

  const [selectedProduceIds, setSelectedProduceIds] = useState<string[]>([
    'prod-romanesco',
    'prod-purple-fingerlings',
    'prod-chioggia-beets',
  ]);
  const [selectedPantryId, setSelectedPantryId] = useState<string>('prod-aged-black-garlic');
  const [frequency, setFrequency] = useState<'once' | 'subscription'>('once');
  const [added, setAdded] = useState(false);

  const toggleProduce = (id: string) => {
    if (selectedProduceIds.includes(id)) {
      if (selectedProduceIds.length > 1) {
        setSelectedProduceIds(selectedProduceIds.filter((item) => item !== id));
      }
    } else {
      if (selectedProduceIds.length < 4) {
        setSelectedProduceIds([...selectedProduceIds, id]);
      }
    }
  };

  // Base price calculation: sum of selected produce (with 10% bundle discount) + pantry
  const selectedProduce = rareProduceItems.filter((p) => selectedProduceIds.includes(p.id));
  const selectedPantry = pantryAndPoultryItems.find((p) => p.id === selectedPantryId);

  const produceSubtotal = selectedProduce.reduce((acc, p) => acc + p.price, 0);
  const pantryPrice = selectedPantry ? selectedPantry.price : 0;
  const rawTotal = produceSubtotal + pantryPrice;
  const bundleDiscount = rawTotal * 0.12; // 12% farm box savings
  const finalPrice = Math.max(15, rawTotal - bundleDiscount);

  const handleCreateAndAdd = () => {
    const produceNames = selectedProduce.map((p) => p.name).join(', ');
    const pantryName = selectedPantry ? ` + ${selectedPantry.name}` : '';

    const customBoxProduct: Product = {
      id: `custom-box-${Date.now()}`,
      name: `Damak Heritage Harvest Box (${frequency === 'subscription' ? 'Bi-Weekly' : 'Single Batch'})`,
      scientificOrBreedName: 'Curated Homestead Produce & Apiary Collection',
      category: 'rare-produce',
      price: Number(finalPrice.toFixed(2)),
      unit: 'per handcrafted wooden crate',
      description: `Custom bundle containing: ${produceNames}${pantryName}. Picked morning of delivery with fresh damp herbal liner.`,
      provenance: 'Damak Organic Terraces & Apiary',
      organic: true,
      rare: true,
      inStock: true,
      stockCount: 15,
      image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
      batchCode: `DF-BOX-${new Date().getMonth() + 1}${new Date().getDate()}`,
      seasonalAvailability: 'Autumn Season',
      shippingMethod: 'pickup-or-delivery',
      badgeNote: 'Custom Curated Box',
    };

    onAddCustomBoxToCart(customBoxProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section id="custom-box" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F4F9F2] to-[#FAF8F5] border-b border-[#D8E6D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-emerald-200/90 p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left description */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Tailored Harvest Crate · From Damak Farm</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#113824] tracking-tight mb-4 leading-tight">
                Build Your Own Damak Heritage Farm Box
              </h2>
              <p className="text-sm text-[#3E5244] leading-relaxed mb-6">
                Choose up to 4 rare organic vegetable varieties harvested dawn-of-dispatch, paired with our slow-aged black garlic or raw apiary honeycomb. Saves 12% compared to individual items.
              </p>

              {/* Box summary specs */}
              <div className="space-y-3 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-[#284E36] mb-6 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#55695C]">Selected Rare Crops:</span>
                  <span className="font-mono font-bold text-[#113824] tabular-nums">
                    {selectedProduceIds.length} of 4 items
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#55695C]">Pantry Accent:</span>
                  <span className="font-bold text-[#113824]">
                    {selectedPantry ? selectedPantry.name : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#55695C]">Farm Box Bundle Savings:</span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    -12% ({formatPrice(bundleDiscount)})
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between font-serif text-base font-bold text-[#113824]">
                  <span>Total Box Price:</span>
                  <span className="font-mono-numbers text-2xl text-emerald-800">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>

              {/* Add to bag button */}
              <button
                onClick={handleCreateAndAdd}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white scale-[1.01]'
                    : 'bg-gradient-to-r from-[#164E2D] to-[#1E6B3C] text-white hover:from-[#113824] hover:to-[#164E2D] active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Harvest Box Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 text-emerald-200" />
                    <span>Add Custom Box to Bag ({formatPrice(finalPrice)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Right configuration selectors */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Select 2 to 4 Rare Produce */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E4222]">
                    Step 1: Choose 2 to 4 Rare Heirloom Crops
                  </h3>
                  <span className="text-[11px] text-[#6E7566]">
                    ({selectedProduceIds.length}/4 selected)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rareProduceItems.map((prod) => {
                    const isSelected = selectedProduceIds.includes(prod.id);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => toggleProduce(prod.id)}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#F2EFE8] border-[#3E5C2D] ring-1 ring-[#3E5C2D]'
                            : 'bg-white border-[#E0D8CB] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-serif text-xs font-bold text-[#1E261E] truncate">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-[#646A5C]">
                            {prod.unit}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs ${
                            isSelected
                              ? 'bg-[#3E5C2D] text-white'
                              : 'border border-[#C8C0B2] text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose 1 Pantry Accent */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E4222] mb-3">
                  Step 2: Select 1 Farm Apiary or Preserve Accent
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pantryAndPoultryItems.map((pantry) => {
                    const isSelected = selectedPantryId === pantry.id;
                    return (
                      <button
                        key={pantry.id}
                        type="button"
                        onClick={() => setSelectedPantryId(pantry.id)}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#F2EFE8] border-[#3E5C2D] ring-1 ring-[#3E5C2D]'
                            : 'bg-white border-[#E0D8CB] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif text-xs font-bold text-[#1E261E] truncate">
                              {pantry.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#3E5C2D]" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#646A5C] block">
                            {pantry.unit}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-[#1E261E] mt-2 block">
                          ${pantry.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Delivery Cadence */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E4222] mb-3">
                  Step 3: Fulfillment Cadence
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setFrequency('once')}
                    className={`flex-1 min-w-[140px] p-3 text-center rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      frequency === 'once'
                        ? 'bg-[#2E4222] text-[#FAF8F5] border-[#2E4222]'
                        : 'bg-white text-[#4A5243] border-[#E0D8CB] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    One-Time Harvest Box
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('subscription')}
                    className={`flex-1 min-w-[140px] p-3 text-center rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      frequency === 'subscription'
                        ? 'bg-[#2E4222] text-[#FAF8F5] border-[#2E4222]'
                        : 'bg-white text-[#4A5243] border-[#E0D8CB] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    Bi-Weekly Harvest Delivery (Pause Anytime)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
