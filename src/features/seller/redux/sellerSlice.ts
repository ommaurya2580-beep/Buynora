import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SellerState {
  activeTab: 'analytics' | 'products' | 'orders';
  showProductModal: boolean;
  selectedProductId: string | null;
}

const initialState: SellerState = {
  activeTab: 'analytics',
  showProductModal: false,
  selectedProductId: null
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSellerActiveTab(state, action: PayloadAction<SellerState['activeTab']>) {
      state.activeTab = action.payload;
    },
    toggleSellerProductModal(state, action: PayloadAction<boolean>) {
      state.showProductModal = action.payload;
    },
    setSelectedProductId(state, action: PayloadAction<string | null>) {
      state.selectedProductId = action.payload;
    }
  }
});

export const { setSellerActiveTab, toggleSellerProductModal, setSelectedProductId } = sellerSlice.actions;
export default sellerSlice.reducer;
