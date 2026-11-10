import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, MapPin, ShieldCheck } from 'lucide-react';
import { CartItem, Product } from '../types/farm';
import { useCurrency } from '../context/CurrencyContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onStartCheckout: (fulfillmentType: 'pickup' | 'delivery') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
}) => {
  const { formatPrice, currency } = useCurrency();
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Check if any item is live animal that requires pickup-only
  const hasLiveAnimals = cartItems.some(
    (item) => item.product.shippingMethod === 'pickup-only'
  );

  const shippingFee = fulfillmentType === 'pickup' ? 0 : subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <div className="w-full sm:w-[420px] max-w-full bg-[#FAF8F5] border-l border-[#DFD8CC] shadow-2xl flex flex-col justify-between pointer-events-auto">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE3D6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2E4222] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1E261E]">
                  Your Harvest Bag
                </h2>
                <span className="text-[11px] text-[#69705F]">
                  From Damak Farm · Fresh Homestead Goods
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-2 text-[#4E5646] hover:text-[#1E261E] rounded-lg hover:bg-[#EFEAE2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items scrollable list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-[#EFEAE2] text-[#68705F] flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1E261E] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#6B7262] max-w-xs mx-auto mb-6">
                  Explore our seasonal rare vegetables, heritage poultry, or gentle rabbits and cavies.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-[#FAF8F5] bg-[#2E4222] hover:bg-[#203017] rounded-lg cursor-pointer"
                >
                  Browse The Harvest
                </button>
              </div>
            ) : (
              <>
                {/* Live Animal Notice if present */}
                {hasLiveAnimals && (
                  <div className="p-3 bg-[#F2EDE2] rounded-xl border border-[#DFD7C9] text-xs text-[#444D3D] flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#4E6738] shrink-0 mt-0.5" />
                    <span>
                      <strong>Live Animal Welfare Notice:</strong> Orders containing live guinea fowl, turkeys, rabbits, or cavies are designated for Farm Gate Pickup or regional climate-controlled transport.
                    </span>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 bg-white rounded-xl border border-[#E3DBD0] flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-[#EFEAE2] shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-serif text-xs font-bold text-[#1E261E] truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-[#6C7362] block">
                          {formatPrice(item.product.price)} {item.product.unit}
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#DDD5C8] rounded bg-[#FAF8F5]">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="px-1.5 py-0.5 text-xs text-[#2E4222] hover:bg-[#EFEAE2] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stockCount}
                              className="px-1.5 py-0.5 text-xs text-[#2E4222] hover:bg-[#EFEAE2] disabled:opacity-30 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            aria-label="Remove item"
                            className="text-[#9E867E] hover:text-[#B22222] p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-xs text-[#1E261E] tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fulfillment Selection */}
                <div className="pt-4 border-t border-[#EAE3D6] space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E4222] block">
                    Choose Fulfillment Method
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        fulfillmentType === 'pickup'
                          ? 'bg-[#2E4222] text-[#FAF8F5] border-[#2E4222]'
                          : 'bg-white text-[#4A5342] border-[#DFD8CC] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <span className="font-bold block text-xs">Farm Gate Pickup</span>
                      <span className="text-[10px] opacity-80">Free at Ridgefield</span>
                    </button>

                    <button
                      type="button"
                      disabled={hasLiveAnimals}
                      onClick={() => setFulfillmentType('delivery')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        hasLiveAnimals
                          ? 'opacity-40 cursor-not-allowed bg-[#ECE7DC] border-[#DFD8CC]'
                          : fulfillmentType === 'delivery'
                          ? 'bg-[#2E4222] text-[#FAF8F5] border-[#2E4222]'
                          : 'bg-white text-[#4A5342] border-[#DFD8CC] hover:bg-[#F7F4EE]'
                      }`}
                    >
                      <span className="font-bold block text-xs">Insulated Courier</span>
                      <span className="text-[10px] opacity-80">
                        {subtotal >= 60 ? 'Free (over ' + formatPrice(60) + ')' : formatPrice(8.5)}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#FFFFFF] border-t border-[#EAE3D6] space-y-3">
              <div className="space-y-1.5 text-xs text-[#525A4B]">
                <div className="flex items-center justify-between">
                  <span>Harvest Subtotal:</span>
                  <span className="font-mono tabular-nums text-[#1E261E]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fulfillment ({fulfillmentType === 'pickup' ? 'Farm Gate' : 'Courier'}):</span>
                  <span className="font-mono tabular-nums text-[#1E261E]">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EDE7DC] flex items-center justify-between font-serif text-base font-bold text-[#1E261E]">
                  <span>Total Amount:</span>
                  <span className="font-mono-numbers text-xl text-[#2E4222]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onStartCheckout(fulfillmentType)}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs text-[#FAF8F5] bg-[#2E4222] hover:bg-[#203017] active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#787F6E]">
                Organic Certified · Direct from Damak Homestead
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
