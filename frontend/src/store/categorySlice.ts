import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Category from '@/models/Category';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: true,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart(state) {
      state.loading = true;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } = categorySlice.actions;

export default categorySlice.reducer;