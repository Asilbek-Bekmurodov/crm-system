import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const topicApi = createApi({
  reducerPath: "topicApi",
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
  tagTypes: ["Topics"],
  endpoints: (builder) => ({
    getTopicsBySubject: builder.query({
      query: (subjectId) => ({
        url: `/topics/subject/${subjectId}`,
      }),
      providesTags: ["Topics"],
    }),
    createTopic: builder.mutation({
      query: (data) => ({
        url: `/topics/subject`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Topics"],
    }),
    updateTopic: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/topics/subject/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Topics"],
    }),
    deleteTopic: builder.mutation({
      query: (id) => ({
        url: `/topics/subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topics"],
    }),
  }),
});

export const {
  useGetTopicsBySubjectQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicApi;

export default topicApi;
