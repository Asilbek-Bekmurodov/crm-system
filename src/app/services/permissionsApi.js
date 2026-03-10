import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://crmsystem-production-d4ee.up.railway.app/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state?.auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Permission"],
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => "/permissions",
      providesTags: ["Permission"],
    }),

    getPermissionById: builder.query({
      query: (id) => `/permissions/${id}`,
      providesTags: ["Permission"],
    }),

    createPermission: builder.mutation({
      query: (newOrg) => ({
        url: "/permissions",
        method: "POST",
        body: newOrg,
      }),
      invalidatesTags: ["permission"],
    }),

    editPermission: builder.mutation({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Permission"],
    }),

    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["permission"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useEditPermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;

export default permissionsApi;
