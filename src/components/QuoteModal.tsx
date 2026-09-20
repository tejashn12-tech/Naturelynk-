import React, { useState } from 'react';
import { X, CheckCircle, Calculator, MapPin, Truck, Leaf, Clock, BellRing, ShieldCheck, Globe } from 'lucide-react';
import { MYSURU_LOCALITIES, STORE_INFO } from '../data/storeData';
import { QuoteInquiry } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  onQuoteSubmitted?: (inquiry: QuoteInquiry) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Exotic Indoor Flora',
  onQuoteSubmitted,
}) => {
  const [locality, setLocality] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [plantCount, setPlantCount] = useState(10);
  const [includePots, setIncludePots] = useState(true);
  const [needInstallation, setNeedInstallation] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastQuoteId, setLastQuoteId] = useState('');

  React.useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory, isOpen]);

  if (!isOpen) return null;

  // Calculation Logic
  const isInternational =
    locality.trim() !== '' &&
    !locality.toLowerCase().includes('india') &&
    !locality.toLowerCase().includes('karnataka') &&
    !locality.toLowerCase().includes('mysuru');

  const baseDeliveryFee = isInternational ? 4500 : 350;
  const estimatedPlantSubtotal = plantCount * 380;
  const potsSubtotal = includePots ? plantCount * 220 : 0;
  const installationFee = needInstallation ? 500 : 0;
  const estimatedTotal = estimatedPlantSubtotal + potsSubtotal + baseDeliveryFee + installationFee;

  const transitTime = isInternational
    ? 'Air Freight (3–5 Days) / Sea Cargo (2–3 Weeks)'
    : '1–2 Business Days (Express Logistics)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `NL-Q${Date.now().toString().slice(-5)}`;
    setLastQuoteId(newId);

    const newInquiry: QuoteInquiry = {
      id: newId,
      customerName: customerName.trim() || 'Valued Customer',
      contactNumber: contactNumber.trim(),
      locality,
      category,
      plantCount,
      includePots,
      needInstallation,
      estimatedTotal,
      transitTime,
      submittedAt: new Date().toISOString(),
      isRead: false,
      status: 'New',
    };

    if (onQuoteSubmitted) {
      onQuoteSubmitted(newInquiry);
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-[28px] p-6 sm:p-8 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Quotation Request Received!
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6">
              Thank you {customerName || 'valued customer'}. Our team at {STORE_INFO.name} Mysuru is preparing your exact botanical dispatch schedule.
            </p>

            <div className="bg-[#f5f5f5] rounded-2xl p-4 text-left mb-4 text-xs text-neutral-700 space-y-1.5 border border-neutral-200">
              <div className="flex justify-between items-center pb-1.5 border-b border-neutral-200">
                <span className="text-neutral-500 font-mono text-[11px]">Quote Reference:</span>
                <span className="font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">#{lastQuoteId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Destination:</span>
                <span className="font-semibold">{locality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transit Duration:</span>
                <span className="font-semibold text-emerald-700">{transitTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Batch Cost:</span>
                <span className="font-bold text-neutral-900">₹{estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 text-left flex items-start gap-2.5">
              <BellRing className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-950 leading-relaxed">
                <span className="font-bold text-emerald-900 block">Admin & Nursery Team Notified</span>
                Your quotation lead was sent directly to our Mysuru dispatch admin. We will reach you on {contactNumber || 'WhatsApp'} promptly.
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-neutral-950 text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-emerald-700 mb-1.5">
              <Calculator className="w-4 h-4" />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                INSTANT DISPATCH CALCULATOR
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-2">
              Calculate Delivery & Botanical Order
            </h3>

            <p className="text-xs text-neutral-500 mb-6">
              Official export logistics & botanical supply estimate from Naturelynk Exports.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Destination Country or Region */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Destination Country or Region:</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Arab Emirates, Germany, United States, United Kingdom, India..."
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 text-xs"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Type your destination country, region, state, or discharge port for export handling.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-neutral-500" />
                  Primary Botanical / Export Commodity Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950"
                >
                  {category &&
                    ![
                      'Coffee (Arabica & Robusta Grades)',
                      'Pepper (Malabar Coast Grades)',
                      'Cardamom (Western Ghats Grades)',
                      'Turmeric (Salem / Alleppey Grades)',
                      'Exotic Indoor Flora',
                      'Aromatic & Herbal Stock',
                      'Artisanal Terracotta & Planters',
                      'Commercial Bulk Supply',
                    ].includes(category) && (
                      <option value={category}>{category}</option>
                    )}
                  <option value="Coffee (Arabica & Robusta Grades)">Coffee (Plantation AAA, AA, PB, Cherry, Parchment)</option>
                  <option value="Pepper (Malabar Coast Grades)">Pepper (TGSEB, TGEB, MG1, White, Green)</option>
                  <option value="Cardamom (Western Ghats Grades)">Cardamom (Alleppey Green AGEB, AGB, AGS)</option>
                  <option value="Turmeric (Salem / Alleppey Grades)">Turmeric (Salem, Erode, Alleppey High Curcumin)</option>
                  <option value="Exotic Indoor Flora">Exotic Indoor & Air Purifying Flora</option>
                  <option value="Aromatic & Herbal Stock">Aromatic Herbs & Mysuru Sandalwood</option>
                  <option value="Artisanal Terracotta & Planters">Artisanal Terracotta & Ceramic Planters</option>
                  <option value="Commercial Bulk Supply">Commercial Landscaping & Farm Supply</option>
                </select>
              </div>

              {/* Quantity Slider */}
              <div>
                <div className="flex justify-between font-semibold text-neutral-700 mb-1">
                  <span>Approximate Quantity:</span>
                  <span className="text-neutral-950 font-bold">{plantCount} units</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="2"
                  value={plantCount}
                  onChange={(e) => setPlantCount(Number(e.target.value))}
                  className="w-full accent-neutral-950 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                  <span>2 items (Residential)</span>
                  <span>50 items (Commercial)</span>
                  <span>100+ items (Enterprise)</span>
                </div>
              </div>

              {/* Add-on toggles */}
              <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer hover:bg-neutral-100">
                  <input
                    type="checkbox"
                    checked={includePots}
                    onChange={(e) => setIncludePots(e.target.checked)}
                    className="accent-neutral-950 rounded"
                  />
                  <span className="text-neutral-700 font-medium">Include Terracotta Pots</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer hover:bg-neutral-100">
                  <input
                    type="checkbox"
                    checked={needInstallation}
                    onChange={(e) => setNeedInstallation(e.target.checked)}
                    className="accent-neutral-950 rounded"
                  />
                  <span className="text-neutral-700 font-medium">On-Site Placement Service</span>
                </label>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Gowda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#f4f4f4] border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 XXXXX"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full bg-[#f4f4f4] border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold py-3 rounded-full text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Confirm & Lock Estimate</span>
                <Truck className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
