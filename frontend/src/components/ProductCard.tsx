import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, price, image_url, average_rating, stock_quantity, category_title } = product;
  const isOutOfStock = stock_quantity === 0;

  // Function to determine the badge color for stock status
  const getStockBadge = () => {
    if (isOutOfStock) {
      return 'bg-red-100 text-red-800';
    } else if (stock_quantity < 50) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  // Ensure we always work with numeric values even if the API sends strings
  const numericPrice =
    typeof price === 'number' ? price : parseFloat(price as unknown as string);
  const formattedPrice = Number.isFinite(numericPrice)
    ? numericPrice.toFixed(2)
    : String(price);

  const numericRating =
    typeof average_rating === 'number'
      ? average_rating
      : parseFloat(average_rating as unknown as string);
  const formattedRating = Number.isFinite(numericRating)
    ? numericRating.toFixed(1)
    : 'N/A';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <img
          src={image_url || `https://placehold.co/400x400/CCCCCC/333333?text=${name.slice(0, 15).replace(/\s/g, '+')}`}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            // Fallback image if the provided URL fails
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://placehold.co/400x400/CCCCCC/333333?text=Image+Not+Found`;
          }}
        />
        {/* Stock Status Badge */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${getStockBadge()}`}>
          {isOutOfStock ? 'Out of Stock' : (stock_quantity < 50 ? 'Low Stock' : 'In Stock')}
        </span>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-medium text-gray-500 mb-1">{category_title}</span>
        
        {/* Name and Rating */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={name}>
          {name}
        </h3>
        
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-sm font-bold text-gray-700">
            {average_rating > 0 ? formattedRating : 'N/A'}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews.length} reviews)
          </span>
        </div>

        {/* Price and Action */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-xl font-extrabold text-primary-blue">
            ${formattedPrice}
          </span>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-blue text-white hover:bg-blue-800 shadow-md'
            }`}
            disabled={isOutOfStock}
            onClick={() => console.log(`Added product ${product.id} to cart`)}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
