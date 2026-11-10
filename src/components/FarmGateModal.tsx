import React, { useState } from 'react';
import { X, MapPin, Clock, Calendar, CheckCircle2, Navigation, Sprout, Phone } from 'lucide-react';

interface FarmGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmGateModal: React.FC<FarmGateModalProps> = ({ isOpen, onClose }) => {
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitDate, setVisitDate] = useState('2026-10-24');
  const [tourType, setTourType] = useState('Paddock Walk & Aviary Tour (Free)');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail) return;
    setBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      {/* Reduced compact modal window size as requested */}
      <div 
        className="relative w-full max-w-[350px] bg-[#FCFAF6] rounded-2xl border-2 border-emerald-400 shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header with light agricultural background */}
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-100 via-emerald-50 to-amber-50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#164E2D] text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                Damak Farmstead
              </span>
              <h2 className="font-serif text-base font-bold text-[#113824]">
                Visit Farm
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-emerald-900 hover:bg-emerald-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 space-y-3">
          {bookingConfirmed ? (
            <div className="text-center py-3 bg-emerald-50 rounded-xl border border-emerald-200 p-3 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#113824]">
                Visit Reserved!
              </h3>
              <p className="text-[11px] text-[#3E5244] leading-relaxed">
                Slot confirmed for <strong>{visitDate}</strong>. Present pass at the main timber gate.
              </p>
              <div className="inline-block px-2.5 py-1 bg-white rounded-md border border-emerald-300 text-xs font-mono text-emerald-800 font-bold shadow-2xs">
                Pass #VISIT-{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <div>
                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    onClose();
                  }}
                  className="mt-1 px-4 py-1.5 bg-[#164E2D] hover:bg-[#113824] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Compact Farm Info */}
              <div className="p-2.5 bg-white rounded-xl border border-emerald-200 space-y-1 text-xs text-[#3E5244]">
                <div className="flex items-center gap-1.5 font-bold text-[#113824] text-[11px]">
                  <Navigation className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">1482 Valley Pasture Rd, Ridgefield</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#55695C] pt-1 border-t border-emerald-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-amber-600" />
                    <span>Fri–Sun: 9am–5pm</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 text-emerald-600" />
                    <span>(555) 782-3262</span>
                  </span>
                </div>
              </div>

              {/* Booking form */}
              <form onSubmit={handleBooking} className="space-y-2.5 bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#113824] mb-0.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel K."
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full py-1.5 px-2 bg-[#FCFAF6] border border-emerald-200 rounded-lg text-xs text-[#113824] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#113824] mb-0.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. samuel@example.com"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className="w-full py-1.5 px-2 bg-[#FCFAF6] border border-emerald-200 rounded-lg text-xs text-[#113824] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#113824] mb-0.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full py-1 px-1.5 bg-[#FCFAF6] border border-emerald-200 rounded-lg text-[11px] text-[#113824] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#113824] mb-0.5">
                      Purpose
                    </label>
                    <select
                      value={tourType}
                      onChange={(e) => setTourType(e.target.value)}
                      className="w-full py-1 px-1 bg-[#FCFAF6] border border-emerald-200 rounded-lg text-[10px] text-[#113824] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Paddock Walk (Free)">Paddock Walk (Free)</option>
                      <option value="Live Animals Meeting">Live Animals Meeting</option>
                      <option value="Gate Box Pickup">Gate Box Pickup</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#164E2D] to-[#1E6B3C] hover:from-[#113824] hover:to-[#164E2D] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Confirm Free Farm Visit
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
