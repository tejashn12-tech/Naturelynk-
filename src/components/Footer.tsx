import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

interface FooterProps {
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto pt-6 pb-12 mt-8 border-t border-neutral-200/80">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-black tracking-wider text-neutral-900 uppercase">
            {STORE_INFO.name}
          </span>
          <span className="text-xs text-neutral-500 mt-0.5">
            Eco-botanical supply & living store • Mysuru, Karnataka
          </span>
        </div>

        {/* Contact info in center */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-700 font-medium">
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-neutral-400" />
            <span>{STORE_INFO.phone}</span>
          </a>
          <a
            href={`mailto:${STORE_INFO.email}`}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            <span>{STORE_INFO.email}</span>
          </a>
        </div>

        {/* Address and Back To Top */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>D. Devaraj Urs Rd, Mysuru 570001</span>
          </div>

          {/* Scroll to Top Circular Button matching reference */}
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-900 text-neutral-700 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="mt-8 pt-4 border-t border-neutral-200/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2.5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Naturelynk Mysuru. All botanical and transit rights reserved.</p>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <p className="text-neutral-500 font-medium">
            Design and developed by <span className="text-neutral-700 font-bold">DigitalFace</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-neutral-600 transition-colors cursor-pointer">Karnataka Sourcing Policy</span>
          <span className="hover:text-neutral-600 transition-colors cursor-pointer">Live Plant Guarantee</span>
          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="hover:text-neutral-600 transition-colors cursor-pointer flex items-center gap-1 opacity-50 hover:opacity-100 text-[10px]"
              title="Staff Portal (admin@123)"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Staff</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
