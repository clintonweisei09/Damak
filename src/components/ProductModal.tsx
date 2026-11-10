import React, { useState } from 'react';
import { X, Check, ShieldCheck, MapPin, Truck, AlertCircle, Calendar, Plus, Minus, Sprout, MessageCircle } from 'lucide-react';
import { Product } from '../types/farm';
import { CATEGORY_LABELS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { farmImageUrl } from '../assets/farmImageUrl';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Reset quantity when product changes
  React.useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [product]);

  if (!product) return null;

  const handleIncrement = () => {
    if (quantity < product.stockCount) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const lineTotal = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl border border-[#DDD5C8] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#2E4222] border border-[#DDD5C8] transition-all cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Provenance Badges */}
          <div className="relative bg-[#EFEAE2] min-h-[300px] md:min-h-full flex flex-col justify-between overflow-hidden">
            <img
              src={farmImageUrl(product.image)}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay metadata */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
              <div className="flex items-center gap-2 text-xs text-[#D8E6C7] font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.provenance}</span>
              </div>
              <p className="font-mono text-xs text-white/80">
                Provenance Batch: {product.batchCode}
              </p>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Tag */}
              <div className="flex items-center gap-2 text-xs text-[#5D6454] mb-2 font-medium">
                <span>{CATEGORY_LABELS[product.category]}</span>
                <span aria-hidden="true">·</span>
                <span>From Damak Farm</span>
              </div>

              {/* Title & Breed */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E261E] leading-tight mb-1">
                {product.name}
              </h2>

              {product.scientificOrBreedName && (
                <p className="text-xs italic text-[#747B6C] mb-4">
                  {product.scientificOrBreedName}
                </p>
              )}

              {/* Price & Stock */}
              <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-[#EAE3D6]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-bold text-emerald-950 font-mono-numbers">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-[#6B7262] font-medium">
                    {product.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#3E5C2D] block">
                    In Stock ({product.stockCount} available)
                  </span>
                  <span className="text-[11px] text-[#787F6E]">
                    {product.seasonalAvailability}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4E5547] leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Flavor / Characteristics */}
              {product.flavorOrCharacteristics && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#344C27] mb-2">
                    Key Attributes & Tasting Notes
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {product.flavorOrCharacteristics.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-[#EFEAE2] text-[#2E4222] border border-[#DDD5C8] px-2.5 py-1 rounded-md text-[11px] font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Husbandry / Care Notes (Crucial for poultry, rabbits, cavies) */}
              {product.husbandryOrCareNotes && (
                <div className="mb-6 p-3.5 bg-[#F4F0E8] rounded-xl border border-[#DED7CA] text-xs text-[#444C3D]">
                  <div className="flex items-center gap-1.5 font-bold text-[#2E4222] mb-1">
                    <Sprout className="w-3.5 h-3.5 text-[#3E5C2D]" />
                    <span>Farmer&apos;s Husbandry Advice</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {product.husbandryOrCareNotes}
                  </p>
                </div>
              )}

              {/* Fulfillment Rule Note */}
              <div className="flex items-center gap-2 text-xs text-[#626A59] mb-6">
                <Truck className="w-4 h-4 text-[#4E6738] shrink-0" />
                <span>
                  {product.shippingMethod === 'pickup-only'
                    ? 'Live animal welfare policy: Strictly available for Farm Gate Pickup or regional courier.'
                    : 'Dispatched in insulated farm-cool containers with biodegradable chill liners.'}
                </span>
              </div>
            </div>

            {/* Sticky/Stable Purchase Bar */}
            <div className="pt-4 border-t border-[#EAE3D6] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1E261E]">
                  Select Quantity:
                </span>
                <div className="flex items-center border border-[#D5CDC0] rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 text-[#2E4222] hover:bg-[#F0EAE0] disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-xs tabular-nums text-[#1E261E]">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stockCount}
                    className="p-2 text-[#2E4222] hover:bg-[#F0EAE0] disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAdd}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                  justAdded
                    ? 'bg-[#3E5C2D] text-white'
                    : 'bg-[#2E4222] text-[#FAF8F5] hover:bg-[#203017] active:scale-[0.99]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {quantity} to Bag · Total: {formatPrice(lineTotal)}</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag · {formatPrice(lineTotal)}</span>
                  </>
                )}
              </button>

              {/* Quick Order via WhatsApp Button */}
              <a
                href={`https://wa.me/254797736534?text=${encodeURIComponent(
                  `Hello Damak Farm, I would like to order: ${product.name} (Quantity: ${quantity}, Total: KSh ${(product.price * quantity).toLocaleString()}). Please confirm availability and delivery to my location.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>Quick Order via WhatsApp ({quantity}x)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
