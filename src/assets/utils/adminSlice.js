import { createSlice } from "@reduxjs/toolkit";

// Load admin state from localStorage
const loadAdminFromStorage = () => {
  try {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error('Error loading admin data:', error);
    return null;
  }
};

const adminSlice = createSlice({
  name: "admin",
  initialState: loadAdminFromStorage(),
  reducers: {
    setAdmin: (state, action) => {
      // Save to localStorage
      localStorage.setItem('adminData', JSON.stringify(action.payload));
      return action.payload;
    },
    removeAdmin: () => {
      // Remove from localStorage
      localStorage.removeItem('adminData');
      return null;
    }
  }
});

export const { setAdmin, removeAdmin } = adminSlice.actions;
export default adminSlice.reducer;
