import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const subjectsApi = createApi({
  reducerPath: "subjectsApi",
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
  tagTypes: ["Subjects"],
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: ({ query, organizationId }) => ({
        url: `/${query}?organizationId=${organizationId}`,
      }),
      providesTags: ["Subjects"],
    }),
    createSubjects: builder.mutation({
      query: ({ data, query }) => ({
        url: `/${query}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subjects"],
    }),
    editSubjects: builder.mutation({
      query: ({ data, id, query }) => ({
        url: `/${query}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subjects"],
    }),
    deleteSubjects: builder.mutation({
      query: ({ id, query }) => ({
        url: `/${query}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subjects"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useDeleteSubjectsMutation,
  useEditSubjectsMutation,
  useCreateSubjectsMutation,
} = subjectsApi;
export default subjectsApi;
