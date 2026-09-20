import React from 'react';
import { ArrowUpRight, Plus, Package } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductGallerySectionProps {
  products: ProductItem[];
  isAdmin?: boolean;
  onOpenAdminPanel?: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onViewAllCategories: () => void;
}

export const ProductGallerySection: React.FC<ProductGallerySectionProps> = ({
  products,
  isAdmin,
  onOpenAdminPanel,
  onSelectProduct,
  onViewAllCategories,
}) => {
  return (
    <section id="gallery" className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto py-8 sm:py-12">
      {/* Header matching reference */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            04 / CURATED CATALOGUE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Signature Mysuru Collections
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onOpenAdminPanel}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Products ({products.length})</span>
            </button>
          )}

          <button
            onClick={onViewAllCategories}
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-neutral-950 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer group"
          >
            <span>All categories</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Dynamic Products Grid matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-[#f0f0f0] hover:bg-[#eaeaea] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-xs hover:shadow-md border border-neutral-200/50"
          >
            {/* Top Text Details */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-medium">
                  {product.category}
                </span>
                <span className="text-xs font-semibold text-neutral-700">
                  {product.estimatedPrice}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1.5 group-hover:text-neutral-950">
                {product.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Bottom Image Container with bottom-left floating circle arrow */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Floating White Circular Arrow Button */}
              <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-md group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>

              {/* Origin tag */}
              <div className="absolute bottom-3 right-3 text-[10px] font-mono bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                Mysuru Origin
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-neutral-300">
          <Package className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-700">No products available in the gallery.</p>
          {isAdmin && (
            <button
              onClick={onOpenAdminPanel}
              className="mt-3 text-xs bg-neutral-950 text-white font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Product</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
