import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DarkFeatureBanner } from './components/DarkFeatureBanner';
import { ProductLibrarySection } from './components/ProductLibrarySection';
import { ProcessSection } from './components/ProcessSection';
import { TrustDocumentsSection } from './components/TrustDocumentsSection';
import { ProductGallerySection } from './components/ProductGallerySection';
import { QuoteBanner } from './components/QuoteBanner';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { DocumentInspectionModal } from './components/DocumentInspectionModal';
import { ProductItem, TrustDocument, QuoteInquiry, ProductCategory, ProductGradeType } from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredTrustDocs,
  saveStoredTrustDocs,
  getStoredQuotes,
  saveStoredQuotes,
  getAdminAuth,
  setAdminAuth,
  getStoredExportCategories,
  saveStoredExportCategories,
} from './data/storage';
import {
  subscribeQuotes,
  saveQuoteToFirestore,
  updateQuoteInFirestore,
  deleteQuoteFromFirestore,
  subscribeExportCategories,
  saveExportCategoryToFirestore,
  deleteExportCategoryFromFirestore,
  subscribeTrustDocs,
  saveTrustDocToFirestore,
  deleteTrustDocFromFirestore,
  subscribeProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
} from './lib/firebase';
import { ShieldCheck, Plus, Bell, X, ArrowUpRight, CheckCircle2, Database } from 'lucide-react';

