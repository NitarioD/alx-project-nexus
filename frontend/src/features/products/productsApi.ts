import { baseApi } from '../../app/api/api';
import { 
  Category, 
  Product, 
  PaginatedResponse, 
  ProductQueryParams,
  Review
} from '../../types';

/**
 * Extends the baseApi with endpoints specific to the Product Catalog.
 * Uses dependency injection via the baseApi.injectEndpoints method.
 */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    /**
     * Endpoint to fetch a list of products based on query parameters.
     * Corresponds to: GET /api/products/
     */
    getProducts: builder.query<PaginatedResponse<Product>, ProductQueryParams>({
      query: (params) => ({
        url: 'products',
        params: { 
          // Default limit/offset handled by Django, but explicitly include all possible filters
          limit: params.limit,
          offset: params.offset,
          search: params.search,
          ordering: params.ordering,
          category_slug: params.category_slug,
          min_price: params.min_price,
          max_price: params.max_price,
          is_available: params.is_available,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              // Provides 'Product' tag for the whole list
              { type: 'Product', id: 'LIST' },
              // Provides specific 'Product' tags for each item
              ...result.results.map(({ id }) => ({ type: 'Product' as const, id })),
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    
    /**
     * Endpoint to fetch a single product by ID.
     * Corresponds to: GET /api/products/{id}/
     */
    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    /**
     * Endpoint to fetch all categories.
     * Corresponds to: GET /api/categories/
     */
    getCategories: builder.query<Category[], void>({
      query: () => 'categories',
      transformResponse: (response: PaginatedResponse<Category> | Category[]) => {
        // Handle both paginated and non-paginated responses
        if (Array.isArray(response)) {
          return response;
        }
        // DRF paginated response: { count, next, previous, results }
        return response.results;
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Category', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    /**
     * Endpoint to submit a new review for a product.
     * Corresponds to: POST /api/products/{id}/reviews/
     */
    submitReview: builder.mutation<Review, { productId: number; data: Omit<Review, 'id' | 'product' | 'created_at'> }>({
      query: ({ productId, data }) => ({
        url: `products/${productId}/reviews/`,
        method: 'POST',
        body: data,
      }),
      // Invalidate tags to refetch the product details and the product list
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery, 
  useGetCategoriesQuery, 
  useSubmitReviewMutation,
} = productsApi;
