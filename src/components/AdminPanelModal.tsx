import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Package,
  FileCheck,
  ShieldCheck,
  Upload,
  LogOut,
  Save,
  Check,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Eye,
  Bell,
  Layers,
} from 'lucide-react';
import { ProductItem, TrustDocument, QuoteInquiry, ProductCategory, ProductGradeType } from '../types';
import { AdminQuotesManager } from './AdminQuotesManager';
import { AdminExportCatalogManager } from './AdminExportCatalogManager';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  products: ProductItem[];
  trustDocs: TrustDocument[];
  quotes?: QuoteInquiry[];
  exportCategories?: ProductCategory[];
  onAddProduct: (product: ProductItem) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onAddTrustDoc: (doc: TrustDocument) => void;
  onUpdateTrustDoc: (doc: TrustDocument) => void;
  onDeleteTrustDoc: (docId: string) => void;
  onAddExportGrade?: (categoryId: string, grade: ProductGradeType) => void;
  onUpdateExportGrade?: (categoryId: string, grade: ProductGradeType) => void;
  onDeleteExportGrade?: (categoryId: string, gradeId: string) => void;
  onAddCategory?: (category: ProductCategory) => void;
  onUpdateCategory?: (category: ProductCategory) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onResetExportCatalog?: () => void;
  onUpdateQuoteStatus?: (id: string, status: QuoteInquiry['status'], isRead?: boolean) => void;
  onDeleteQuote?: (id: string) => void;
  onMarkAllQuotesRead?: () => void;
  initialTab?: 'quotes' | 'export-catalog' | 'products' | 'trust-docs';
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  products,
  trustDocs,
  quotes = [],
  exportCategories = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddTrustDoc,
  onUpdateTrustDoc,
  onDeleteTrustDoc,
  onAddExportGrade,
  onUpdateExportGrade,
  onDeleteExportGrade,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetExportCatalog,
  onUpdateQuoteStatus,
  onDeleteQuote,
  onMarkAllQuotesRead,
  initialTab = 'quotes',
}) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'export-catalog' | 'products' | 'trust-docs'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Product Form state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({
    title: '',
    category: 'Plants & Foliage',
    description: '',
    origin: 'Chamundi Foothills Nursery, Mysuru',
    imageUrl: '',
    estimatedPrice: '₹1,200',
    careLevel: 'Moderate indirect light',
    specs: [
      { label: 'Mature Height', value: '3.0 – 4.5 ft' },
      { label: 'Soil Formula', value: 'Mysuru Red Loam' },
    ],
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Trust Doc Form state
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [docForm, setDocForm] = useState<Partial<TrustDocument>>({
    title: '',
    issuer: '',
    regNumber: '',
    category: 'Government License',
    issueDate: '',
    validTill: '',
    status: 'Verified & Active',
    description: '',
    fileUrl: '',
    fileType: 'pdf',
  });
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // Notification / Feedback banner
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  // --- Product Handlers ---
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      category: 'Plants & Foliage',
      description: '',
      origin: 'Chamundi Foothills Nursery, Mysuru',
      imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop',
      estimatedPrice: '₹950',
      careLevel: 'Indirect bright light',
      specs: [
        { label: 'Mature Height', value: '2.5 – 4.0 ft' },
        { label: 'Soil Formula', value: 'Mysuru Red Loam' },
      ],
    });
    setIsEditingProduct(true);
  };

  const handleEditProduct = (prod: ProductItem) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description) {
      showFeedback('error', 'Please fill in required fields.');
      return;
    }

    if (editingProductId) {
      onUpdateProduct({
        ...productForm,
        id: editingProductId,
      } as ProductItem);
      showFeedback('success', `Product "${productForm.title}" updated successfully.`);
    } else {
      const newProd: ProductItem = {
        ...productForm,
        id: `prod-${Date.now()}`,
        specs: productForm.specs || [],
        imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop',
      } as ProductItem;
      onAddProduct(newProd);
      showFeedback('success', `Product "${productForm.title}" added to gallery.`);
    }

    setIsEditingProduct(false);
  };

  const handleDeleteProductConfirm = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteProduct(id);
      showFeedback('success', `Product "${title}" removed.`);
    }
  };

  // --- Trust Doc Handlers ---
  const handleOpenNewDoc = () => {
    setEditingDocId(null);
    setDocForm({
      title: '',
      issuer: 'Directorate of Horticulture, Govt. of Karnataka',
      regNumber: `KA-DOC-${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'Government License',
      issueDate: '01 Jan 2025',
      validTill: '31 Dec 2027',
      status: 'Verified & Active',
      description: '',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
      fileType: 'pdf',
    });
    setIsEditingDoc(true);
  };

  const handleEditDoc = (doc: TrustDocument) => {
    setEditingDocId(doc.id);
    setDocForm({ ...doc });
    setIsEditingDoc(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocForm((prev) => ({
          ...prev,
          fileUrl: reader.result as string,
        }));
        showFeedback('success', `File "${file.name}" loaded ready to upload.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.issuer || !docForm.regNumber) {
      showFeedback('error', 'Please fill in title, issuer, and registration number.');
      return;
    }

    if (editingDocId) {
      onUpdateTrustDoc({
        ...docForm,
        id: editingDocId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin@123',
      } as TrustDocument);
      showFeedback('success', `Trust document "${docForm.title}" updated.`);
    } else {
      const newDoc: TrustDocument = {
        ...docForm,
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin@123',
        fileUrl: docForm.fileUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
      } as TrustDocument;
      onAddTrustDoc(newDoc);
      showFeedback('success', `Trust document "${docForm.title}" published to public site.`);
    }

    setIsEditingDoc(false);
  };

  const handleDeleteDocConfirm = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete trust document "${title}"? This will remove it from the public trust vault.`)) {
      onDeleteTrustDoc(id);
      showFeedback('success', `Trust document removed.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl border border-neutral-300 flex flex-col h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Center Header */}
        <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider uppercase">
                  Naturelynk Control Center
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  admin@123
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">
                Mysuru Hub Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLogout}
              className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Statistics Ribbon */}
        <div className="bg-[#f5f5f5] px-6 py-3 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('quotes');
                setIsEditingProduct(false);
                setIsEditingDoc(false);
              }}
              className={`text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Quotes & Leads ({quotes.length})</span>
              {quotes.filter((q) => !q.isRead).length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse shadow-xs">
                  {quotes.filter((q) => !q.isRead).length} new
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('export-catalog');
                setIsEditingProduct(false);
                setIsEditingDoc(false);
              }}
              className={`text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'export-catalog'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Export Catalog ({exportCategories.reduce((acc, c) => acc + (c.types?.length || 0), 0)})
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setIsEditingProduct(false);
                setIsEditingDoc(false);
              }}
              className={`text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Nursery Collections ({products.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('trust-docs');
                setIsEditingDoc(false);
                setIsEditingProduct(false);
              }}
              className={`text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'trust-docs'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Trust Documents & Certifications ({trustDocs.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Public Sync Enabled</span>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 shrink-0 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {/* ================= QUOTES & LEADS TAB ================= */}
          {activeTab === 'quotes' && (
            <AdminQuotesManager
              quotes={quotes}
              onUpdateQuoteStatus={onUpdateQuoteStatus || (() => {})}
              onDeleteQuote={onDeleteQuote || (() => {})}
              onMarkAllQuotesRead={onMarkAllQuotesRead || (() => {})}
            />
          )}

          {/* ================= EXPORT PRODUCT CATALOG TAB (COFFEE, SPICES) ================= */}
          {activeTab === 'export-catalog' && (
            <AdminExportCatalogManager
              categories={exportCategories}
              onAddGrade={onAddExportGrade || (() => {})}
              onUpdateGrade={onUpdateExportGrade || (() => {})}
              onDeleteGrade={onDeleteExportGrade || (() => {})}
              onAddCategory={onAddCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
              onResetCatalog={onResetExportCatalog}
            />
          )}

          {/* ================= PRODUCTS TAB ================= */}
          {activeTab === 'products' && (
            <div>
              {!isEditingProduct ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-neutral-900">
                        Live Products & Signature Collections
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Items currently visible to clients on the Naturelynk public website gallery.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewProduct}
                      className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Product Cards Table / Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#f9f9f9] border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-neutral-200">
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-neutral-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                              {prod.category}
                            </span>
                            <span className="absolute bottom-2 right-2 bg-white/95 text-neutral-900 font-bold text-xs px-2 py-0.5 rounded shadow-xs">
                              {prod.estimatedPrice}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-neutral-900 leading-tight mb-1">
                            {prod.title}
                          </h5>
                          <p className="text-[11px] text-neutral-500 mb-2 font-mono">
                            {prod.origin}
                          </p>
                          <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                            {prod.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400 font-mono">
                            ID: {prod.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProductConfirm(prod.id, prod.title)}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit / Add Product Form */
                <div className="max-w-2xl mx-auto bg-[#f9f9f9] border border-neutral-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                    <h4 className="text-base font-bold text-neutral-900">
                      {editingProductId ? 'Edit Product Details' : 'Add New Product to Gallery'}
                    </h4>
                    <button
                      onClick={() => setIsEditingProduct(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.title || ''}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="e.g. Rare Ficus Bonsai Specimen"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Category
                        </label>
                        <select
                          value={productForm.category || 'Plants & Foliage'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                        >
                          <option value="Plants & Foliage">Plants & Foliage</option>
                          <option value="Planters & Ceramics">Planters & Ceramics</option>
                          <option value="Tools & Nutrition">Tools & Nutrition</option>
                          <option value="Herbal & Sandalwood">Herbal & Sandalwood</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Estimated Price
                        </label>
                        <input
                          type="text"
                          value={productForm.estimatedPrice || ''}
                          onChange={(e) => setProductForm({ ...productForm, estimatedPrice: e.target.value })}
                          placeholder="e.g. ₹1,250 – ₹3,800"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Origin / Nursery Location in Mysuru
                      </label>
                      <input
                        type="text"
                        value={productForm.origin || ''}
                        onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                        placeholder="e.g. Chamundi Foothills Nursery, Mysuru"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Image URL (Unsplash or direct image link)
                      </label>
                      <input
                        type="url"
                        value={productForm.imageUrl || ''}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono text-xs focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                      {productForm.imageUrl && (
                        <div className="mt-2 h-28 w-28 rounded-lg overflow-hidden border border-neutral-300">
                          <img
                            src={productForm.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Enter botanical traits, care characteristics, and details..."
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingProductId ? 'Save Changes' : 'Publish Product'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================= TRUST DOCUMENTS TAB ================= */}
          {activeTab === 'trust-docs' && (
            <div>
              {!isEditingDoc ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-neutral-900">
                        Official Trust Documents & Verification Vault
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Only uploaded by admin. Once uploaded, these certificates are automatically displayed on the public site to build user trust.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewDoc}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload New Trust Document</span>
                    </button>
                  </div>

                  {/* Documents Grid in Admin */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trustDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-[#f9f9f9] border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-semibold">
                              {doc.category}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {doc.status}
                            </span>
                          </div>

                          <h5 className="font-bold text-base text-neutral-900 leading-tight mb-1">
                            {doc.title}
                          </h5>

                          <p className="text-xs font-semibold text-neutral-700 mb-1">
                            {doc.issuer}
                          </p>

                          <div className="text-[11px] font-mono text-neutral-500 mb-3 space-y-0.5 bg-white p-2 rounded-lg border border-neutral-200">
                            <div>Reg: <span className="font-bold text-neutral-900">{doc.regNumber}</span></div>
                            <div>Valid: <span className="text-emerald-700 font-semibold">{doc.validTill}</span></div>
                          </div>

                          <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                            {doc.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                            <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors"
                              title="View Document file"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleEditDoc(doc)}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer"
                              title="Edit Document details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocConfirm(doc.id, doc.title)}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Upload / Edit Document Form */
                <div className="max-w-2xl mx-auto bg-[#f9f9f9] border border-neutral-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-base font-bold text-neutral-900">
                        {editingDocId ? 'Edit Trust Document' : 'Upload Statutory Trust Document'}
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsEditingDoc(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={docForm.title || ''}
                        onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                        placeholder="e.g. Karnataka Horticulture Nursery Registration"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Category
                        </label>
                        <select
                          value={docForm.category || 'Government License'}
                          onChange={(e) =>
                            setDocForm({
                              ...docForm,
                              category: e.target.value as TrustDocument['category'],
                            })
                          }
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                        >
                          <option value="Government License">Government License</option>
                          <option value="Quality & Health">Quality & Health (Phytosanitary)</option>
                          <option value="Organic Certification">Organic Certification</option>
                          <option value="Trade Compliance">Trade Compliance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Certificate / Reg Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={docForm.regNumber || ''}
                          onChange={(e) => setDocForm({ ...docForm, regNumber: e.target.value })}
                          placeholder="e.g. KA-HORT-PQ-2025/08941"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Issuing Statutory Authority *
                      </label>
                      <input
                        type="text"
                        required
                        value={docForm.issuer || ''}
                        onChange={(e) => setDocForm({ ...docForm, issuer: e.target.value })}
                        placeholder="e.g. Mysuru City Corporation / Govt. of Karnataka"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Issue Date
                        </label>
                        <input
                          type="text"
                          value={docForm.issueDate || ''}
                          onChange={(e) => setDocForm({ ...docForm, issueDate: e.target.value })}
                          placeholder="e.g. 15 Jan 2025"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">
                          Valid Till / Expiration
                        </label>
                        <input
                          type="text"
                          value={docForm.validTill || ''}
                          onChange={(e) => setDocForm({ ...docForm, validTill: e.target.value })}
                          placeholder="e.g. 31 Dec 2027"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* File Upload / Attachment */}
                    <div className="p-4 rounded-2xl bg-white border border-neutral-300">
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Upload Certificate File or Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Local File</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-neutral-400 text-[11px]">OR paste preview URL:</span>
                        <input
                          type="url"
                          value={docForm.fileUrl || ''}
                          onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 w-full bg-[#f7f7f7] border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none"
                        />
                      </div>
                      {docForm.fileUrl && (
                        <div className="mt-3 flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                          <img
                            src={docForm.fileUrl}
                            alt="Document preview"
                            className="w-12 h-12 rounded object-cover border border-neutral-300"
                          />
                          <div className="text-[11px] text-neutral-600 truncate">
                            <span className="font-semibold block text-neutral-800">Document Attached</span>
                            <span className="font-mono text-[10px] truncate max-w-xs">{docForm.fileUrl.substring(0, 45)}...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Legal Scope / Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={docForm.description || ''}
                        onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                        placeholder="Explain the coverage, authority verification, and guarantees granted by this certificate..."
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-950 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={() => setIsEditingDoc(false)}
                        className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{editingDocId ? 'Update Certificate' : 'Publish to Trust Vault'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
