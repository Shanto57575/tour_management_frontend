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
    getTour: builder.query({
      query: (slug) => ({
        url: `/tour/${slug}`,
        method: "GET",
      }),
      providesTags: ["TOUR"],
      transformResponse: (response) => response.data,
    }),
    getAllTours: builder.query({
      query: (args: Record<string, any>) => {
        const params = new URLSearchParams();
        if (args) {
          Object.keys(args).forEach((key) => {
            if (args[key]) {
              params.append(key, args[key] as string);
            }
          });
        }
        return {
          url: `/tour?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["TOUR"],
      transformResponse: (response: any) => response.data,
    }),
    editTour: builder.mutation({
      query: ({ tourId, tourInfo }) => ({
        url: `/tour/${tourId}`,
        method: "PATCH",
        data: tourInfo,
      }),
      invalidatesTags: ["TOUR"],
    }),
    removeTour: builder.mutation({
      query: (tourId) => ({
        url: `/tour/${tourId}`,
        method: "DELETE",
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
  useGetAllToursQuery,
  useGetTourQuery,
  useEditTourMutation,
  useRemoveTourMutation,
} = tourApi;
