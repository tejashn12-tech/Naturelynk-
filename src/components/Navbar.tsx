import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Menu,
  X,
  MapPin,
  Lock,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  Package
} from 'lucide-react';
import { STORE_INFO, NAV_ITEMS } from '../data/storeData';
import { ProductCategory } from '../types';
import { categories as defaultCategories } from '../data/products';

interface NavbarProps {
  onOpenQuote: () => void;
  isAdmin: boolean;
  unreadQuotesCount?: number;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onLogout: () => void;
  onSelectProducts?: () => void;
  categories?: ProductCategory[];
  onSelectCategory?: (categoryId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuote,
  isAdmin,
  unreadQuotesCount = 0,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onLogout,
  onSelectProducts,
  categories,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktopProductsOpen, setIsDesktopProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const productList = categories && categories.length > 0 ? categories : defaultCategories;
  const totalGradesCount = productList.reduce((acc, cat) => acc + (cat.types?.length || 0), 0);

  // Close desktop dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        setIsDesktopProductsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDesktopProductsOpen(false);
      }
    };

    if (isDesktopProductsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDesktopProductsOpen]);

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
          {NAV_ITEMS.map((item) => {
            if (item.id === 'products') {
              return (
                <div key={item.id} ref={desktopMenuRef} className="relative">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDesktopProductsOpen((prev) => !prev);
                    }}
                    className={`hover:text-neutral-900 transition-colors py-1 cursor-pointer flex items-center gap-1.5 font-medium ${
                      isDesktopProductsOpen ? 'text-neutral-950 font-bold' : ''
                    }`}
                    aria-expanded={isDesktopProductsOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                        isDesktopProductsOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </a>

                  {/* Desktop Vertical Dropdown List (Here Itself) */}
                  {isDesktopProductsOpen && (
                    <div className="absolute top-full left-0 mt-2.5 w-80 bg-white/98 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-neutral-200/90 ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between px-2.5 pt-1 pb-2 border-b border-neutral-100">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                          Export Product Catalog
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-semibold">
                          {totalGradesCount} Grades
                        </span>
                      </div>

                      {/* Primary Option: View All Products */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsDesktopProductsOpen(false);
                          if (onSelectProducts) {
                            onSelectProducts();
                          } else if (onSelectCategory) {
                            onSelectCategory('all');
                          }
                        }}
                        className="w-full mt-1.5 p-2.5 text-left rounded-xl hover:bg-neutral-100/90 transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-neutral-200/80 bg-neutral-50/70"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                              <span>All Products Catalog</span>
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              View all {productList.length} commodities & grades
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold bg-white border border-neutral-200/80 px-2 py-0.5 rounded-md text-neutral-700 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-colors">
                          All
                        </span>
                      </button>

                      <div className="my-1.5 border-t border-neutral-100"></div>

                      {/* Vertical List of Products */}
                      <div className="space-y-1 max-h-[340px] overflow-y-auto pr-0.5">
                        {productList.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setIsDesktopProductsOpen(false);
                              if (onSelectCategory) {
                                onSelectCategory(cat.id);
                              } else if (onSelectProducts) {
                                onSelectProducts();
                              }
                            }}
                            className="w-full p-2 text-left rounded-xl hover:bg-neutral-100/90 transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-neutral-200/60"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={cat.heroImage}
                                alt={cat.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    cat.types?.[0]?.fallbackImage ||
                                    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=200&auto=format&fit=crop';
                                }}
                                className="w-9 h-9 rounded-lg object-cover border border-neutral-200/60 shrink-0"
                              />
                              <div className="truncate">
                                <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-emerald-900 transition-colors">
                                  {cat.name.split('(')[0].trim()}
                                </div>
                                <div className="text-[10px] text-neutral-500 truncate">
                                  {cat.name.includes('(')
                                    ? cat.name.split('(')[1].replace(')', '')
                                    : 'Certified Export Grade'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                                {cat.types?.length || 0} grades
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={item.id}
                href={item.href}
                className="hover:text-neutral-900 transition-colors py-1 cursor-pointer"
              >
                {item.label}
              </a>
            );
          })}
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
          {isAdmin && (
            <button
              onClick={onOpenAdminPanel}
              className="relative bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
            >
              <span>Admin</span>
              {unreadQuotesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              )}
            </button>
          )}

          <button
            onClick={onOpenQuote}
            className="bg-neutral-950 text-white text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
          >
            Quote
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-950 rounded-lg focus:outline-none cursor-pointer"
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
            {NAV_ITEMS.map((item) => {
              if (item.id === 'products') {
                return (
                  <React.Fragment key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileProductsOpen((prev) => !prev);
                      }}
                      className={`py-2.5 px-3 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer active:scale-98 flex items-center justify-between font-semibold ${
                        isMobileProductsOpen
                          ? 'bg-neutral-100 text-neutral-950'
                          : 'text-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          {productList.length} Products
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                          isMobileProductsOpen ? 'rotate-180 text-neutral-900' : ''
                        }`}
                      />
                    </a>

                    {/* Vertical Products List Right Here Itself */}
                    {isMobileProductsOpen && (
                      <div className="my-1 pl-2.5 pr-2 py-2 bg-neutral-50/90 rounded-2xl border border-neutral-200/80 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* 1. All Products option */}
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            if (onSelectProducts) {
                              onSelectProducts();
                            } else if (onSelectCategory) {
                              onSelectCategory('all');
                            }
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs font-bold text-neutral-900 hover:bg-white flex items-center justify-between transition-colors border border-transparent hover:border-neutral-200 bg-white/70 shadow-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                              <Layers className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-neutral-950 text-xs">
                                All Products Catalog
                              </div>
                              <div className="text-[10px] text-neutral-500 font-normal">
                                Full catalog ({totalGradesCount} grades)
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md font-semibold">
                            All
                          </span>
                        </button>

                        <div className="my-1 border-t border-neutral-200/60"></div>

                        {/* 2. Vertical list of each individual product category */}
                        {productList.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (onSelectCategory) {
                                onSelectCategory(cat.id);
                              } else if (onSelectProducts) {
                                onSelectProducts();
                              }
                            }}
                            className="w-full text-left p-2 rounded-xl text-xs font-medium text-neutral-800 hover:text-neutral-950 hover:bg-white flex items-center justify-between transition-colors border border-transparent hover:border-neutral-200/60 cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={cat.heroImage}
                                alt={cat.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    cat.types?.[0]?.fallbackImage ||
                                    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=200&auto=format&fit=crop';
                                }}
                                className="w-8 h-8 rounded-lg object-cover border border-neutral-200/60 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-semibold text-neutral-900 block truncate">
                                  {cat.name.split('(')[0].trim()}
                                </span>
                                <span className="text-[10px] text-neutral-500 block truncate">
                                  {cat.name.includes('(')
                                    ? cat.name.split('(')[1].replace(')', '')
                                    : 'Certified Export Grade'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-200/70 px-1.5 py-0.5 rounded-md">
                                {cat.types?.length || 0}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer active:scale-98 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
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
