import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  role: null,
  token: localStorage.getItem("token") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;

      localStorage.setItem("token", state.token);
    },
  },
});

export const { setCredential } = authSlice.actions;
export default authSlice.reducer;
