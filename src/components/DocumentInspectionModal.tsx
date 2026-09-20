import React from 'react';
import { X, ShieldCheck, Calendar, Building2, FileText, CheckCircle, ExternalLink, Download } from 'lucide-react';
import { TrustDocument } from '../types';

interface DocumentInspectionModalProps {
  document: TrustDocument | null;
  onClose: () => void;
}

export const DocumentInspectionModal: React.FC<DocumentInspectionModalProps> = ({
  document: doc,
  onClose,
}) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-[28px] overflow-hidden shadow-2xl border border-neutral-200 relative flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Document Visual & Verified Seal */}
        <div className="md:w-5/12 bg-neutral-100 p-6 flex flex-col justify-between border-r border-neutral-200 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-neutral-300 p-2">
            <img
              src={doc.fileUrl}
              alt={doc.title}
              className="w-full h-56 md:h-72 object-cover rounded-xl"
            />
            <div className="absolute top-4 left-4 bg-neutral-950/90 text-white px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>OFFICIAL DOCUMENT</span>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold block text-emerald-900">Cryptographically Audited</span>
              This record is officially recognized and issued under statutory authority in Karnataka.
            </div>
          </div>
        </div>

        {/* Right Side: Document Details & Legal Scope */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                {doc.category}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {doc.status}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight mb-3">
              {doc.title}
            </h3>

            <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed mb-6">
              {doc.description}
            </p>

            {/* Credential Data Grid */}
            <div className="space-y-2.5 bg-[#f7f7f7] rounded-2xl p-4 border border-neutral-200/70 text-xs">
              <div className="flex items-start justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  Issuing Authority:
                </span>
                <span className="font-semibold text-neutral-900 text-right max-w-[55%]">
                  {doc.issuer}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  Certificate / Reg No:
                </span>
                <span className="font-mono font-bold text-neutral-950">
                  {doc.regNumber}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  Issue Date:
                </span>
                <span className="font-medium text-neutral-800">{doc.issueDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Valid Through:
                </span>
                <span className="font-bold text-emerald-800">{doc.validTill}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
            <div className="text-[10px] text-neutral-400 font-mono">
              Uploaded via Admin Portal: {new Date(doc.uploadedAt).toLocaleDateString()}
            </div>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect Full File</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
