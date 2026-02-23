import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import authApi from "./services/authApi";
import userApi from "./services/userApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware),
});

export default store;
