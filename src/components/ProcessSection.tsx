import React, { useState } from 'react';
import { FileCheck, PackageCheck, QrCode, Truck, CheckCircle2 } from 'lucide-react';
import { PROCESS_STEPS } from '../data/storeData';

export const ProcessSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sourcing' | 'packaging' | 'transit'>('all');

  const filterTabs = [
    { id: 'all', label: 'All Stages' },
    { id: 'sourcing', label: 'Sourcing' },
    { id: 'packaging', label: 'Eco-Packing' },
    { id: 'transit', label: 'Karnataka Transit' },
  ] as const;

  const filteredSteps = activeFilter === 'all'
    ? PROCESS_STEPS
    : PROCESS_STEPS.filter(step => step.category === activeFilter);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-neutral-800" />;
      case 'PackageCheck':
        return <PackageCheck className="w-5 h-5 text-neutral-800" />;
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-neutral-800" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-neutral-800" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-neutral-800" />;
    }
  };

  return (
    <section id="process" className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto py-8 sm:py-12">
      {/* Header with Title on Left, Filter Pills on Right matching reference */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            03 / END-TO-END WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Complete turnkey botanical service
          </h2>
        </div>

        {/* Filter Pills matching the reference screenshot */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-[#ededed] hover:bg-neutral-300 text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Card Process Grid matching the reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredSteps.map((step) => (
          <div
            key={step.id}
            className="bg-[#f0f0f0] rounded-[22px] p-5 sm:p-6 flex flex-col justify-between border border-neutral-200/40 hover:border-neutral-300 transition-colors shadow-xs"
          >
            <div>
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-5 shadow-xs">
                {getStepIcon(step.iconName)}
              </div>

              {/* Title & Step Number */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-neutral-400">
                  {step.number}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                {step.description}
              </p>
            </div>

            {/* Subtle bottom tag */}
            <div className="mt-5 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
              <span>Mysuru Standard</span>
              <span>Verified ✓</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
