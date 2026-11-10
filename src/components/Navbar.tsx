import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Sprout, MapPin, Wheat, Sun, Calendar, Globe, Phone, MessageCircle } from 'lucide-react';
import { CartItem } from '../types/farm';
import { useCurrency, Currency } from '../context/CurrencyContext';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenFarmGate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onNavigateSection,
  onOpenFarmGate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency, formatPrice } = useCurrency();

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b-2 border-emerald-300/80 shadow-xs transition-colors">
      {/* Light Agricultural Announcement Top Ribbon */}
      <div className="bg-gradient-to-r from-emerald-100 via-amber-50 to-emerald-100 border-b border-emerald-200/80 text-[11px] font-semibold text-emerald-950 py-1.5 px-3 sm:px-4 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 text-emerald-900 font-bold uppercase tracking-wider text-[10px] bg-emerald-200/90 px-2 py-0.5 rounded shrink-0">
              <Wheat className="w-3 h-3 text-emerald-800" />
              Turbo, Eldoret
            </span>
            <span className="truncate hidden md:inline text-[11px]">
              Damak Farm: Pure Indigenous Chickens, Pedigree Rabbits, Ducks, Cavies, Fish &amp; Organic Produce
            </span>
            <span className="truncate md:hidden text-[10px] text-emerald-900 font-medium">
              Organic &amp; Heritage Farmstead
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 text-xs font-semibold shrink-0">
            {/* Currency Switcher in Header (Default: KES) */}
            <div className="flex items-center gap-1 bg-white/90 border border-emerald-300 rounded-lg px-1.5 sm:px-2 py-0.5 shadow-2xs">
              <Globe className="w-3 h-3 text-emerald-700 shrink-0" />
              <select
                id="currency-select"
                aria-label="Currency Switcher"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-[10px] sm:text-[11px] font-bold text-emerald-950 focus:outline-none cursor-pointer"
              >
                <option value="KES">KES (KSh)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <button
              onClick={onOpenFarmGate}
              className="hidden sm:flex text-emerald-800 hover:text-emerald-950 items-center gap-1 cursor-pointer underline underline-offset-2 text-[11px]"
            >
              <MapPin className="w-3 h-3 text-emerald-700" />
              <span>Farm Gate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 h-18 sm:h-20 min-w-0">
          {/* Zone 1: Brand Wordmark exclusively as Damak Farm */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 sm:gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg group cursor-pointer min-w-0 shrink"
          >
            {/* Agriculture Emblem */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#124D2A] via-[#1E6B3C] to-[#2D6A4F] text-[#FAF8F5] flex items-center justify-center shrink-0 shadow-md ring-2 ring-emerald-300 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200 drop-shadow-xs" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400 border border-[#124D2A] flex items-center justify-center">
                <Sun className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-950" />
              </div>
            </div>

            {/* Typography in Damak Farm Agrarian Style */}
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] font-black tracking-tight text-[#0D381E] truncate group-hover:text-emerald-800 transition-colors drop-shadow-2xs">
                Damak Farm
              </span>
              <div className="flex items-center gap-1 -mt-0.5">
                <span className="text-[9px] sm:text-[10px] tracking-[0.14em] uppercase font-extrabold text-emerald-800 truncate">
                  Farmstead
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-700 font-bold font-serif italic truncate">
                  · Turbo
                </span>
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links for All 8 Requested Sectors */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-bold text-[#1F432A]">
            <button
              onClick={() => handleNavClick('chickens')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Chickens
            </button>
            <button
              onClick={() => handleNavClick('rabbits')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Rabbits
            </button>
            <button
              onClick={() => handleNavClick('guinea-fowls')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Guinea Fowls
            </button>
            <button
              onClick={() => handleNavClick('guinea-pigs')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Guinea Pigs
            </button>
            <button
              onClick={() => handleNavClick('fish')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Fish
            </button>
            <button
              onClick={() => handleNavClick('turkeys')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Turkeys
            </button>
            <button
              onClick={() => handleNavClick('ducks')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer"
            >
              Ducks
            </button>
            <button
              onClick={() => handleNavClick('crop-produce')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer text-emerald-900 font-black"
            >
              Crop Produce
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap hover:underline underline-offset-8 cursor-pointer text-slate-600"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions (WhatsApp, Farm Gate, Bag - No M-Pesa Express Button) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/254797736534?text=Hello%20Damak%20Farm,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp</span>
            </a>

            {/* Visit Farm Button */}
            <button
              onClick={onOpenFarmGate}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300 rounded-xl shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-950" />
              <span>Visit Farm</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              aria-label={`View harvest bag with ${totalItemCount} items`}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#124D2A] to-[#1E6B3C] rounded-xl hover:from-[#0D381E] hover:to-[#124D2A] active:scale-[0.98] transition-all shadow-md shadow-emerald-900/15 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Bag</span>
              <span className="font-mono tabular-nums bg-emerald-800/80 border border-emerald-400/40 px-1.5 py-0.5 rounded text-[11px]">
                {totalItemCount}
              </span>
              {cartSubtotal > 0 && (
                <span className="hidden sm:inline font-mono tabular-nums text-emerald-100 border-l border-emerald-600/60 pl-2">
                  {formatPrice(cartSubtotal)}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-emerald-900 hover:bg-emerald-100/80 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF8F5] border-b-2 border-emerald-300 px-6 py-5 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200 text-xs">
            <span className="font-bold text-emerald-950">Select Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-white border border-emerald-300 rounded px-2 py-1 text-xs font-bold text-emerald-900"
            >
              <option value="KES">KES (KSh - Default)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNavClick('chickens')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🐓</span> Chickens
            </button>
            <button
              onClick={() => handleNavClick('rabbits')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🐇</span> Rabbits
            </button>
            <button
              onClick={() => handleNavClick('guinea-fowls')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🪶</span> Guinea Fowls
            </button>
            <button
              onClick={() => handleNavClick('guinea-pigs')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🐹</span> Guinea Pigs
            </button>
            <button
              onClick={() => handleNavClick('fish')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🐟</span> Fish &amp; Ponds
            </button>
            <button
              onClick={() => handleNavClick('turkeys')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🦃</span> Turkeys
            </button>
            <button
              onClick={() => handleNavClick('ducks')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🦆</span> Ducks (All Breeds)
            </button>
            <button
              onClick={() => handleNavClick('crop-produce')}
              className="text-left py-2 px-2 text-xs font-bold text-emerald-950 hover:bg-emerald-100/60 rounded-lg flex items-center gap-1.5"
            >
              <span>🥦</span> Crop Produce
            </button>
          </div>

          <div className="pt-3 border-t border-emerald-200 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFarmGate();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl"
            >
              Schedule Farm Gate Visit (Fri–Sun)
            </button>
            <a
              href="https://wa.me/254797736534?text=Hello%20Damak%20Farm,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-300 rounded-xl"
            >
              WhatsApp Us (+254 797 736 534)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
