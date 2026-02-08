import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { toggleSidebar } from '../features/products/productsSlice';
import { useGetCategoriesQuery } from '../features/products/productsApi';
import { Category } from '../types';

interface FilterSidebarProps {
  isSidebarOpen: boolean;
  // This prop will be used to lift the filter state up to Home.tsx
  onApplyFilters: (filters: { category_slug?: string; min_price?: number; max_price?: number }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isSidebarOpen, onApplyFilters }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();

  // Local state for filters
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

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
              {categories.map(categoryItem)}
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
