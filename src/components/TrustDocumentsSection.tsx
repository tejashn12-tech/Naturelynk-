import React, { useState } from 'react';
import { ShieldCheck, FileCheck, ExternalLink, Award, Plus, Lock, CheckCircle2 } from 'lucide-react';
import { TrustDocument } from '../types';

interface TrustDocumentsSectionProps {
  documents: TrustDocument[];
  isAdmin: boolean;
  onInspectDocument: (doc: TrustDocument) => void;
  onOpenAdminPanel?: () => void;
}

export const TrustDocumentsSection: React.FC<TrustDocumentsSectionProps> = ({
  documents,
  isAdmin,
  onInspectDocument,
  onOpenAdminPanel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Certifications' },
    { id: 'Government License', label: 'Govt. Licenses' },
    { id: 'Quality & Health', label: 'Plant Quarantine' },
    { id: 'Organic Certification', label: 'Organic Soil' },
    { id: 'Trade Compliance', label: 'Forestry & Transit' },
  ];

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter((doc) => doc.category === selectedCategory);

  return (
    <section id="trust-documents" className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest text-emerald-700 font-bold uppercase">
              03.5 / VERIFIED CREDENTIALS & TRUST
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Public Verification Vault
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Official Compliance & Trust Documents
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            To ensure complete transparency and trust, all statutory operating permits, plant health clearances, and organic soil certifications are published here directly from our Mysuru administration.
          </p>
        </div>

        {/* Action button if Admin is logged in */}
        {isAdmin ? (
          <button
            onClick={onOpenAdminPanel}
            className="self-start lg:self-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload / Manage Documents</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 self-start lg:self-auto">
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Admin-Verified Repository</span>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-[#ededed] hover:bg-neutral-300 text-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onInspectDocument(doc)}
            className="bg-[#f0f0f0] hover:bg-[#eaeaea] rounded-[24px] p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-xs hover:shadow-md border border-neutral-200/60"
          >
            <div>
              {/* Top Row: Category & Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-semibold bg-white/80 px-2 py-0.5 rounded-md border border-neutral-200/60">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {doc.status}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug mb-2 group-hover:text-neutral-950">
                {doc.title}
              </h3>

              {/* Authority */}
              <p className="text-[11px] text-neutral-500 font-medium line-clamp-1 mb-3">
                {doc.issuer}
              </p>

              {/* Description preview */}
              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                {doc.description}
              </p>
            </div>

            {/* Bottom Card Area */}
            <div>
              <div className="p-2.5 rounded-xl bg-white/70 border border-neutral-200/70 text-[10px] font-mono text-neutral-600 mb-3 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Reg:</span>
                  <span className="font-semibold text-neutral-800 truncate max-w-[130px]">{doc.regNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Valid:</span>
                  <span className="text-emerald-700 font-semibold">{doc.validTill}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors pt-2 border-t border-neutral-200/60">
                <span>Inspect Certificate</span>
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-neutral-300">
          <FileCheck className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-700">No documents found in this category.</p>
          <p className="text-xs text-neutral-500 mt-1">Please select another category or check back later.</p>
        </div>
      )}
    </section>
  );
};
