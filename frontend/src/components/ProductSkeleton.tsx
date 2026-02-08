import React from 'react';

// Defines a single skeleton card for the loading state
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-4 animate-pulse">
    {/* Image Placeholder */}
    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>

    {/* Category */}
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

    {/* Title */}
    <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>

    {/* Rating */}
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>

    {/* Price and Button */}
    <div className="flex justify-between items-center pt-2">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
    </div>
  </div>
);

interface ProductSkeletonProps {
  count?: number;
}

/**
 * Component to display a grid of skeleton loaders while data is fetching.
 */
const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
