import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/booking/create-booking",
        method: "POST",
        data: bookingData,
      }),
      invalidatesTags: ["BOOKING"],
    }),
    updateBooking: builder.mutation({
      query: ({ bookingId, bookingData }) => ({
        url: `/booking/${bookingId}`,
        method: "PATCH",
        data: bookingData,
      }),
      invalidatesTags: ["BOOKING"],
    }),
    allBookings: builder.query({
      query: () => ({
        url: "/booking/all-bookings",
        method: "GET",
      }),
      providesTags: ["BOOKING"],
    }),
    myBookings: builder.query({
      query: () => ({
        url: "/booking/my-bookings",
        method: "GET",
      }),
      providesTags: ["BOOKING"],
    }),
    getSingleBooking: builder.query({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
        method: "GET",
      }),
      providesTags: ["BOOKING"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useAllBookingsQuery,
  useMyBookingsQuery,
  useGetSingleBookingQuery,
} = bookingApi;
