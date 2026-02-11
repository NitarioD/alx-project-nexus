import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { useGetProductsQuery } from '../features/products/productsApi';
import { setSort } from '../features/products/productsSlice';

// Components
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import { SlidersHorizontal } from 'lucide-react';
import { toggleSidebar, setAppliedFilters } from '../features/products/productsSlice';

// Define the initial state for fetching parameters
const PAGE_SIZE = 20; // Matches DRF default PAGE_SIZE

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentSort = useSelector((state: RootState) => state.products.currentSort);
  const appliedFilters = useSelector((state: RootState) => state.products.appliedFilters);

  // State for pagination
  const [offset, setOffset] = useState(0);
  
  // Reset to first page when filters change
  useEffect(() => {
    setOffset(0);
  }, [appliedFilters.category_slug, appliedFilters.min_price, appliedFilters.max_price]);
  
  // Combine all query parameters (filters from Redux)
  const queryParams = {
    limit: PAGE_SIZE,
    offset,
    ordering: currentSort,
    ...appliedFilters,
    is_available: true,
  };

  // RTK Query hook
  const { data, isLoading, isFetching, error, refetch } = useGetProductsQuery(queryParams);

  const products = data?.results || [];
  const totalCount = data?.count || 0;
  
  // Function called when user clicks "Clear All Filters" in empty state
  const handleClearFilters = () => {
    setOffset(0);
    dispatch(setAppliedFilters({}));
  };
  
  // Function called by SortDropdown
  const handleSortChange = (sortKey: string) => {
    // Reset offset to 0 when sorting changes
    setOffset(0); 
    dispatch(setSort(sortKey));
  };
  
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };


  // --- Render Logic ---

  if (error) {
    // Determine if it's an API error or network error
    const errorMessage = 'An error occurred while fetching products. Please check the API connection.';
    return (
      <div className="p-8 text-center bg-red-50 text-red-700 m-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Error Loading Catalog</h2>
        <p>{errorMessage}</p>
        <button 
          onClick={refetch} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isDataLoading = isLoading || isFetching;
  
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      
      {/* Header and Controls */}
      <div className="px-4 sm:px-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Product Catalog ({totalCount} items)
        </h1>
        
        <div className="flex items-center space-x-4">
          {/* Mobile Filter Toggle */}
          <button
            className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 lg:hidden flex items-center"
            onClick={() => dispatch(toggleSidebar())}
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
          </button>
          
          {/* Sort Dropdown */}
          <SortDropdown 
            currentSort={currentSort} 
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      {isDataLoading && totalCount === 0 ? (
        <ProductSkeleton count={PAGE_SIZE} />
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            offset={offset}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white shadow-sm mx-4 sm:mx-0 mt-8">
          <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
          <p>Try clearing your filters or adjusting your search criteria.</p>
          <button 
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 bg-gray-100 text-primary-blue rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
