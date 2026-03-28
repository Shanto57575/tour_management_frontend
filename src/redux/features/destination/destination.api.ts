import { baseApi } from "@/redux/baseApi";

export interface IDestination {
  _id: string;
  name: string;
  slug?: string;
  summary?: string;
  description?: string;
  images?: string[];
  startingPrice?: number;
  duration?: string;
  district?: string;
  attractions?: string[];
  bestTimeToVisit?: string;
  division?: { _id: string; name: string } | string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetAllDestinationsResponse {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  destinations: IDestination[];
}

export interface IDestinationQueryArgs {
  page?: number;
  limit?: number;
  searchTerm?: string;
  division?: string;
  district?: string;
  isFeatured?: boolean;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDestination: builder.mutation({
      query: (destinationData: FormData) => ({
        url: "/destination/create",
        method: "POST",
        data: destinationData,
      }),
      invalidatesTags: ["DESTINATION"],
    }),

    updateDestination: builder.mutation({
      query: ({
        destinationId,
        destinationData,
      }: {
        destinationId: string;
        destinationData: FormData;
      }) => ({
        url: `/destination/${destinationId}`,
        method: "PATCH",
        data: destinationData,
      }),
      invalidatesTags: ["DESTINATION"],
    }),

    getAllDestinations: builder.query<
      IGetAllDestinationsResponse,
      IDestinationQueryArgs | void
    >({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }

        return {
          url: `/destination${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["DESTINATION"],
      transformResponse: (response: { data: IGetAllDestinationsResponse }) =>
        response.data,
    }),

    getSingleDestination: builder.query<IDestination, string>({
      query: (slug) => ({
        url: `/destination/${slug}`,
        method: "GET",
      }),
      providesTags: ["DESTINATION"],
      transformResponse: (response: { data: IDestination }) => response.data,
    }),

    removeDestination: builder.mutation({
      query: (destinationId: string) => ({
        url: `/destination/${destinationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DESTINATION"],
    }),
  }),
});

export const {
  useAddDestinationMutation,
  useUpdateDestinationMutation,
  useGetAllDestinationsQuery,
  useGetSingleDestinationQuery,
  useRemoveDestinationMutation,
} = destinationApi;
