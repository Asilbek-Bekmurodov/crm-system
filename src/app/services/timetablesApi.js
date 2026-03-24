import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const timetablesApi = createApi({
  reducerPath: "timetablesApi",
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
  tagTypes: ["timetables"],
  endpoints: (builder) => ({
    getTimetables: builder.query({
      query: (organizationId) => `/timetables?organizationId=${organizationId}`,
      providesTags: ["timetables"],
    }),
    getTimetablesByGroup: builder.query({
      query: (groupId) => `/timetables/group/${groupId}`,
      providesTags: ["timetables"],
    }),
    createTimetable: builder.mutation({
      query: (data) => ({
        url: "/timetables",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["timetables"],
    }),
    updateTimetable: builder.mutation({
      query: ({ id, data }) => ({
        url: `/timetables/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["timetables"],
    }),
    deleteTimetable: builder.mutation({
      query: (id) => ({
        url: `/timetables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["timetables"],
    }),
  }),
});

export const {
  useGetTimetablesQuery,
  useGetTimetablesByGroupQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
} = timetablesApi;

export default timetablesApi;