export default function App() {
  // Products, Trust Documents & Quote Leads State (persistent with initial seed)
  const [products, setProducts] = useState<ProductItem[]>(() => getStoredProducts());
  const [exportCategories, setExportCategories] = useState<ProductCategory[]>(() =>
    getStoredExportCategories()
  );
  const [trustDocs, setTrustDocs] = useState<TrustDocument[]>(() => getStoredTrustDocs());
  const [quotes, setQuotes] = useState<QuoteInquiry[]>(() => getStoredQuotes());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getAdminAuth());

  // Real-time admin notification toast
  const [adminAlert, setAdminAlert] = useState<QuoteInquiry | null>(null);

  // Modal Visibility States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('Exotic Indoor Flora');
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<TrustDocument | null>(null);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<
    'quotes' | 'export-catalog' | 'products' | 'trust-docs'
  >('quotes');

  // Sync state to localStorage as fallback cache
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredExportCategories(exportCategories);
  }, [exportCategories]);

  useEffect(() => {
    saveStoredTrustDocs(trustDocs);
  }, [trustDocs]);

  useEffect(() => {
    saveStoredQuotes(quotes);
  }, [quotes]);

  // Real-time Firestore Cloud Database Synchronization
  useEffect(() => {
    const unsubQuotes = subscribeQuotes((items) => {
      if (items && items.length > 0) {
        setQuotes(items);
      }
    });

    const unsubExportCats = subscribeExportCategories((cats) => {
      if (cats && cats.length > 0) {
        setExportCategories(cats);
      }
    });

    const unsubTrustDocs = subscribeTrustDocs((docs) => {
      if (docs && docs.length > 0) {
        setTrustDocs(docs);
      }
    });

    const unsubProducts = subscribeProducts((prods) => {
      if (prods && prods.length > 0) {
        setProducts(prods);
      }
    });

    return () => {
      unsubQuotes();
      unsubExportCats();
      unsubTrustDocs();
      unsubProducts();
    };
  }, []);

  // Ensure visitors start at the top showing the Hero page
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // If no specific anchor is in the URL, guarantee starting at the top
    if (!window.location.hash || window.location.hash === '#home') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Admin access shortcuts (#admin, ?admin=true, or Alt+A / Ctrl+Shift+A)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setIsAdminLoginOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsAdminLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadQuotesCount = quotes.filter((q) => !q.isRead).length;

  // Quote Submission Handler (Persists to Firestore + notifies Admin)
  const handleQuoteSubmitted = (newQuote: QuoteInquiry) => {
    setQuotes((prev) => [newQuote, ...prev]);
    saveQuoteToFirestore(newQuote).catch((err) =>
      console.warn('Failed to persist quote to Firestore:', err)
    );
    // Trigger real-time Admin notification ONLY if admin is logged in
    if (isAdmin) {
      setAdminAlert(newQuote);
    }
  };

  const handleUpdateQuoteStatus = (
    quoteId: string,
    status: QuoteInquiry['status'],
    isRead?: boolean
  ) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          return {
            ...q,
            status,
            isRead: isRead !== undefined ? isRead : q.isRead,
          };
        }
        return q;
      })
    );
    const updates: Partial<QuoteInquiry> = { status };
    if (isRead !== undefined) updates.isRead = isRead;
    updateQuoteInFirestore(quoteId, updates).catch((err) =>
      console.warn('Failed to update quote in Firestore:', err)
    );
  };

  const handleDeleteQuote = (quoteId: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    deleteQuoteFromFirestore(quoteId).catch((err) =>
      console.warn('Failed to delete quote from Firestore:', err)
    );
  };

  const handleMarkAllQuotesRead = () => {
    setQuotes((prev) => prev.map((q) => ({ ...q, isRead: true })));
    quotes.forEach((q) => {
      if (!q.isRead) {
        updateQuoteInFirestore(q.id, { isRead: true }).catch((err) =>
          console.warn('Failed to mark quote as read in Firestore:', err)
        );
      }
    });
  };

  // Product CRUD Handlers (Botanical Nursery Collection)
  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
    saveProductToFirestore(newProduct).catch((err) =>
      console.warn('Failed to save product to Firestore:', err)
    );
  };

  const handleUpdateProduct = (updatedProduct: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    saveProductToFirestore(updatedProduct).catch((err) =>
      console.warn('Failed to update product in Firestore:', err)
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromFirestore(productId).catch((err) =>
      console.warn('Failed to delete product from Firestore:', err)
    );
  };

  // Export Product Catalog CRUD Handlers (Coffee, Spices & Agricultural Trade Grades)
  const handleAddExportCategory = (category: ProductCategory) => {
    setExportCategories((prev) => [...prev, category]);
    saveExportCategoryToFirestore(category).catch((err) =>
      console.warn('Failed to save export category to Firestore:', err)
    );
  };

  const handleUpdateExportCategory = (updatedCat: ProductCategory) => {
    setExportCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? { ...c, ...updatedCat } : c))
    );
    const existing = exportCategories.find((c) => c.id === updatedCat.id);
    const merged = existing ? { ...existing, ...updatedCat } : updatedCat;
    saveExportCategoryToFirestore(merged).catch((err) =>
      console.warn('Failed to update export category in Firestore:', err)
    );
  };

  const handleDeleteExportCategory = (categoryId: string, categoryName?: string) => {
    if (exportCategories.length <= 1) {
      alert('At least one product category must remain in the export catalog.');
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete the product category "${categoryName || categoryId}" and all its grades?`
      )
    ) {
      return;
    }
    setExportCategories((prev) => prev.filter((c) => c.id !== categoryId));
    deleteExportCategoryFromFirestore(categoryId).catch((err) =>
      console.warn('Failed to delete export category from Firestore:', err)
    );
  };

  const handleAddExportGrade = (categoryId: string, grade: ProductGradeType) => {
    setExportCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updated = {
            ...cat,
            types: [...cat.types, grade],
          };
          saveExportCategoryToFirestore(updated).catch((err) =>
            console.warn('Failed to add export grade to Firestore:', err)
          );
          return updated;
        }
        return cat;
      })
    );
  };

  const handleUpdateExportGrade = (categoryId: string, updatedGrade: ProductGradeType) => {
    setExportCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updated = {
            ...cat,
            types: cat.types.map((g) => (g.id === updatedGrade.id ? updatedGrade : g)),
          };
          saveExportCategoryToFirestore(updated).catch((err) =>
            console.warn('Failed to update export grade in Firestore:', err)
          );
          return updated;
        }
        return cat;
      })
    );
  };

  const handleDeleteExportGrade = (categoryId: string, gradeId: string, gradeName?: string) => {
    if (gradeName) {
      if (!window.confirm(`Are you sure you want to delete "${gradeName}" from export catalog?`)) {
        return;
      }
    }
    setExportCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updated = {
            ...cat,
            types: cat.types.filter((g) => g.id !== gradeId),
          };
          saveExportCategoryToFirestore(updated).catch((err) =>
            console.warn('Failed to delete export grade from Firestore:', err)
          );
          return updated;
        }
        return cat;
      })
    );
  };

  const handleResetExportCatalog = () => {
    localStorage.removeItem('naturelink_export_categories_v2');
    setExportCategories(getStoredExportCategories());
  };

  // Trust Documents CRUD Handlers
  const handleAddTrustDoc = (newDoc: TrustDocument) => {
    setTrustDocs((prev) => [newDoc, ...prev]);
    saveTrustDocToFirestore(newDoc).catch((err) =>
      console.warn('Failed to save trust doc to Firestore:', err)
    );
  };

  const handleUpdateTrustDoc = (updatedDoc: TrustDocument) => {
    setTrustDocs((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    saveTrustDocToFirestore(updatedDoc).catch((err) =>
      console.warn('Failed to update trust doc in Firestore:', err)
    );
  };

  const handleDeleteTrustDoc = (docId: string) => {
    setTrustDocs((prev) => prev.filter((d) => d.id !== docId));
    deleteTrustDocFromFirestore(docId).catch((err) =>
      console.warn('Failed to delete trust doc from Firestore:', err)
    );
  };

  // Admin Auth Handlers
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setAdminAuth(true);
    setAdminInitialTab('quotes');
    setIsAdminPanelOpen(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminAuth(false);
    setIsAdminPanelOpen(false);
    setAdminAlert(null);
  };

  const handleOpenQuote = (category?: string) => {
    if (category) {
      setQuoteCategory(category);
    }
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteModalOpen(false);
  };

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedItem(product);
  };

  const handleScrollToProducts = () => {
    setSelectedCatalogCategory('all');
    const el = document.getElementById('products') || document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAdminQuotesTab = () => {
    setAdminInitialTab('quotes');
    setIsAdminPanelOpen(true);
    if (adminAlert) setAdminAlert(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-neutral-900 flex flex-col selection:bg-neutral-950 selection:text-white">
      {/* Admin Quick Action Banner (visible when admin is authenticated) */}
      {isAdmin && (
        <div className="bg-neutral-950 text-white px-4 py-2 border-b border-neutral-800 text-xs flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 max-w-[1240px] mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-neutral-300">Admin Mode:</span>
              <span className="font-bold text-white">admin@123</span>
              <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                <Database className="w-2.5 h-2.5 text-emerald-400" />
                Firestore Live
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => openAdminQuotesTab()}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              >
                <Bell className="w-3 h-3 text-amber-400" />
                <span>Quote Leads ({quotes.length})</span>
                {unreadQuotesCount > 0 && (
                  <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-pulse shadow-xs">
                    {unreadQuotesCount} new
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setAdminInitialTab('products');
                  setIsAdminPanelOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span className="hidden sm:inline">Manage Catalog & Docs</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-white text-[11px] underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header / Navigation Bar */}
      <Navbar
        categories={exportCategories}
        onSelectCategory={(catId) => {
          setSelectedCatalogCategory(catId);
          const el = document.getElementById('products') || document.getElementById('services');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenQuote={() => handleOpenQuote()}
        isAdmin={isAdmin}
        unreadQuotesCount={unreadQuotesCount}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => openAdminQuotesTab()}
        onLogout={handleLogout}
        onSelectProducts={handleScrollToProducts}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* 2. Hero Section */}
        <HeroSection
          onOpenQuote={() => handleOpenQuote()}
          onExploreServices={handleScrollToProducts}
        />

        {/* 3. Dark Feature Banner */}
        <DarkFeatureBanner
          onLearnMore={handleScrollToProducts}
        />

        {/* 4. Products / Export Trade Catalog (Coffee, Pepper, Cardamom, Turmeric Grades) */}
        <ProductLibrarySection
          categories={exportCategories}
          selectedCategoryId={selectedCatalogCategory}
          onSelectCategory={(catId) => setSelectedCatalogCategory(catId)}
          isAdmin={isAdmin}
          onEnquire={(gradeName, categoryName) =>
            handleOpenQuote(`${gradeName} — ${categoryName}`)
          }
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          onOpenAdminPanel={(tab) => {
            setAdminInitialTab(tab || 'export-catalog');
            setIsAdminPanelOpen(true);
          }}
          onAddGrade={handleAddExportGrade}
          onEditGrade={handleUpdateExportGrade}
          onDeleteGrade={handleDeleteExportGrade}
          onAddCategory={handleAddExportCategory}
          onEditCategory={handleUpdateExportCategory}
          onDeleteCategory={handleDeleteExportCategory}
        />

        {/* 5. Complete Turnkey Process (4-column layout with filter pills) */}
        <ProcessSection />

        {/* 6. Public Trust & Verification Documents Section (Uploadable exclusively by Admin) */}
        <TrustDocumentsSection
          documents={trustDocs}
          isAdmin={isAdmin}
          onInspectDocument={(doc) => setSelectedDoc(doc)}
          onOpenAdminPanel={() => {
            setAdminInitialTab('trust-docs');
            setIsAdminPanelOpen(true);
          }}
        />

        {/* 7. Product Gallery / Featured Collections (Dynamic: managed by Admin) */}
        <ProductGallerySection
          products={products}
          isAdmin={isAdmin}
          onOpenAdminPanel={() => {
            setAdminInitialTab('products');
            setIsAdminPanelOpen(true);
          }}
          onSelectProduct={handleSelectProduct}
          onViewAllCategories={handleScrollToGallery}
        />

        {/* 8. Bottom Quote / Estimate Banner with Cardboard Box */}
        <QuoteBanner
          onOpenQuote={() => handleOpenQuote()}
        />
      </main>

      {/* 9. Minimalist Clean Footer */}
      <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Interactive Quotation Calculator Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuote}
        defaultCategory={quoteCategory}
        onQuoteSubmitted={handleQuoteSubmitted}
      />

      {/* Interactive Product & Service Quick-View Modal */}
      <ProductDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOrderOrInquire={(title) => {
          setSelectedItem(null);
          handleOpenQuote(title);
        }}
      />

      {/* Public Trust Document Inspection Modal */}
      <DocumentInspectionModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />

      {/* Admin Login Modal (ID: admin@123, Password: admin@123) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Panel Modal: Manage Products, Trust Documents, and Live Quote Inquiries */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onLogout={handleLogout}
        products={products}
        trustDocs={trustDocs}
        quotes={quotes}
        exportCategories={exportCategories}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddTrustDoc={handleAddTrustDoc}
        onUpdateTrustDoc={handleUpdateTrustDoc}
        onDeleteTrustDoc={handleDeleteTrustDoc}
        onAddExportGrade={handleAddExportGrade}
        onUpdateExportGrade={handleUpdateExportGrade}
        onDeleteExportGrade={handleDeleteExportGrade}
        onAddCategory={handleAddExportCategory}
        onUpdateCategory={handleUpdateExportCategory}
        onDeleteCategory={handleDeleteExportCategory}
        onResetExportCatalog={handleResetExportCatalog}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
        onDeleteQuote={handleDeleteQuote}
        onMarkAllQuotesRead={handleMarkAllQuotesRead}
        initialTab={adminInitialTab}
      />

      {/* Real-time Admin Notification Banner when a customer submits a quotation (Admin Only) */}
      {isAdmin && adminAlert && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-neutral-950 text-white rounded-2xl p-4 shadow-2xl border border-amber-500/40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                    NEW QUOTE
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">#{adminAlert.id}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {adminAlert.customerName}
                </h4>
                <p className="text-[11px] text-neutral-300">
                  {adminAlert.plantCount} plants ({adminAlert.category}) to {adminAlert.locality}
                </p>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  Estimated Total: ₹{adminAlert.estimatedTotal.toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAdminAlert(null)}
              className="text-neutral-500 hover:text-white p-1 rounded-lg"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800">
            <button
              onClick={() => openAdminQuotesTab()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Review in Admin Panel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAdminAlert(null)}
              className="text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
