import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://13.63.35.55:8080/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state?.auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: () => "/organizations",
      providesTags: ["Organization"],
    }),

    getOrganizationById: builder.query({
      query: (id) => `/organizations/${id}`,
      providesTags: ["Organization"],
    }),

    createOrganization: builder.mutation({
      query: (newOrg) => ({
        url: "/organizations",
        method: "POST",
        body: newOrg,
      }),
      invalidatesTags: ["Organization"],
    }),

    editOrganization: builder.mutation({
      query: ({ id, data }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useEditOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;

export default organizationApi;
