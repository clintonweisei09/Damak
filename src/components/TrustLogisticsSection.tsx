import React from 'react';
import { Truck, ShieldCheck, Calendar, MessageCircle, CheckCircle2 } from 'lucide-react';

interface TrustLogisticsSectionProps {
  onOpenFarmGate: () => void;
}

export const TrustLogisticsSection: React.FC<TrustLogisticsSectionProps> = ({
  onOpenFarmGate,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-emerald-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
            Damak Farm Homestead Guarantees
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0D381E] mt-2 mb-2">
            Why Kenyan Farmers Choose Damak Farm
          </h2>
          <p className="text-xs sm:text-sm text-[#3E5245]">
            Generational stewardship, healthy pastured stock, and reliable logistics from Turbo, Eldoret.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Delivery */}
          <div className="p-5 bg-white rounded-2xl border border-emerald-200/90 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base text-[#0D381E] mb-1">
                47 Counties Delivery
              </h3>
              <p className="text-xs text-[#485E4E] leading-relaxed">
                Specialized live animal crates, hatching egg cushioning, and fresh harvest delivery countrywide across all 47 counties.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-emerald-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doorstep &amp; courier pickup</span>
            </div>
          </div>

          {/* Card 2: M-Pesa Security */}
          <div className="p-5 bg-white rounded-2xl border border-emerald-200/90 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base text-[#0D381E] mb-1">
                Verified M-Pesa Merchant
              </h3>
              <p className="text-xs text-[#485E4E] leading-relaxed">
                Direct Safaricom Lipa Na M-Pesa integration at checkout with official receipting and real-time payment confirmation.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-emerald-100 text-[11px] font-mono font-bold text-emerald-800">
              Till / Paybill: 1411049 (clinton)
            </div>
          </div>

          {/* Card 3: Farm Gate Visits */}
          <div className="p-5 bg-white rounded-2xl border border-emerald-200/90 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base text-[#0D381E] mb-1">
                Weekend Farm Gate Tours
              </h3>
              <p className="text-xs text-[#485E4E] leading-relaxed">
                Visit our breeding paddocks, rabbitries, duck ponds, and vegetable beds in Turbo, Eldoret. Every Friday to Sunday (10 AM to 4 PM).
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-emerald-100">
              <button
                type="button"
                onClick={onOpenFarmGate}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Schedule Paddock Visit →
              </button>
            </div>
          </div>

          {/* Card 4: WhatsApp */}
          <div className="p-5 bg-white rounded-2xl border border-emerald-200/90 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base text-[#0D381E] mb-1">
                Direct WhatsApp Support
              </h3>
              <p className="text-xs text-[#485E4E] leading-relaxed">
                Need advice on duck breeds, Kienyeji hatching incubation, or rabbit hutch setup? Chat directly with our farm team.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-emerald-100">
              <a
                href="https://wa.me/254797736534?text=Hello%20Damak%20Farm,%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
              >
                +254 797 736 534 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
