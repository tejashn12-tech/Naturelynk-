import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface DarkFeatureBannerProps {
  onLearnMore?: () => void;
}

export const DarkFeatureBanner: React.FC<DarkFeatureBannerProps> = ({ onLearnMore }) => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto my-6 sm:my-8">
      <div className="bg-neutral-950 text-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-sm">
        {/* Subtle glow/gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left Block: Tag + Headline */}
          <div className="md:col-span-4">
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 block uppercase mb-2">
              01 / MYSURU HERITAGE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              Authentic botanicals & natural living supplies direct from Mysuru
            </h3>
          </div>

          {/* Center Block: Description */}
          <div className="md:col-span-5 lg:col-span-6">
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              We manage the complete botanical lifecycle — from hand-selecting species across local Mysuru growers to custom pot design, organic soil enrichment, and shock-free delivery straight to homes and enterprises across Karnataka.
            </p>
          </div>

          {/* Right Block: Pill Outline Button */}
          <div className="md:col-span-3 lg:col-span-2 flex justify-start md:justify-end">
            <button
              onClick={onLearnMore}
              className="bg-transparent hover:bg-white/10 text-white border border-neutral-700 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>Learn more</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
