import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/storeData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onViewAllServices: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onViewAllServices,
}) => {
  return (
    <section id="services" className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            02 / WHAT WE PROVIDE
          </span>
          <h2 id="services-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Our product
          </h2>
        </div>
        <button
          onClick={onViewAllServices}
          className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-neutral-950 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer group"
        >
          <span>All services</span>
          <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* 3-Column Card Grid matching the reference layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className="bg-[#f0f0f0] hover:bg-[#eaeaea] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-xs hover:shadow-md border border-neutral-200/50"
          >
            {/* Card Content Top */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md font-semibold">
                  {service.tag || service.category}
                </span>
                {service.priceStart && (
                  <span className="text-xs font-semibold text-neutral-600">
                    From {service.priceStart}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-950">
                {service.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Bottom Image Container with bottom-left floating circle arrow */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-neutral-200">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Floating White Circular Arrow Button matching reference */}
              <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-md group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
