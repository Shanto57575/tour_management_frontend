import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTour: builder.mutation({
      query: (tourData) => ({
        url: "/tour/create",
        method: "POST",
        data: tourData,
      }),
      invalidatesTags: ["TOUR"],
    }),
    addTourType: builder.mutation({
      query: (tourTypeName) => ({
        url: "/tour/create-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
      invalidatesTags: ["TOUR"],
    }),
    editTourType: builder.mutation({
      query: ({ tourTypeId, tourType }) => ({
        url: `/tour/tour-types/${tourTypeId}`,
        method: "PATCH",
        data: tourType,
      }),
      invalidatesTags: ["TOUR"],
    }),
    removeTourType: builder.mutation({
      query: (tourTypeId) => ({
        url: `/tour/tour-types/${tourTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TOUR"],
    }),
    getTourTypes: builder.query({
      query: () => ({
        url: "/tour/tour-types",
        method: "GET",
      }),
      providesTags: ["TOUR"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useAddTourTypeMutation,
  useEditTourTypeMutation,
  useGetTourTypesQuery,
  useRemoveTourTypeMutation,
  useAddTourMutation,
} = tourApi;
