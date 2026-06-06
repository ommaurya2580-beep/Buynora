import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { products, Product, Coupon, coupons } from '../services/mockDb';

export interface Seller {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Suspended' | 'Pending';
  sales: number;
  joiningDate: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin' | 'Seller';
  status: 'Active' | 'Banned';
  joiningDate: string;
}

export interface AdminState {
  catalog: Product[];
  couponsList: Coupon[];
  sellersList: Seller[];
  usersList: UserAccount[];
}

const initialSellers: Seller[] = [
  { id: "s1", name: "Alpha Tech Ltd", email: "sales@alphatech.com", status: "Active", sales: 120, joiningDate: "2025-01-15" },
  { id: "s2", name: "Nike Official Store", email: "retail@nike.com", status: "Active", sales: 340, joiningDate: "2025-03-10" },
  { id: "s3", name: "GadgetWorld", email: "support@gadgetworld.com", status: "Pending", sales: 0, joiningDate: "2026-06-01" },
  { id: "s4", name: "Luxe Apparel", email: "luxe@apparel.com", status: "Suspended", sales: 15, joiningDate: "2025-09-20" }
];

const initialUsers: UserAccount[] = [
  { id: "u1", name: "John Doe", email: "john.doe@buynora.com", role: "User", status: "Active", joiningDate: "2025-05-15" },
  { id: "u2", name: "Jane Smith", email: "jane.smith@gmail.com", role: "User", status: "Active", joiningDate: "2025-11-02" },
  { id: "u3", name: "Alice Admin", email: "admin@buynora.com", role: "Admin", status: "Active", joiningDate: "2025-01-01" },
  { id: "u4", name: "Bob Seller", email: "seller@buynora.com", role: "Seller", status: "Active", joiningDate: "2025-02-12" },
  { id: "u5", name: "Spammer Steve", email: "steve@spam.com", role: "User", status: "Banned", joiningDate: "2026-05-28" }
];

const initialState: AdminState = {
  catalog: products,
  couponsList: coupons,
  sellersList: initialSellers,
  usersList: initialUsers
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Product CRUD
    addCatalogProduct(state, action: PayloadAction<Product>) {
      state.catalog.unshift(action.payload);
      // Synchronize in-memory mockDB too so API service fetches it
      products.unshift(action.payload);
    },
    updateCatalogProduct(state, action: PayloadAction<Product>) {
      const idx = state.catalog.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.catalog[idx] = action.payload;
      }
      const dbIdx = products.findIndex(p => p.id === action.payload.id);
      if (dbIdx !== -1) {
        products[dbIdx] = action.payload;
      }
    },
    deleteCatalogProduct(state, action: PayloadAction<string>) {
      state.catalog = state.catalog.filter(p => p.id !== action.payload);
      // Sync mockDB
      const dbIdx = products.findIndex(p => p.id === action.payload);
      if (dbIdx !== -1) {
        products.splice(dbIdx, 1);
      }
    },
    // Coupon Management
    addAdminCoupon(state, action: PayloadAction<Coupon>) {
      state.couponsList.unshift(action.payload);
      coupons.unshift(action.payload);
    },
    deleteAdminCoupon(state, action: PayloadAction<string>) {
      state.couponsList = state.couponsList.filter(c => c.code !== action.payload);
      const idx = coupons.findIndex(c => c.code === action.payload);
      if (idx !== -1) {
        coupons.splice(idx, 1);
      }
    },
    // User accounts management
    toggleUserStatus(state, action: PayloadAction<string>) {
      const u = state.usersList.find(user => user.id === action.payload);
      if (u) {
        u.status = u.status === 'Active' ? 'Banned' : 'Active';
      }
    },
    promoteUserToRole(state, action: PayloadAction<{ id: string; role: UserAccount['role'] }>) {
      const u = state.usersList.find(user => user.id === action.payload.id);
      if (u) {
        u.role = action.payload.role;
      }
    },
    // Seller management
    approveSeller(state, action: PayloadAction<string>) {
      const s = state.sellersList.find(seller => seller.id === action.payload);
      if (s) {
        s.status = 'Active';
      }
    },
    toggleSellerStatus(state, action: PayloadAction<string>) {
      const s = state.sellersList.find(seller => seller.id === action.payload);
      if (s) {
        s.status = s.status === 'Active' ? 'Suspended' : 'Active';
      }
    }
  }
});

export const {
  addCatalogProduct,
  updateCatalogProduct,
  deleteCatalogProduct,
  addAdminCoupon,
  deleteAdminCoupon,
  toggleUserStatus,
  promoteUserToRole,
  approveSeller,
  toggleSellerStatus
} = adminSlice.actions;

export default adminSlice.reducer;
