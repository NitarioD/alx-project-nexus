// ====================================================================
// CORE API TYPES
// These interfaces define the data structures returned by the Django API.
// ====================================================================

/**
 * Defines the structure for a single Product Review.
 */
export interface Review {
  id: number;
  product: number; // Foreign key to Product ID
  name: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

/**
 * Defines the structure for a single Product Category.
 */
export interface Category {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

/**
 * Defines the structure for a single Product returned by the detail endpoint.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  
  // Relationships/Computed Fields from Serializer
  category: number; // Category ID
  category_title: string;
  average_rating: number;
  reviews: Review[]; // Nested reviews only in detail view
}

// ====================================================================
// UTILITY/PAGINATION TYPES
// ====================================================================

/**
 * Defines the standard response structure for DRF paginated endpoints.
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Defines the parameters used to fetch products, aligning with the backend filters.
 */
export interface ProductQueryParams {
  limit: number;
  offset: number;
  search?: string; // Maps to Django's search_fields
  ordering?: string; // Maps to Django's ordering_fields
  category_slug?: string;
  min_price?: number;
  max_price?: number;
  is_available?: boolean;
}
