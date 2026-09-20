import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  SlidersHorizontal,
  Package,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Settings,
  ShieldCheck,
  Lock,
  X,
  Check,
  Layers,
  AlertCircle
} from 'lucide-react';
import { categories as defaultCategories } from '../data/products';
import { ProductCategory, ProductGradeType, ProductSpec } from '../types';

interface ProductLibrarySectionProps {
  categories?: ProductCategory[];
  onEnquire: (gradeName: string, categoryName: string) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onOpenAdminPanel?: (tab?: 'quotes' | 'export-catalog' | 'products' | 'trust-docs') => void;
  onAddGrade?: (categoryId: string, grade: ProductGradeType) => void;
  onEditGrade?: (categoryId: string, grade: ProductGradeType) => void;
  onDeleteGrade?: (categoryId: string, gradeId: string, gradeName?: string) => void;
  onAddCategory?: (category: ProductCategory) => void;
  onEditCategory?: (category: ProductCategory) => void;
  onDeleteCategory?: (categoryId: string, categoryName?: string) => void;
}

export const ProductLibrarySection: React.FC<ProductLibrarySectionProps> = ({
  categories = defaultCategories,
  onEnquire,
  isAdmin = false,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onAddGrade,
  onEditGrade,
  onDeleteGrade,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const activeCategories = categories && categories.length > 0 ? categories : defaultCategories;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(activeCategories[0].id);

  // References for horizontal and vertical scroll-on-select
  const categoryPillsRef = useRef<HTMLDivElement>(null);
  const categoryButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Smoothly scroll the selected category pill into center view, and scroll overview strip if needed
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);

    // 1. Horizontally scroll the clicked pill to the center of the container
    const pillElement = categoryButtonRefs.current[categoryId];
    if (pillElement) {
      pillElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    // 2. Smoothly scroll the window to bring the active commodity strip and grades into view
    setTimeout(() => {
      const activeStrip = document.getElementById('active-product-overview-strip');
      if (activeStrip) {
        const navOffset = 90;
        const rect = activeStrip.getBoundingClientRect();
        // If the overview strip is not already in prime viewing area, smoothly scroll to it
        if (rect.top < 70 || rect.top > 280) {
          const targetY = rect.top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });
        }
      }
    }, 60);
  };

  // Auto-scroll pill into view whenever selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId && categoryButtonRefs.current[selectedCategoryId]) {
      categoryButtonRefs.current[selectedCategoryId]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedCategoryId]);

  // Fallback to first category if current selectedId doesn't exist
  const activeCategory: ProductCategory =
    activeCategories.find((c) => c.id === selectedCategoryId) || activeCategories[0];

  // In-Place Category Modal State (Add / Edit Product)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    tagline: '',
    heroImage: '',
  });

  // In-Place Grade Modal State (Add / Edit Grade)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isNewGrade, setIsNewGrade] = useState(false);
  const [gradeFormData, setGradeFormData] = useState<{
    id: string;
    categoryId: string;
    name: string;
    shortDescription: string;
    image: string;
    fallbackImage: string;
    specs: ProductSpec[];
  }>({
    id: '',
    categoryId: '',
    name: '',
    shortDescription: '',
    image: '',
    fallbackImage: '',
    specs: [],
  });

  // Local notification feedback toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Guard for admin actions: strictly requires admin session
  const requireAdminAuth = (actionCallback: () => void) => {
    if (isAdmin) {
      actionCallback();
    } else if (onOpenAdminLogin) {
      onOpenAdminLogin();
    }
  };

  // Open Edit Active Product / Category Modal
  const handleOpenEditCurrentCategory = () => {
    requireAdminAuth(() => {
      setCategoryFormData({
        id: activeCategory.id,
        name: activeCategory.name,
        tagline: activeCategory.tagline,
        heroImage: activeCategory.heroImage,
      });
      setIsNewCategory(false);
      setIsCategoryModalOpen(true);
    });
  };

  // Open Add New Product / Category Modal
  const handleOpenAddNewCategory = () => {
    requireAdminAuth(() => {
      setCategoryFormData({
        id: `commodity-${Date.now().toString(36)}`,
        name: '',
        tagline: '',
        heroImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200&auto=format&fit=crop',
      });
      setIsNewCategory(true);
      setIsCategoryModalOpen(true);
    });
  };

  // Save Product / Category Form
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim() || !categoryFormData.tagline.trim()) {
      showToast('error', 'Product name and description/tagline are required.');
      return;
    }

    const cleanId =
      categoryFormData.id ||
      categoryFormData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

    if (isNewCategory) {
      const newCat: ProductCategory = {
        id: cleanId,
        name: categoryFormData.name.trim(),
        tagline: categoryFormData.tagline.trim(),
        heroImage:
          categoryFormData.heroImage.trim() ||
          'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200&auto=format&fit=crop',
        types: [],
      };
      if (onAddCategory) {
        onAddCategory(newCat);
      }
      setSelectedCategoryId(newCat.id);
      showToast('success', `Product "${newCat.name}" added to export library.`);
    } else {
      const updatedCat: ProductCategory = {
        id: activeCategory.id,
        name: categoryFormData.name.trim(),
        tagline: categoryFormData.tagline.trim(),
        heroImage: categoryFormData.heroImage.trim() || activeCategory.heroImage,
        types: activeCategory.types || [],
      };
      if (onEditCategory) {
        onEditCategory(updatedCat);
      }
      showToast('success', `Product "${updatedCat.name}" updated successfully.`);
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Current Product / Category
  const handleDeleteCurrentCategory = () => {
    requireAdminAuth(() => {
      if (activeCategories.length <= 1) {
        alert('You must have at least one product category in the export catalog.');
        return;
      }
      if (onDeleteCategory) {
        onDeleteCategory(activeCategory.id, activeCategory.name);
      }
    });
  };

  // Open Add Grade Modal for Active Product
  const handleOpenAddGrade = (targetCatId?: string) => {
    requireAdminAuth(() => {
      const catId = targetCatId || activeCategory.id;
      let initialSpecs: ProductSpec[] = [
        { label: 'Grade Code', value: '' },
        { label: 'Moisture', value: '≤ 12.0%' },
      ];

      if (catId.includes('coffee')) {
        initialSpecs = [
          { label: 'Grade Code', value: '' },
          { label: 'Screen Size', value: 'Screen 18 (7.10 mm)' },
          { label: 'Moisture', value: '10.5% – 12.5%' },
          { label: 'Processing', value: 'Fully Washed' },
        ];
      } else if (catId.includes('pepper')) {
        initialSpecs = [
          { label: 'Grade Code', value: '' },
          { label: 'Bulk Density', value: '550 – 580 g/L' },
          { label: 'Moisture', value: '≤ 11.5%' },
          { label: 'Piperine', value: '4.5% – 5.0%' },
        ];
      } else if (catId.includes('cardamom')) {
        initialSpecs = [
          { label: 'Pod Size', value: '7.0 mm – 8.0 mm' },
          { label: 'Essential Oil', value: '7.0% – 8.0%' },
          { label: 'Moisture', value: '9.5% – 11.0%' },
        ];
      } else if (catId.includes('turmeric')) {
        initialSpecs = [
          { label: 'Curcumin Content', value: '4.0% – 5.0%' },
          { label: 'Moisture', value: '≤ 10.0%' },
          { label: 'Origin Region', value: 'South India' },
        ];
      }

      setGradeFormData({
        id: `grade-${Date.now().toString(36)}`,
        categoryId: catId,
        name: '',
        shortDescription: '',
        image: `/images/products/${catId}-grade-${Date.now().toString(36)}.jpg`,
        fallbackImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
        specs: initialSpecs,
      });
      setIsNewGrade(true);
      setIsGradeModalOpen(true);
    });
  };

  // Open Edit Grade Modal
  const handleOpenEditGrade = (grade: ProductGradeType) => {
    requireAdminAuth(() => {
      setGradeFormData({
        id: grade.id,
        categoryId: activeCategory.id,
        name: grade.name,
        shortDescription: grade.shortDescription,
        image: grade.image,
        fallbackImage: grade.fallbackImage || '',
        specs: grade.specs && grade.specs.length > 0 ? [...grade.specs] : [{ label: 'Grade Code', value: grade.name }],
      });
      setIsNewGrade(false);
      setIsGradeModalOpen(true);
    });
  };

  // Save Grade Form
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeFormData.name.trim() || !gradeFormData.shortDescription.trim()) {
      showToast('error', 'Grade name and short description are required.');
      return;
    }

    const cleanSpecs = gradeFormData.specs.filter((s) => s.label.trim() && s.value.trim());

    const gradePayload: ProductGradeType = {
      id: gradeFormData.id || `grade-${Date.now().toString(36)}`,
      name: gradeFormData.name.trim(),
      shortDescription: gradeFormData.shortDescription.trim(),
      image: gradeFormData.image.trim() || `/images/products/${gradeFormData.categoryId}-${gradeFormData.id}.jpg`,
      fallbackImage: gradeFormData.fallbackImage.trim() || undefined,
      specs: cleanSpecs.length > 0 ? cleanSpecs : [{ label: 'Grade Code', value: gradeFormData.name.trim() }],
    };

    if (isNewGrade) {
      if (onAddGrade) {
        onAddGrade(gradeFormData.categoryId, gradePayload);
      }
      showToast('success', `Added export grade "${gradePayload.name}".`);
    } else {
      if (onEditGrade) {
        onEditGrade(gradeFormData.categoryId, gradePayload);
      }
      showToast('success', `Updated export grade "${gradePayload.name}".`);
    }

    setIsGradeModalOpen(false);
  };

  // Delete Grade
  const handleDeleteGrade = (grade: ProductGradeType) => {
    requireAdminAuth(() => {
      if (onDeleteGrade) {
        onDeleteGrade(activeCategory.id, grade.id, grade.name);
        showToast('success', `Deleted export grade "${grade.name}".`);
      }
    });
  };

  // Specification Rows Handlers
  const handleAddSpecRow = () => {
    setGradeFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: '', value: '' }],
    }));
  };

  const handleUpdateSpecRow = (index: number, field: 'label' | 'value', value: string) => {
    setGradeFormData((prev) => {
      const updated = [...prev.specs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specs: updated };
    });
  };

  const handleRemoveSpecRow = (index: number) => {
    setGradeFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  return (
    <section
      id="products"
      className="w-full px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto py-10 sm:py-16 scroll-mt-20"
    >
      {/* Anchor alias for legacy services links */}
      <span id="services" className="sr-only" />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed top-24 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 text-xs font-bold ${
            toastMessage.type === 'success'
              ? 'bg-neutral-950 text-white border-emerald-500/40'
              : 'bg-rose-950 text-white border-rose-500/40'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Admin Quick Action Banner (When logged in as Admin) */}
      {isAdmin && (
        <div className="mb-6 bg-neutral-950 text-white rounded-2xl p-4 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Administrator Live Editing Active
              </p>
              <p className="text-xs text-neutral-300">
                Directly add, edit, or delete export commodities and grades in real time with immediate persistence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenAddGrade(activeCategory.id)}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Grade to {activeCategory.name.split('(')[0].trim()}</span>
            </button>

            <button
              onClick={handleOpenAddNewCategory}
              className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ New Product</span>
            </button>

            {onOpenAdminPanel && (
              <button
                onClick={() => onOpenAdminPanel('export-catalog')}
                className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono tracking-widest text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded font-bold uppercase">
              02 / EXPORT TRADE CATALOG
            </span>
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              • Official Commodity Grading
            </span>
          </div>
          <h2
            id="products-heading"
            className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 mb-2"
          >
            Product Library
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Standard Indian export trade grades with laboratory moisture parameters, bulk density calibration, and screen-mesh caliber specifications for global roasters and spice distributors.
          </p>
        </div>

        {/* Global Catalog Stats */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-[#eaeaea] border border-neutral-300/70 px-3.5 py-2 rounded-2xl text-neutral-800 text-xs font-medium">
            <Package className="w-4 h-4 text-emerald-700" />
            <span>
              <strong className="font-bold text-neutral-950">
                {activeCategories.reduce((acc, c) => acc + (c.types?.length || 0), 0)}
              </strong>{' '}
              Export Grades
            </span>
          </div>
        </div>
      </div>

      {/* 3. Category Pill Selectors */}
      <div
        ref={categoryPillsRef}
        onWheel={(e) => {
          if (e.deltaY !== 0 && categoryPillsRef.current) {
            categoryPillsRef.current.scrollLeft += e.deltaY;
          }
        }}
        className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 scroll-smooth scrollbar-none mb-6 snap-x snap-proximity scroll-px-3 select-none"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {activeCategories.map((category) => {
          const isActive = category.id === activeCategory.id;
          return (
            <button
              key={category.id}
              ref={(el) => {
                categoryButtonRefs.current[category.id] = el;
              }}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 snap-center ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-md ring-2 ring-neutral-950/20 scale-[1.02]'
                  : 'bg-[#ebeae6] hover:bg-[#dfded9] text-neutral-700 border border-neutral-300/60 hover:scale-[1.01]'
              }`}
            >
              <span>{category.name.split('(')[0].trim()}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-200/80 text-neutral-600'
                }`}
              >
                {category.types?.length || 0}
              </span>
            </button>
          );
        })}

        {/* Add New Commodity Quick Button (Admin Only) */}
        {isAdmin && (
          <button
            onClick={handleOpenAddNewCategory}
            className="px-3.5 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 snap-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/70"
            title="Add a new commodity product line"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* 4. Active Category Overview Strip */}
      {/* Target CSS element: div#root > div > main > section#products > div:nth-of-type(3) */}
      <div
        id="active-product-overview-strip"
        className="bg-[#f0f0ed] border border-neutral-300/80 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xs relative overflow-hidden"
      >
        {/* Left Side: Product Details */}
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                {activeCategory.name}
              </h3>
              <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-300">
                {activeCategory.types?.length || 0} Standard Grades Registered
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
              {activeCategory.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 text-xs text-neutral-600 border-t border-neutral-300/50">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Phytosanitary Certified</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Custom Export Packing (Jute / GrainPro / Vacuum)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Admin Control Actions Bar (Exclusively rendered when isAdmin is true) */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-neutral-300/70">
            {/* Edit Current Product Commodity */}
            <button
              onClick={handleOpenEditCurrentCategory}
              className="px-3 py-2 text-xs font-bold text-neutral-800 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Edit this commodity's name, origin or description"
            >
              <Edit2 className="w-3.5 h-3.5 text-neutral-600" />
              <span>Edit Product</span>
            </button>

            {/* Add Grade to this Product */}
            <button
              onClick={() => handleOpenAddGrade(activeCategory.id)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Add a new grade under this commodity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Grade</span>
            </button>

            {/* Add New Product Category */}
            <button
              onClick={handleOpenAddNewCategory}
              className="px-3 py-2 text-xs font-bold text-neutral-800 bg-neutral-200/90 hover:bg-neutral-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Create a new export product commodity"
            >
              <Layers className="w-3.5 h-3.5 text-neutral-700" />
              <span>New Product</span>
            </button>

            {/* Delete this Commodity */}
            {activeCategories.length > 1 && (
              <button
                onClick={handleDeleteCurrentCategory}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                title="Delete this product category and all its grades"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. Responsive Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
      {activeCategory.types && activeCategory.types.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {activeCategory.types.map((grade: ProductGradeType) => (
            <div
              key={grade.id}
              className="bg-[#f0f0ed] hover:bg-[#ebeae6] rounded-[22px] p-4 sm:p-5 flex flex-col justify-between border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300 group relative"
            >
              <div>
                {/* Card Header Image with Grade Badge */}
                <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-neutral-200 mb-4">
                  <img
                    src={grade.image}
                    alt={grade.name}
                    onError={(e) => {
                      if (grade.fallbackImage && e.currentTarget.src !== grade.fallbackImage) {
                        e.currentTarget.src = grade.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Grade Code Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-neutral-950/90 text-white font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs tracking-wider border border-white/20">
                    {grade.specs[0]?.value || grade.name}
                  </div>

                  {/* In-Card Admin Action Buttons (Admin Only) */}
                  {isAdmin && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditGrade(grade);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-950/80 hover:bg-neutral-950 text-white transition-colors backdrop-blur-xs cursor-pointer shadow-xs"
                        title="Edit this grade"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGrade(grade);
                        }}
                        className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition-colors backdrop-blur-xs cursor-pointer shadow-xs"
                        title="Delete this grade"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Grade Name */}
                <h4 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight mb-1.5 group-hover:text-emerald-950 transition-colors">
                  {grade.name}
                </h4>

                {/* 1-2 line short description */}
                <p className="text-xs text-neutral-600 leading-relaxed mb-4 min-h-[34px]">
                  {grade.shortDescription}
                </p>

                {/* Specs Table / Chips */}
                <div className="bg-[#e4e3de] rounded-xl p-2.5 mb-4 border border-neutral-300/60 space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 font-bold">
                    <SlidersHorizontal className="w-3 h-3 text-neutral-600" />
                    <span>Trade Specifications</span>
                  </div>
                  {grade.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[11px] py-0.5 border-b border-neutral-300/40 last:border-b-0"
                    >
                      <span className="text-neutral-600">{spec.label}</span>
                      <span className="font-semibold text-neutral-900 text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Enquire About This Grade */}
              <button
                onClick={() => onEnquire(grade.name, activeCategory.name)}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer group/btn shadow-xs"
              >
                <span>Enquire about this</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          ))}

          {/* "+ Add Grade" Action Card in Grid (Admin Only) */}
          {isAdmin && (
            <div
              onClick={() => handleOpenAddGrade(activeCategory.id)}
              className="bg-[#f0f0ed]/60 hover:bg-[#f0f0ed] border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-[22px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[320px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-neutral-950 text-neutral-700 group-hover:text-white flex items-center justify-center shadow-xs transition-colors mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-bold text-neutral-900 mb-1">
                Add New Export Grade
              </h5>
              <p className="text-xs text-neutral-500 max-w-[200px] mb-4 leading-relaxed">
                Register a new size caliber or processing grade for {activeCategory.name.split('(')[0].trim()}.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:underline">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Grade</span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#f0f0ed] border border-dashed border-neutral-300 rounded-3xl p-10 text-center">
          <Package className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <h4 className="text-base font-bold text-neutral-800">No grades registered in this category</h4>
          <p className="text-xs text-neutral-500 mb-4">
            {isAdmin
              ? 'Click below to add the first export grade or trade classification.'
              : 'Our trade specialists are currently updating the certified lots for this commodity.'}
          </p>
          {isAdmin && (
            <button
              onClick={() => handleOpenAddGrade(activeCategory.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Grade Now</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT / COMMODITY ADD & EDIT MODAL (Admin Only)                         */}
      {/* ========================================================================= */}
      {isAdmin && isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {isNewCategory ? 'Add Export Product' : 'Edit Export Product'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {isNewCategory
                      ? 'Add a new agricultural commodity to the public export library'
                      : 'Update commodity designation, origin, and overview'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Product Name & Origin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coffee (Arabica & Robusta, Karnataka)"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Tagline / Processing Overview <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Washed Arabica is called Plantation, washed Robusta is Parchment, and naturally/dry-processed beans are Cherry."
                  value={categoryFormData.tagline}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, tagline: e.target.value })}
                  className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={categoryFormData.heroImage}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, heroImage: e.target.value })}
                  className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isNewCategory ? 'Create Product' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPORT GRADE ADD & EDIT MODAL (Admin Only)                                */}
      {/* ========================================================================= */}
      {isAdmin && isGradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center">
                  <Package className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {isNewGrade ? 'Add Export Grade' : 'Edit Export Grade'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Target Commodity: <strong className="text-neutral-800">{activeCategory.name.split('(')[0].trim()}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGradeModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Grade Name & Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plantation AAA, Malabar Garbled 550GL, etc."
                  value={gradeFormData.name}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, name: e.target.value })}
                  className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Short Description & Sourcing Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Washed Arabica, largest screen caliber, zero primary defects."
                  value={gradeFormData.shortDescription}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, shortDescription: e.target.value })}
                  className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="/images/products/... or https://..."
                    value={gradeFormData.image}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, image: e.target.value })}
                    className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Fallback Unsplash Image
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={gradeFormData.fallbackImage}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, fallbackImage: e.target.value })}
                    className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              {/* Specifications Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-800">
                    Laboratory Trade Specifications
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                <div className="space-y-2 bg-[#f6f6f5] p-3 rounded-xl border border-neutral-300/80">
                  {gradeFormData.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Parameter (e.g. Screen Size)"
                        value={spec.label}
                        onChange={(e) => handleUpdateSpecRow(idx, 'label', e.target.value)}
                        className="w-1/3 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Screen 18 (7.10 mm))"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                        className="flex-1 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      />
                      {gradeFormData.specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isNewGrade ? 'Save New Grade' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
