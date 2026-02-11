import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/api';
import productsReducer from '../features/products/productsSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

/**
 * The primary Redux store configuration.
 * It combines the API reducer (for RTK Query caching) and any local state reducers.
 */
export const store = configureStore({
  reducer: {
    // Add the generated reducer from the baseApi
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Add local state reducers
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Define types for use in the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
