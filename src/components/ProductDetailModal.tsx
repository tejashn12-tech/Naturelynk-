import React from 'react';
import { X, MapPin, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ProductItem, ServiceItem } from '../types';

interface ProductDetailModalProps {
  item: ProductItem | ServiceItem | null;
  onClose: () => void;
  onOrderOrInquire: (title: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onOrderOrInquire,
}) => {
  if (!item) return null;

  const isProduct = 'specs' in item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-[28px] overflow-hidden shadow-2xl border border-neutral-200 relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image side */}
        <div className="md:w-1/2 relative bg-neutral-100 min-h-[260px] md:min-h-full">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-neutral-200 mt-1 font-medium">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Mysuru, Karnataka</span>
            </div>
          </div>
        </div>

        {/* Details side */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Naturelynk Certified
              </span>
              {'estimatedPrice' in item && item.estimatedPrice && (
                <span className="text-xs font-bold text-neutral-900">
                  {item.estimatedPrice}
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-neutral-900 leading-tight mb-2">
              {item.title}
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Specifications or Features */}
            {isProduct && (item as ProductItem).specs && (
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">
                  TECHNICAL SPECIFICATIONS
                </span>
                <div className="bg-[#f7f7f7] rounded-xl p-3 space-y-1.5 text-xs">
                  {(item as ProductItem).specs.map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-neutral-200/50 pb-1 last:border-0 last:pb-0">
                      <span className="text-neutral-500">{spec.label}</span>
                      <span className="font-semibold text-neutral-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isProduct && (item as ServiceItem).features && (
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">
                  SERVICE INCLUSIONS
                </span>
                <div className="space-y-1.5 text-xs text-neutral-700">
                  {(item as ServiceItem).features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOrderOrInquire(item.title);
              }}
              className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Request Quote / Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
