import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/booking",
        method: "POST",
        data: bookingData,
      }),
      invalidatesTags: ["BOOKING"],
    }),
    updateBooking: builder.mutation({
      query: ({ bookingId, bookingData }) => ({
        url: `/booking/${bookingId}/status`,
        method: "PATCH",
        data: bookingData,
      }),
      invalidatesTags: ["BOOKING"],
    }),
    allBookings: builder.query({
      query: (params) => ({
        url: "/booking/all-bookings",
        method: "GET",
        params,
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
    createPaymentIntent: builder.mutation({
      query: ({ bookingId, method = "CARD" }) => ({
        url: "/payment/intent",
        method: "POST",
        data: { bookingId, method },
      }),
      invalidatesTags: ["BOOKING"],
    }),
    reInitPayment: builder.mutation({
      query: ({ bookingId, method = "CARD" }) => ({
        url: "/payment/intent",
        method: "POST",
        data: { bookingId, method },
      }),
      invalidatesTags: ["BOOKING"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useAllBookingsQuery,
  useMyBookingsQuery,
  useGetSingleBookingQuery,
  useCreatePaymentIntentMutation,
  useReInitPaymentMutation,
} = bookingApi;
