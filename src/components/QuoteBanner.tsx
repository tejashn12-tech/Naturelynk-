import React from 'react';
import { ArrowRight, Package, ShieldCheck, MapPin } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

interface QuoteBannerProps {
  onOpenQuote: () => void;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({ onOpenQuote }) => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto my-8 sm:my-12">
      <div className="bg-neutral-950 text-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-md">
        {/* Subtle background glow */}
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Heading, subtext, and pill button */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block mb-2">
              FAST BOTANICAL ESTIMATE
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Get your custom calculation in 15 minutes
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mt-3 max-w-lg">
              Receive accurate plant availability, customized packing specifications, and scheduled delivery charges across Mysuru and Karnataka.
            </p>

            <div className="mt-6 sm:mt-8 flex items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="bg-neutral-200 hover:bg-white text-neutral-950 text-xs sm:text-sm font-semibold pl-5 pr-2 py-3 rounded-full flex items-center gap-3 transition-all shadow-sm active:scale-95 cursor-pointer group"
              >
                <span>Calculate delivery</span>
                <span className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-6 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Obligation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Mysuru Hub Dispatch
              </span>
            </div>
          </div>

          {/* Right Column: Branded Naturelink Cardboard Box matching reference */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative group select-none">
              {/* Cardboard Box 3D Rendering Component */}
              <div className="w-64 sm:w-80 bg-[#c69d6d] rounded-xl border-2 border-[#ad8354] shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300 relative overflow-hidden">
                {/* Packing Tape Strip */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-[#b58c5c]/70 border-y border-[#9a7344]/50 pointer-events-none" />

                {/* Box Content Stamp */}
                <div className="relative z-10 flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between border-b border-[#a88052] pb-2">
                    <div className="flex items-center gap-1.5 text-neutral-900">
                      <Package className="w-4 h-4 text-neutral-800" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase">NURSERY FREIGHT</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#543d22]">KA-09-EXP</span>
                  </div>

                  {/* Big Brand Stamp matching BAU CARGO */}
                  <div className="my-2">
                    <span className="text-xl sm:text-2xl font-black tracking-widest block uppercase text-neutral-900 leading-tight">
                      {STORE_INFO.name}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider block text-neutral-800 uppercase mt-0.5">
                      MYSURU, KARNATAKA
                    </span>
                  </div>

                  {/* Handling labels */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#a88052] text-[8px] font-mono text-[#4e3820]">
                    <span>THIS SIDE UP ↑</span>
                    <span>LIVE BOTANICAL</span>
                    <span>100% ORGANIC</span>
                  </div>
                </div>
              </div>

              {/* Box Shadow */}
              <div className="w-60 sm:w-72 h-4 bg-black/40 rounded-full blur-md mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
