import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://crmsystem-production-d4ee.up.railway.app/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState?.();
      const token = state?.auth?.token || localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (query) => ({
        url: `/${query}`,
      }),
      providesTags: ["user"],
    }),
    getByRole: builder.query({
      query: (role) => ({
        url: `/users/role/${role}`,
      }),
    }),
    createUser: builder.mutation({
      query: ({ data, query }) => ({
        url: `/${query}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    editUser: builder.mutation({
      query: ({ data, id, query }) => ({
        url: `/${query}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: ({ id, query }) => ({
        url: `/${query}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetByRoleQuery,
  useGetMeQuery,
} = userApi;
export default userApi;
