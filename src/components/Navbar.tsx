import React, { useState } from 'react';
import { ArrowRight, Menu, X, MapPin, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { STORE_INFO, NAV_ITEMS } from '../data/storeData';

interface NavbarProps {
  onOpenQuote: () => void;
  isAdmin: boolean;
  unreadQuotesCount?: number;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuote,
  isAdmin,
  unreadQuotesCount = 0,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full pt-4 sm:pt-6 pb-2 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-wider text-neutral-900 uppercase">
              {STORE_INFO.name}
            </span>
            <span className="text-[10px] font-medium text-neutral-500 tracking-tight flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-600" />
              Mysuru, Karnataka
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-xs lg:text-sm font-medium text-neutral-600">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="hover:text-neutral-900 transition-colors py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Admin Login */}
        <div className="hidden sm:flex items-center gap-2.5">
          {isAdmin ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-2.5 py-1">
              <button
                onClick={onOpenAdminPanel}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Console</span>
                {unreadQuotesCount > 0 && (
                  <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-pulse shadow-xs flex items-center gap-0.5">
                    <span>{unreadQuotesCount}</span>
                    <span className="text-[8px] font-mono uppercase">new</span>
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="text-neutral-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              id="admin-login-btn"
              onClick={onOpenAdminLogin}
              className="text-neutral-500 hover:text-neutral-950 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/80 hover:border-neutral-300"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenQuote}
            className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold pl-4 pr-1.5 py-2 rounded-full flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Get Quote</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center sm:hidden gap-2">
          {isAdmin ? (
            <button
              onClick={onOpenAdminPanel}
              className="relative bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
            >
              <span>Admin</span>
              {unreadQuotesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              )}
            </button>
          ) : (
            <button
              id="mobile-admin-login-btn"
              onClick={onOpenAdminLogin}
              className="text-neutral-500 hover:text-neutral-950 w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Lock className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={onOpenQuote}
            className="bg-neutral-950 text-white text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1"
          >
            Quote
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-950 rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 pt-3 pb-4 border-t border-neutral-200 bg-white/95 backdrop-blur-md rounded-2xl px-4 shadow-lg space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-neutral-700">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminPanel();
                  }}
                  className="text-xs font-bold text-emerald-800 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Open Admin Control</span>
                  {unreadQuotesCount > 0 && (
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadQuotesCount} new
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 py-1"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Admin Login Portal</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full bg-neutral-950 text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center justify-center gap-2"
            >
              <span>Calculate Delivery & Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
