import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppliedFilters {
  category_slug?: string;
  min_price?: number;
  max_price?: number;
}

/**
 * Interface for the local state of the product feature.
 * This state is used to manage UI-specific settings like sidebar visibility,
 * applied filters, and current sort selection.
 */
interface ProductState {
  isSidebarOpen: boolean;
  currentSort: string;
  appliedFilters: AppliedFilters;
}

const initialState: ProductState = {
  isSidebarOpen: false,
  currentSort: '-created_at', // Default sort (newest first)
  appliedFilters: {},
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.currentSort = action.payload;
    },
    setAppliedFilters: (state, action: PayloadAction<AppliedFilters>) => {
      state.appliedFilters = action.payload;
    },
  },
});

export const { toggleSidebar, setSort, setAppliedFilters } = productsSlice.actions;

export default productsSlice.reducer;
