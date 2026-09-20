import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { ProductCategory, ProductGradeType, ProductSpec } from '../types';

interface AdminExportCatalogManagerProps {
  categories: ProductCategory[];
  onAddGrade: (categoryId: string, grade: ProductGradeType) => void;
  onUpdateGrade: (categoryId: string, grade: ProductGradeType) => void;
  onDeleteGrade: (categoryId: string, gradeId: string) => void;
  onAddCategory?: (category: ProductCategory) => void;
  onUpdateCategory?: (category: ProductCategory) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onResetCatalog?: () => void;
}

export const AdminExportCatalogManager: React.FC<AdminExportCatalogManagerProps> = ({
  categories,
  onAddGrade,
  onUpdateGrade,
  onDeleteGrade,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCatalog,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grade Form State
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [editingGradeCategoryId, setEditingGradeCategoryId] = useState<string>(categories[0]?.id || 'coffee');
  const [isNewGrade, setIsNewGrade] = useState(false);
  const [gradeForm, setGradeForm] = useState<{
    id: string;
    name: string;
    shortDescription: string;
    image: string;
    fallbackImage: string;
    specs: ProductSpec[];
  }>({
    id: '',
    name: '',
    shortDescription: '',
    image: '',
    fallbackImage: '',
    specs: [{ label: 'Grade Code', value: '' }, { label: 'Moisture', value: '≤ 12.0%' }],
  });

  // Category Form State
  const [isEditingCategoryModal, setIsEditingCategoryModal] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<{ id: string; name: string; tagline: string; heroImage: string }>({
    id: '',
    name: '',
    tagline: '',
    heroImage: '',
  });

  // Category Handlers
  const handleOpenAddCategory = () => {
    setCategoryForm({
      id: `commodity-${Date.now().toString(36)}`,
      name: '',
      tagline: '',
      heroImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200&auto=format&fit=crop',
    });
    setIsNewCategory(true);
    setIsEditingCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: ProductCategory) => {
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      tagline: cat.tagline,
      heroImage: cat.heroImage,
    });
    setIsNewCategory(false);
    setIsEditingCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim() || !categoryForm.tagline.trim()) {
      showFeedback('error', 'Commodity Name and Tagline are required.');
      return;
    }

    const cleanId =
      categoryForm.id ||
      categoryForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

    if (isNewCategory) {
      const newCat: ProductCategory = {
        id: cleanId,
        name: categoryForm.name.trim(),
        tagline: categoryForm.tagline.trim(),
        heroImage:
          categoryForm.heroImage.trim() ||
          'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200&auto=format&fit=crop',
        types: [],
      };
      if (onAddCategory) {
        onAddCategory(newCat);
        showFeedback('success', `Added commodity category "${newCat.name}".`);
        setSelectedCategoryId(newCat.id);
      }
    } else {
      const existing = categories.find((c) => c.id === categoryForm.id);
      const updatedCat: ProductCategory = {
        id: categoryForm.id,
        name: categoryForm.name.trim(),
        tagline: categoryForm.tagline.trim(),
        heroImage: categoryForm.heroImage.trim() || (existing?.heroImage || ''),
        types: existing?.types || [],
      };
      if (onUpdateCategory) {
        onUpdateCategory(updatedCat);
        showFeedback('success', `Updated commodity category "${updatedCat.name}".`);
      }
    }
    setIsEditingCategoryModal(false);
  };

  const handleDeleteCategoryConfirm = (catId: string, catName: string) => {
    if (categories.length <= 1) {
      showFeedback('error', 'At least one commodity category must remain in the export catalog.');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete commodity "${catName}" and all its registered export grades?`
      )
    ) {
      if (onDeleteCategory) {
        onDeleteCategory(catId);
        showFeedback('success', `Deleted commodity "${catName}".`);
        setSelectedCategoryId('all');
      }
    }
  };

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Helper to open Add Grade modal
  const handleOpenAddGrade = (defaultCatId?: string) => {
    const targetCatId = defaultCatId && defaultCatId !== 'all' ? defaultCatId : (categories[0]?.id || 'coffee');
    setEditingGradeCategoryId(targetCatId);
    setIsNewGrade(true);
    
    // Suggest default specs based on category
    let defaultSpecs: ProductSpec[] = [
      { label: 'Grade Code', value: '' },
      { label: 'Moisture', value: '≤ 12.0%' },
    ];
    if (targetCatId.includes('coffee')) {
      defaultSpecs = [
        { label: 'Grade Code', value: '' },
        { label: 'Screen Size', value: 'Screen 18 (7.10 mm)' },
        { label: 'Moisture', value: '10.5% – 12.5%' },
        { label: 'Processing', value: 'Fully Washed' },
      ];
    } else if (targetCatId.includes('pepper')) {
      defaultSpecs = [
        { label: 'Grade Code', value: '' },
        { label: 'Bulk Density', value: '550 – 580 g/L' },
        { label: 'Moisture', value: '≤ 11.5%' },
        { label: 'Piperine', value: '4.5% – 5.0%' },
        { label: 'Essential Oil', value: '2.5% – 3.0%' },
      ];
    } else if (targetCatId.includes('cardamom')) {
      defaultSpecs = [
        { label: 'Pod Size', value: '7.0 mm – 8.0 mm' },
        { label: 'Essential Oil', value: '7.0% – 8.0%' },
        { label: 'Moisture', value: '9.5% – 11.0%' },
      ];
    } else if (targetCatId.includes('turmeric')) {
      defaultSpecs = [
        { label: 'Curcumin Content', value: '4.0% – 5.0%' },
        { label: 'Moisture', value: '≤ 10.0%' },
        { label: 'Origin Region', value: 'South India' },
      ];
    }

    setGradeForm({
      id: `grade-${Date.now().toString(36)}`,
      name: '',
      shortDescription: '',
      image: `/images/products/${targetCatId}-grade-${Date.now().toString(36)}.jpg`,
      fallbackImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
      specs: defaultSpecs,
    });
    setIsEditingGrade(true);
  };

  // Helper to open Edit Grade modal
  const handleOpenEditGrade = (catId: string, grade: ProductGradeType) => {
    setEditingGradeCategoryId(catId);
    setIsNewGrade(false);
    setGradeForm({
      id: grade.id,
      name: grade.name,
      shortDescription: grade.shortDescription,
      image: grade.image,
      fallbackImage: grade.fallbackImage || '',
      specs: grade.specs && grade.specs.length > 0 ? [...grade.specs] : [{ label: 'Grade Code', value: grade.name }],
    });
    setIsEditingGrade(true);
  };

  // Save Grade Handler
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeForm.name.trim() || !gradeForm.shortDescription.trim()) {
      showFeedback('error', 'Grade Name and Short Description are required.');
      return;
    }

    const cleanSpecs = gradeForm.specs.filter((s) => s.label.trim() && s.value.trim());

    const gradePayload: ProductGradeType = {
      id: gradeForm.id || `grade-${Date.now().toString(36)}`,
      name: gradeForm.name.trim(),
      shortDescription: gradeForm.shortDescription.trim(),
      image: gradeForm.image.trim() || `/images/products/${editingGradeCategoryId}-${gradeForm.id}.jpg`,
      fallbackImage: gradeForm.fallbackImage.trim() || undefined,
      specs: cleanSpecs.length > 0 ? cleanSpecs : [{ label: 'Grade Code', value: gradeForm.name.trim() }],
    };

    if (isNewGrade) {
      onAddGrade(editingGradeCategoryId, gradePayload);
      showFeedback('success', `Added export grade "${gradePayload.name}" to catalog.`);
    } else {
      onUpdateGrade(editingGradeCategoryId, gradePayload);
      showFeedback('success', `Updated export grade "${gradePayload.name}".`);
    }

    setIsEditingGrade(false);
  };

  // Delete Grade Handler
  const handleDeleteGradeConfirm = (catId: string, gradeId: string, gradeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${gradeName}" from the export catalog?`)) {
      onDeleteGrade(catId, gradeId);
      showFeedback('success', `Deleted grade "${gradeName}".`);
    }
  };

  // Specs Rows Manipulation
  const handleAddSpecRow = () => {
    setGradeForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: '', value: '' }],
    }));
  };

  const handleUpdateSpec = (index: number, field: 'label' | 'value', val: string) => {
    setGradeForm((prev) => {
      const next = [...prev.specs];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, specs: next };
    });
  };

  const handleRemoveSpec = (index: number) => {
    setGradeForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  // Reset confirmation
  const handleResetConfirm = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the export catalog to the standard Indian export grading defaults? Custom changes will be restored to defaults.'
      )
    ) {
      if (onResetCatalog) {
        onResetCatalog();
        showFeedback('success', 'Export catalog restored to factory trade defaults.');
      }
    }
  };

  // Filter products by selected category and search query
  const filteredCategories = categories.filter((cat) => {
    if (selectedCategoryId === 'all') return true;
    return cat.id === selectedCategoryId;
  });

  const allFilteredGrades = filteredCategories.flatMap((cat) =>
    cat.types
      .filter((grade) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          grade.name.toLowerCase().includes(q) ||
          grade.shortDescription.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q) ||
          grade.specs.some(
            (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
          )
        );
      })
      .map((grade) => ({ ...grade, categoryId: cat.id, categoryName: cat.name }))
  );

  const totalGradesCount = categories.reduce((acc, c) => acc + c.types.length, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-black tracking-tight text-neutral-900">
              Export Product Library Catalog
            </h4>
            <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full border border-neutral-300">
              {totalGradesCount} Total Grades
            </span>
          </div>
          <p className="text-xs text-neutral-500 max-w-2xl">
            Live catalog controls for Coffee, Malabar Pepper, Alleppey Cardamom, and Turmeric grades shown in the main &quot;Product Library&quot; section. Changes persist immediately to public view.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onResetCatalog && (
            <button
              onClick={handleResetConfirm}
              className="px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restore standard export grades"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            onClick={handleOpenAddCategory}
            className="px-3.5 py-2 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Create a new export product commodity"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>+ New Commodity</span>
          </button>

          <button
            onClick={() => handleOpenAddGrade(selectedCategoryId)}
            className="px-4 py-2 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Export Grade</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedCategoryId === 'all'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] font-mono opacity-80">({totalGradesCount})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <span>{cat.name.split('(')[0].trim()}</span>
                <span className="text-[10px] font-mono opacity-80">({cat.types.length})</span>
              </button>
            );
          })}

          <button
            onClick={handleOpenAddCategory}
            className="px-2.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Commodity</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search grade, code, specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* When a specific category is selected, show category management banner */}
      {selectedCategoryId !== 'all' && (() => {
        const activeCat = categories.find((c) => c.id === selectedCategoryId);
        if (!activeCat) return null;
        return (
          <div className="bg-[#f0f0ed] border border-neutral-300/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-neutral-900">{activeCat.name}</h5>
                  <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                    {activeCat.types.length} Grades
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-1">{activeCat.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEditCategory(activeCat)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit commodity name and tagline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Commodity</span>
              </button>

              <button
                onClick={() => handleOpenAddGrade(activeCat.id)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Grade</span>
              </button>

              <button
                onClick={() => handleDeleteCategoryConfirm(activeCat.id, activeCat.name)}
                className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                title="Delete this commodity category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Grades Grid */}
      {allFilteredGrades.length === 0 ? (
        <div className="bg-[#fbfbfb] border border-dashed border-neutral-300 rounded-2xl p-10 text-center">
          <Package className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-800">No export grades found</p>
          <p className="text-xs text-neutral-500 mb-4">
            {searchQuery ? `No results match "${searchQuery}"` : 'This category currently has no grades.'}
          </p>
          <button
            onClick={() => handleOpenAddGrade(selectedCategoryId)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Grade</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allFilteredGrades.map((grade) => (
            <div
              key={`${grade.categoryId}-${grade.id}`}
              className="bg-[#f9f9f8] border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-300 transition-all hover:shadow-xs group"
            >
              <div>
                {/* Image & Category strip */}
                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-neutral-200">
                  <img
                    src={grade.image}
                    alt={grade.name}
                    onError={(e) => {
                      if (grade.fallbackImage && e.currentTarget.src !== grade.fallbackImage) {
                        e.currentTarget.src = grade.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-neutral-950/85 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs font-bold">
                    {grade.specs[0]?.value || grade.name}
                  </span>
                  <span className="absolute bottom-2 left-2 bg-white/95 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {grade.categoryName.split('(')[0].trim()}
                  </span>
                </div>

                <h5 className="font-extrabold text-sm text-neutral-900 leading-snug mb-1 group-hover:text-emerald-950">
                  {grade.name}
                </h5>

                <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
                  {grade.shortDescription}
                </p>

                {/* Specs chips */}
                <div className="bg-[#edece8] rounded-xl p-2 mb-3 space-y-1 text-[11px] border border-neutral-300/40">
                  {grade.specs.slice(0, 3).map((spec, i) => (
                    <div key={i} className="flex items-center justify-between text-neutral-700">
                      <span className="text-neutral-500">{spec.label}:</span>
                      <span className="font-semibold text-neutral-900">{spec.value}</span>
                    </div>
                  ))}
                  {grade.specs.length > 3 && (
                    <p className="text-[10px] text-neutral-400 font-mono text-right">
                      +{grade.specs.length - 3} more specs
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[120px]">
                  {grade.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditGrade(grade.categoryId, grade)}
                    className="p-1.5 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    title="Edit Grade details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteGradeConfirm(grade.categoryId, grade.id, grade.name)}
                    className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    title="Delete Grade"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT EXPORT GRADE ================= */}
      {isEditingGrade && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900">
                    {isNewGrade ? 'Add Export Grade to Catalog' : `Edit Grade: ${gradeForm.name}`}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Configure official trade specifications, screen size, moisture, and description.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingGrade(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Target Commodity Category *
                </label>
                <select
                  value={editingGradeCategoryId}
                  onChange={(e) => setEditingGradeCategoryId(e.target.value)}
                  className="w-full bg-[#f7f7f6] border border-neutral-300 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.types.length} grades)
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Name & Grade Code/ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Grade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plantation AAA, TGSEB, AGEB"
                    value={gradeForm.name}
                    onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                    className="w-full bg-[#f7f7f6] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Unique Grade Identifier (Slug)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. coffee-plantation-aaa"
                    value={gradeForm.id}
                    onChange={(e) => setGradeForm({ ...gradeForm, id: e.target.value })}
                    className="w-full bg-[#f7f7f6] border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Short Description (1–2 lines) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe bean size, defect tolerance, flavor profile, or origin characteristics..."
                  value={gradeForm.shortDescription}
                  onChange={(e) => setGradeForm({ ...gradeForm, shortDescription: e.target.value })}
                  className="w-full bg-[#f7f7f6] border border-neutral-300 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950 leading-relaxed"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Primary Image Path / URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/images/products/coffee-plantation-aaa.jpg"
                    value={gradeForm.image}
                    onChange={(e) => setGradeForm({ ...gradeForm, image: e.target.value })}
                    className="w-full bg-[#f7f7f6] border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Named placeholders like `/images/products/{editingGradeCategoryId}-grade.jpg`
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Fallback Photo URL (Unsplash or web preview)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={gradeForm.fallbackImage}
                    onChange={(e) => setGradeForm({ ...gradeForm, fallbackImage: e.target.value })}
                    className="w-full bg-[#f7f7f6] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Displays gracefully when local image file is pending
                  </p>
                </div>
              </div>

              {/* Trade Specifications Editor */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Trade Specifications & Laboratory Calibers</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Spec Row</span>
                  </button>
                </div>

                <div className="space-y-2 bg-[#f6f6f5] border border-neutral-200 rounded-2xl p-3">
                  {gradeForm.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Screen Size)"
                        value={spec.label}
                        onChange={(e) => handleUpdateSpec(idx, 'label', e.target.value)}
                        className="flex-1 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Screen 19 (7.50 mm))"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                        className="flex-1 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      />
                      {gradeForm.specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
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

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsEditingGrade(false)}
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

      {/* Category Add/Edit Modal */}
      {isEditingCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {isNewCategory ? 'Add New Product Commodity' : 'Edit Commodity Category'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {isNewCategory
                      ? 'Create a new major product line for the export library'
                      : 'Update commodity headline, processing origin, and tagline'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingCategoryModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Commodity Name & Origin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coffee (Arabica & Robusta, Karnataka)"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
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
                  value={categoryForm.tagline}
                  onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
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
                  value={categoryForm.heroImage}
                  onChange={(e) => setCategoryForm({ ...categoryForm, heroImage: e.target.value })}
                  className="w-full bg-[#f6f6f5] border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsEditingCategoryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isNewCategory ? 'Create Commodity' : 'Save Commodity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
