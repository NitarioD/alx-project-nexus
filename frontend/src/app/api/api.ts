import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get the base URL from the environment variables (Vite requires VITE_ prefix)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * The base RTK Query API slice.
 * This slice defines the base configuration, including the base URL and the
 * default request headers, which will be extended by feature-specific API slices.
 */
export const baseApi = createApi({
  // A cache tag unique to this API layer
  reducerPath: 'api',
  
  // Define the base query function
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Read JWT access token from auth slice if available
      const state = getState() as any;
      const token: string | null = state?.auth?.accessToken ?? null;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  
  // Define global tag types for caching (e.g., 'Product', 'Category', 'Review')
  tagTypes: ['Product', 'Review', 'Category'],
  
  // No endpoints defined here; feature slices extend this
  endpoints: () => ({}),
});

// We can optionally export the base query if needed elsewhere
// export const { reducer } = baseApi;
