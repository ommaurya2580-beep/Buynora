import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminState {
  activeTab: 'analytics' | 'users' | 'sellers' | 'categories' | 'coupons';
  showCouponModal: boolean;
}

const initialState: AdminState = {
  activeTab: 'analytics',
  showCouponModal: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminActiveTab(state, action: PayloadAction<AdminState['activeTab']>) {
      state.activeTab = action.payload;
    },
    toggleCouponModal(state, action: PayloadAction<boolean>) {
      state.showCouponModal = action.payload;
    }
  }
});

export const { setAdminActiveTab, toggleCouponModal } = adminSlice.actions;
export default adminSlice.reducer;
