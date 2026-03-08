import { useMyBookingsQuery, useReInitPaymentMutation } from "@/redux/features/booking/booking.api";
import FullPageLoader from "@/utils/FullPageLoader";
import { CalendarIcon, MapPin, Users, CreditCard, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { CheckoutModal } from "@/components/modules/Payment/CheckoutModal";

export const Bookings = () => {
  const { data: bookingsResponse, isLoading } = useMyBookingsQuery(undefined);
  const [reInitPayment, { isLoading: isInitializingPayment }] = useReInitPaymentMutation();
  const [checkoutData, setCheckoutData] = useState<{
    clientSecret: string;
    amount: number;
    tourTitle: string;
    tourImage: string | null;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 min-h-[60vh] items-center">
        <FullPageLoader />
      </div>
    );
  }

  const bookings = bookingsResponse?.data || [];
  console.log("bookings", bookings)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle2 size={14} /> Completed
          </span>
        );
      case "CANCEL":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold">
            <XCircle size={14} /> Cancelled
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">
            <AlertCircle size={14} /> Failed
          </span>
        );
      default:
        // PENDING
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <AlertCircle size={14} /> Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status === "PAID") {
      return <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">Paid</span>;
    }
    if (status === "UNPAID") {
      return <span className="text-rose-500 font-bold text-sm bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md">Unpaid</span>;
    }
    return <span className="text-gray-500 font-bold text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md capitalize">{status?.toLowerCase()}</span>;
  };

  const handlePayNow = async (booking: any) => {
    const toastId = toast.loading("Preparing payment...");
    try {
      const res = await reInitPayment(booking._id).unwrap();
      if (res?.data?.clientSecret) {
        toast.dismiss(toastId);
        // Save booking data for the success page
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            tourTitle: booking.tour?.title,
            tourLocation: booking.tour?.location,
            tourImage: booking.tour?.images?.[0] ?? null,
            guestCount: booking.guestCount,
            amount: booking.payment?.amount,
            costPerPerson: booking.tour?.costFrom,
            startDate: booking.tour?.startDate,
            endDate: booking.tour?.endDate,
            bookingId: booking._id,
          })
        );
        setCheckoutData({
          clientSecret: res.data.clientSecret,
          amount: booking.payment?.amount,
          tourTitle: booking.tour?.title,
          tourImage: booking.tour?.images?.[0] ?? null,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to initialize payment", { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:ml-20">

      {/* Stripe Checkout Modal */}
      {checkoutData && (
        <CheckoutModal
          clientSecret={checkoutData.clientSecret}
          amount={checkoutData.amount}
          tourTitle={checkoutData.tourTitle}
          onClose={() => setCheckoutData(null)}
        />
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 font-merriweather">
            My Bookings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage and view all your past and upcoming tour reservations.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 px-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
            <CalendarIcon size={36} className="text-indigo-400 dark:text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Bookings Found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
            You haven't booked any tours yet. Explore our destinations and find your next adventure!
          </p>
          <Link
            to="/all-places"
            className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20"
          >
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bookings.map((booking: any) => {
            const tour = booking.tour;
            const payment = booking.payment;

            return (
              <div
                key={booking._id}
                className="group flex flex-col sm:flex-row bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  {tour?.images?.[0] ? (
                    <img
                      src={tour.images[0]}
                      alt={tour?.title || "Tour"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin size={32} />
                    </div>
                  )}
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                        {tour?.title || "Tour details unavailable"}
                      </h3>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          ৳{payment?.amount?.toLocaleString() || "0"}
                        </span>
                        <div className="mt-1">
                          {getPaymentBadge(payment?.status)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {tour?.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{tour.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CalendarIcon size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <span>
                          {formatDate(tour?.startDate)} {tour?.endDate ? `→ ${formatDate(tour.endDate)}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <span>
                          {booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'} booked
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-mono">
                      Ref: {booking._id.substring(booking._id.length - 8).toUpperCase()}
                    </div>

                    <div className="flex items-center gap-3">
                      {booking.status === "PENDING" && payment?.status === "UNPAID" && (
                        <button
                          onClick={() => handlePayNow(booking)}
                          disabled={isInitializingPayment}
                          className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isInitializingPayment ? "Loading..." : "Pay Now"}
                        </button>
                      )}

                      {booking.status === "COMPLETE" && payment?.invoiceUrl && (
                        <a
                          href={payment.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <CreditCard size={14} /> Invoice
                        </a>
                      )}

                      {tour?._id && (
                        <Link
                          to={`/tour/${tour?.slug}`}
                          className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                          title="View Tour Details"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
