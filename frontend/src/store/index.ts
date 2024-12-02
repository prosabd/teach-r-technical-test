import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
  },
});