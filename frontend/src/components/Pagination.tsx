import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalCount, pageSize, offset, onPageChange }) => {
  if (totalCount === 0 || totalCount <= pageSize) {
    return null;
  }

  const currentPage = Math.floor(offset / pageSize) + 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const handlePrev = () => {
    if (!isPrevDisabled) {
      onPageChange(offset - pageSize);
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      onPageChange(offset + pageSize);
    }
  };

  // Function to calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, 5);
    } else if (currentPage > totalPages - 3) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (startPage > 1) {
      if (startPage > 2) pageNumbers.unshift(0); // Ellipsis placeholder
      pageNumbers.unshift(1);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push(0); // Ellipsis placeholder
      pageNumbers.push(totalPages);
    }
    
    // Filter unique numbers and sort
    return Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 py-8 bg-white border-t">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={`p-2 rounded-lg border transition duration-150 ${
          isPrevDisabled 
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
            : 'text-gray-700 bg-white hover:bg-gray-100 border-gray-300'
        }`}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 0) {
          return <span key={index} className="px-3 py-2 text-gray-500">...</span>;
        }
        const pageOffset = (page - 1) * pageSize;
        const isActive = page === currentPage;
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(pageOffset)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ${
              isActive
                ? 'bg-primary-blue text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`p-2 rounded-lg border transition duration-150 ${
          isNextDisabled 
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
            : 'text-gray-700 bg-white hover:bg-gray-100 border-gray-300'
        }`}
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
