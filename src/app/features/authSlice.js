import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  role: null,
  token: localStorage.getItem("token") || null,
  user: null,
  orgId: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;

      localStorage.setItem("token", state.token);
    },
    logOut: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
    getOrgId: (state, action) => {
      state.orgId = action.payload;
    },
  },
});

export const { setCredential, logOut, getOrgId } = authSlice.actions;
export default authSlice.reducer;
