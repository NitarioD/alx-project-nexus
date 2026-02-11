import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { toggleSidebar } from '../features/products/productsSlice';
import { useGetCategoriesQuery } from '../features/products/productsApi';
import { Category } from '../types';

interface FilterSidebarProps {
  isSidebarOpen: boolean;
  onApplyFilters: (filters: { category_slug?: string; min_price?: number; max_price?: number }) => void;
}

/** Groups categories alphabetically by first letter. Returns array of { letter, categories }. */
function groupCategoriesByLetter(categories: Category[]): { letter: string; categories: Category[] }[] {
  const grouped = new Map<string, Category[]>();
  for (const cat of categories) {
    const letter = (cat.title[0] || '').toUpperCase();
    const existing = grouped.get(letter) || [];
    existing.push(cat);
    grouped.set(letter, existing);
  }
  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, cats]) => ({ letter, categories: cats }));
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isSidebarOpen, onApplyFilters }) => {
  const dispatch = useDispatch<AppDispatch>();
  const appliedFilters = useSelector((state: RootState) => state.products.appliedFilters);
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();

  // Local state for filters (synced with Redux)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Sync local state with Redux when applied filters change
  useEffect(() => {
    setSelectedCategory(appliedFilters.category_slug);
    setPriceRange({
      min: appliedFilters.min_price != null ? String(appliedFilters.min_price) : '',
      max: appliedFilters.max_price != null ? String(appliedFilters.max_price) : '',
    });
  }, [appliedFilters.category_slug, appliedFilters.min_price, appliedFilters.max_price]);

  const handleApply = () => {
    onApplyFilters({
      category_slug: selectedCategory,
      min_price: priceRange.min ? parseFloat(priceRange.min) : undefined,
      max_price: priceRange.max ? parseFloat(priceRange.max) : undefined,
    });
    // Close sidebar on mobile after applying filters
    if (isSidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  const handleClear = () => {
    setSelectedCategory(undefined);
    setPriceRange({ min: '', max: '' });
    onApplyFilters({}); // Apply empty filters
    if (isSidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  // Common styling for the sidebar container
  const sidebarClasses = `
    fixed inset-y-0 left-0 transform 
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    w-64 bg-white shadow-xl p-6 z-30 transition-transform duration-300 ease-in-out
    lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:border-r lg:flex-shrink-0
    custom-scrollbar overflow-y-auto pt-20 lg:pt-0
  `;
  
  const categoryItem = (category: Category) => (
    <li key={category.id} className="mb-2">
      <button
        onClick={() => setSelectedCategory(category.slug)}
        className={`w-full flex justify-between items-center text-left p-2 rounded-lg transition duration-150 ${
          selectedCategory === category.slug 
            ? 'bg-primary-blue text-white font-semibold shadow-md' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>{category.title}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </li>
  );

  return (
    <>
      {/* Overlay for mobile view */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => dispatch(toggleSidebar())}></div>}

      <div className={sidebarClasses}>
        
        {/* Header and Close Button (Mobile Only) */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
          </h2>
          <button onClick={() => dispatch(toggleSidebar())} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Category Filter */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Categories</h3>
          {isLoadingCategories ? (
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          ) : (
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`w-full text-left p-2 rounded-lg transition duration-150 ${
                    selectedCategory === undefined 
                      ? 'bg-gray-200 text-gray-800 font-bold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
              </li>
              {groupCategoriesByLetter(categories).map(({ letter, categories: groupCats }) => (
                <li key={letter} className="mt-4 first:mt-0">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 px-2">
                    {letter}
                  </span>
                  <ul className="space-y-1">
                    {groupCats.map(categoryItem)}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Price Range Filter */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Price Range</h3>
          <div className="flex space-x-3">
            <input
              type="number"
              name="min"
              placeholder="Min $"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              min="0"
            />
            <input
              type="number"
              name="max"
              placeholder="Max $"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              min="0"
            />
          </div>
        </section>
        
        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t lg:border-none">
            <button
              onClick={handleApply}
              className="w-full bg-primary-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-200 shadow-md mb-2"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="w-full bg-gray-50 text-gray-700 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
            >
              Clear Filters
            </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
