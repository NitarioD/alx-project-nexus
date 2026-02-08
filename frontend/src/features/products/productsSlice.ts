import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for the local state of the product feature.
 * This state is used to manage UI-specific settings like sidebar visibility,
 * and current filter/sort selections that haven't been applied to the API query yet.
 */
interface ProductState {
  isSidebarOpen: boolean;
  currentSort: string;
}

const initialState: ProductState = {
  isSidebarOpen: false,
  currentSort: '-created_at', // Default sort (newest first)
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
  },
});

export const { toggleSidebar, setSort } = productsSlice.actions;

export default productsSlice.reducer;
