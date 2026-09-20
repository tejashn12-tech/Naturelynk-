import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Search,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  Archive,
  ArrowUpRight,
  TrendingUp,
  Leaf,
  Layers,
  Sparkles,
} from 'lucide-react';
import { QuoteInquiry } from '../types';

interface AdminQuotesManagerProps {
  quotes: QuoteInquiry[];
  onUpdateQuoteStatus: (id: string, status: QuoteInquiry['status'], isRead?: boolean) => void;
  onDeleteQuote: (id: string) => void;
  onMarkAllQuotesRead: () => void;
}

export const AdminQuotesManager: React.FC<AdminQuotesManagerProps> = ({
  quotes,
  onUpdateQuoteStatus,
  onDeleteQuote,
  onMarkAllQuotesRead,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Fulfilled' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = quotes.filter((q) => !q.isRead).length;
  const newCount = quotes.filter((q) => q.status === 'New').length;
  const contactedCount = quotes.filter((q) => q.status === 'Contacted').length;
  const fulfilledCount = quotes.filter((q) => q.status === 'Fulfilled').length;
  const archivedCount = quotes.filter((q) => q.status === 'Archived').length;

  const totalPipelineValue = quotes.reduce((acc, q) => acc + (q.estimatedTotal || 0), 0);

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter =
      statusFilter === 'All'
        ? true
        : statusFilter === 'New'
        ? q.status === 'New' || !q.isRead
        : q.status === statusFilter;

    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const qLower = searchQuery.toLowerCase();
    return (
      q.customerName.toLowerCase().includes(qLower) ||
      q.contactNumber.toLowerCase().includes(qLower) ||
      q.locality.toLowerCase().includes(qLower) ||
      q.category.toLowerCase().includes(qLower) ||
      q.id.toLowerCase().includes(qLower)
    );
  });

  const getCleanPhone = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#f8f9fa] border border-neutral-200 rounded-2xl p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-neutral-900 text-white">
              <Bell className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-neutral-900">
              Customer Quotes & Botanical Inquiries
            </h3>
            {unreadCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Real-time inquiries dispatched by customers requesting plant batches, terracotta pots, and nursery delivery schedules in Mysuru.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllQuotesRead}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-neutral-200 rounded-2xl p-3.5">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Total Inquiries
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-neutral-900">{quotes.length}</span>
            <span className="text-[10px] text-neutral-400 font-medium">Logged</span>
          </div>
        </div>

        <div className="bg-white border border-rose-200/80 rounded-2xl p-3.5 bg-rose-50/20">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
            New / Unread
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">{unreadCount}</span>
            <span className="text-[10px] text-rose-500 font-medium">Requires follow-up</span>
          </div>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-2xl p-3.5 bg-emerald-50/20">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Pipeline Value
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">
              ₹{totalPipelineValue.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Est. Total</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-3.5">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Fulfilled Orders
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-neutral-900">{fulfilledCount}</span>
            <span className="text-[10px] text-neutral-400 font-medium">Delivered</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              statusFilter === 'All'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            All ({quotes.length})
          </button>
          <button
            onClick={() => setStatusFilter('New')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'New'
                ? 'bg-rose-600 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <span>New Leads</span>
            <span className="bg-rose-200 text-rose-900 text-[10px] px-1.5 rounded-full font-bold">
              {newCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('Contacted')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              statusFilter === 'Contacted'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            Contacted ({contactedCount})
          </button>
          <button
            onClick={() => setStatusFilter('Fulfilled')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              statusFilter === 'Fulfilled'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            Fulfilled ({fulfilledCount})
          </button>
          <button
            onClick={() => setStatusFilter('Archived')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              statusFilter === 'Archived'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, phone, locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 p-6">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No quotation inquiries found</p>
            <p className="text-xs text-neutral-400 mt-1">
              {searchQuery
                ? 'No inquiries match your current search query.'
                : 'New quotes submitted by users on the website will instantly appear here.'}
            </p>
          </div>
        ) : (
          filteredQuotes.map((inquiry) => {
            const isUnread = !inquiry.isRead;
            const waPhone = getCleanPhone(inquiry.contactNumber);
            const waMessage = encodeURIComponent(
              `Hello ${inquiry.customerName}, this is Naturelynk Mysuru regarding your botanical quotation #${inquiry.id}. You requested ${inquiry.plantCount} plants (${inquiry.category}) with delivery to ${inquiry.locality}. Estimated total is ₹${inquiry.estimatedTotal.toLocaleString()}. How may we assist you with dispatch timing?`
            );

            return (
              <div
                key={inquiry.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isUnread
                    ? 'bg-amber-50/25 border-amber-300 shadow-xs'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Header row: Customer & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    {isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                          {inquiry.customerName}
                        </h4>
                        <span className="text-[11px] font-mono text-neutral-400">
                          #{inquiry.id}
                        </span>
                        {isUnread && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            New Lead
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-0.5">
                        <span className="flex items-center gap-1 font-medium text-neutral-700">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {inquiry.locality}
                        </span>
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(inquiry.submittedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Quick Toggles */}
                  <div className="flex items-center gap-2">
                    <select
                      value={inquiry.status}
                      onChange={(e) =>
                        onUpdateQuoteStatus(
                          inquiry.id,
                          e.target.value as QuoteInquiry['status'],
                          true
                        )
                      }
                      className={`text-xs font-semibold px-3 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        inquiry.status === 'New'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : inquiry.status === 'Contacted'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : inquiry.status === 'Fulfilled'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Fulfilled">Status: Fulfilled</option>
                      <option value="Archived">Status: Archived</option>
                    </select>

                    <button
                      onClick={() => onDeleteQuote(inquiry.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                      title="Delete Quote Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs">
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-0.5">
                      Botanical Category
                    </span>
                    <span className="font-bold text-neutral-900 block">
                      {inquiry.category}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Quantity: <strong className="text-neutral-800">{inquiry.plantCount} plants</strong>
                    </span>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-0.5">
                      Add-on Inclusions
                    </span>
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${inquiry.includePots ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
                        <span>Terracotta Pots: <strong>{inquiry.includePots ? 'Yes (+₹220/ea)' : 'No'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${inquiry.needInstallation ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
                        <span>On-Site Placement: <strong>{inquiry.needInstallation ? 'Yes (+₹500)' : 'No'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-950 text-white p-2.5 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                        Estimated Quotation
                      </span>
                      <span className="text-lg font-black text-emerald-400">
                        ₹{inquiry.estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 truncate">
                      {inquiry.transitTime}
                    </span>
                  </div>
                </div>

                {inquiry.notes && (
                  <div className="text-xs bg-amber-50 border border-amber-200/60 rounded-xl p-2.5 mb-3 text-amber-950">
                    <span className="font-semibold text-amber-900">Customer Note:</span> {inquiry.notes}
                  </div>
                )}

                {/* Contact Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    {/* Direct WhatsApp chat */}
                    <a
                      href={`https://wa.me/${waPhone}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onUpdateQuoteStatus(inquiry.id, 'Contacted', true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                      <ArrowUpRight className="w-3 h-3 opacity-80" />
                    </a>

                    {/* Direct phone call */}
                    <a
                      href={`tel:${inquiry.contactNumber}`}
                      onClick={() => onUpdateQuoteStatus(inquiry.id, 'Contacted', true)}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-600" />
                      <span>{inquiry.contactNumber}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {isUnread ? (
                      <button
                        onClick={() => onUpdateQuoteStatus(inquiry.id, inquiry.status, true)}
                        className="text-neutral-500 hover:text-neutral-900 font-medium px-2 py-1 rounded cursor-pointer"
                      >
                        Mark as read
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateQuoteStatus(inquiry.id, inquiry.status, false)}
                        className="text-neutral-400 hover:text-neutral-700 font-medium px-2 py-1 rounded cursor-pointer text-[11px]"
                      >
                        Mark unread
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
