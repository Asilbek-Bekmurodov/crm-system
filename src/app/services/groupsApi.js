import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const groupsApi = createApi({
  reducerPath: "groupsApi",
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
  tagTypes: ["groups"],
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ query, organizationId }) => ({
        url: `/${query}?organizationId=${organizationId}`,
      }),
      providesTags: ["groups"],
    }),
    createGroup: builder.mutation({
      query: ({ data, query }) => ({
        url: `/${query}?organizationId=${data.organizationId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["groups"],
    }),
    editGroups: builder.mutation({
      query: ({ data, id, query }) => ({
        url: `/${query}/${id}?organizationId=${data.organizationId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["groups"],
    }),
    deleteGroups: builder.mutation({
      query: ({ id, query, orgId }) => ({
        url: `/${query}/${id}?organizationId=${orgId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["groups"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useDeleteGroupsMutation,
  useEditGroupsMutation,
  useCreateGroupMutation,
} = groupsApi;
export default groupsApi;
