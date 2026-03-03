import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import authApi from "./services/authApi";
import userApi from "./services/userApi";
import organizationApi from "./services/organizationApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(organizationApi.middleware),
});

export default store;
