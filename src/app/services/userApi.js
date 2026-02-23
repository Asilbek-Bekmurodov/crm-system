import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://crmsystem-ftyv.onrender.com/api",
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
      query: () => ({
        url: "/users",
      }),
      providesTags: ["user"],
    }),
    getByRole: builder.query({
      query: (role) => ({
        url: `/users/role/${role}`,
      }),
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    editUser: builder.mutation({
      query: ({ data, id }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetByRoleQuery,
} = userApi;
export default userApi;
