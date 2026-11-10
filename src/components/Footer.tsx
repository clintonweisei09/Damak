import React from 'react';
import { Sprout, MapPin, Phone, Mail, ShieldCheck, MessageCircle, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenFarmGate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenFarmGate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#061C0E] text-[#FAF8F5] pt-14 pb-10 border-t-2 border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-emerald-900/80">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center ring-2 ring-emerald-400/40 shadow-sm">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="font-serif text-2xl font-black tracking-tight text-[#FAF8F5] block">
                  Damak Farm
                </span>
                <span className="text-[10px] font-extrabold tracking-[0.16em] uppercase text-emerald-400 block">
                  Organic &amp; Heritage Farmstead · Est. 1998
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              A diversified working homestead in Turbo, Eldoret, Kenya. Breeding pure indigenous chickens, pedigree rabbits, guinea fowls, gentle cavies, freshwater fish, turkeys, wide range of duck breeds, and living-soil organic crop produce with countrywide delivery across all 47 counties.
            </p>

            <div className="space-y-2 text-xs text-emerald-200/90 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Turbo, Eldoret, Kenya (Uasin Gishu County)</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+254 797 736 534 (Farm Desk &amp; Orders)</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>steward@damakfarm.com</span>
              </div>

              <div className="flex items-center gap-2 text-amber-300 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Official M-Pesa Merchant Shortcode: 1411049 (clinton)</span>
              </div>
            </div>
          </div>

          {/* Quick links to the 8 Sectors */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Farm Sectors &amp; Breeds
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-emerald-200/80">
              <button
                onClick={() => onNavigateSection('chickens')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🐓</span> <span>Chickens &amp; Eggs</span>
              </button>
              <button
                onClick={() => onNavigateSection('rabbits')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🐇</span> <span>Farm Rabbits</span>
              </button>
              <button
                onClick={() => onNavigateSection('guinea-fowls')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🪶</span> <span>Guinea Fowls</span>
              </button>
              <button
                onClick={() => onNavigateSection('guinea-pigs')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🐹</span> <span>Guinea Pigs</span>
              </button>
              <button
                onClick={() => onNavigateSection('fish')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🐟</span> <span>Fish &amp; Tilapia</span>
              </button>
              <button
                onClick={() => onNavigateSection('turkeys')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🦃</span> <span>Heritage Turkeys</span>
              </button>
              <button
                onClick={() => onNavigateSection('ducks')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🦆</span> <span>Duck Breeds</span>
              </button>
              <button
                onClick={() => onNavigateSection('crop-produce')}
                className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1.5"
              >
                <span>🥦</span> <span>Crop Produce</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenFarmGate}
                className="text-xs text-amber-300 hover:text-white underline cursor-pointer"
              >
                Schedule Weekend Farm Gate Tour (Fri–Sun) →
              </button>
            </div>
          </div>

          {/* WhatsApp & Contact CTA */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Direct Farmer Consultation
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Order customized breeding trios, fertilized hatching egg batches, or pond fingerlings directly.
            </p>

            <a
              href="https://wa.me/254797736534?text=Hello%20Damak%20Farm%20Turbo,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00A34E] hover:bg-[#00B858] text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp (+254 797 736 534)</span>
            </a>

            <div className="pt-2 text-[11px] text-emerald-400/80">
              Visiting Hours: Friday – Sunday, 10:00 AM – 4:00 PM
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/70">
          <div>
            © {new Date().getFullYear()} Damak Farm · All Rights Reserved. Turbo, Eldoret, Kenya.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
