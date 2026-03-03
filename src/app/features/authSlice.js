import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  role: null,
  token: localStorage.getItem("token") || null,
  user: null,
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
  },
});

export const { setCredential } = authSlice.actions;
export default authSlice.reducer;
