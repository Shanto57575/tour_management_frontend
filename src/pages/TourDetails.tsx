import { useState } from "react";
import { useParams } from "react-router";
import { useGetTourQuery } from "@/redux/features/tour/tour.api";
import {
  useCreateBookingMutation,
  useCreatePaymentIntentMutation,
} from "@/redux/features/booking/booking.api";
import { CheckoutModal } from "@/components/modules/Payment/CheckoutModal";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Check,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import TourLoader from "@/components/modules/Tour/TourLoader";
import TourNotFound from "@/components/modules/Tour/TourNotFound";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { toast } from "sonner";

export default function TourDetails() {
  const { slug } = useParams();
  const { data: TourData, isLoading } = useGetTourQuery(slug);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const { data: user } = useUserInfoQuery(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [checkoutData, setCheckoutData] = useState<{
    clientSecret: string;
    amount: number;
  } | null>(null);

  if (isLoading) return <TourLoader />;
  if (!TourData) return <TourNotFound />;

  const imgs =
    TourData?.images && TourData?.images?.length
      ? TourData?.images
      : ["/placeholder.jpg"];

  const formatDate = (s?: string) =>
    s
      ? new Date(s).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "-";

  const durationDays =
    TourData?.startDate && TourData?.endDate
      ? Math.ceil(
        (new Date(TourData?.endDate).getTime() -
          new Date(TourData?.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      )
      : "-";

  const maxGuests = Number(TourData.maxGuest || 1);
  const isMaxGuests = guestCount >= maxGuests;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.data) {
      toast.error("Please Login First");
      return;
    }

    if (!user.data.phone) {
      toast.error("Please add your phone number in your profile before booking");
      return;
    }

    try {
      const bookingDate =
        TourData?.startDate ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const payload = {
        tour: TourData?._id,
        guestCount,
        bookingDate,
        contactInfo: {
          name: user.data.name,
          phone: user.data.phone,
          email: user.data.email,
        },
      };
      const bookingRes = await createBooking(payload).unwrap();
      const bookingId = bookingRes?.data?._id;

      if (!bookingId) {
        toast.success("Booking submitted successfully");
        return;
      }

      const paymentRes = await createPaymentIntent({
        bookingId,
        method: "CARD",
      }).unwrap();

      if (paymentRes?.data?.clientSecret) {
        const unitCost = Number(TourData.pricePerPerson || 0);
        const amount = Number(paymentRes.data.payment?.amount ?? unitCost * guestCount);

        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            tourTitle: TourData.title,
            tourLocation: TourData.location,
            tourImage: TourData.images?.[0] ?? null,
            guestCount,
            amount,
            costPerPerson: unitCost,
            startDate: TourData.startDate,
            endDate: TourData.endDate,
            bookingId,
          }),
        );

        setCheckoutData({
          clientSecret: paymentRes.data.clientSecret,
          amount,
        });
        return;
      }

      toast.success("Booking submitted successfully");
    } catch (error: unknown) {
      const apiError = error as {
        status?: number;
        data?: { message?: string };
      };

      if (apiError.status === 401) {
        return toast.error("Session Over! Please Login First");
      }
      toast.error(
        apiError.data?.message || "Failed to submit booking. Please try again.",
      );
    }
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);

  const totalCost = Number(TourData.costFrom || 0) * guestCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">

      {/* ── STRIPE CHECKOUT MODAL ─────────────────────────────────────── */}
      {checkoutData && (
        <CheckoutModal
          clientSecret={checkoutData.clientSecret}
          amount={checkoutData.amount}
          tourTitle={TourData.title}
          onClose={() => setCheckoutData(null)}
        />
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] md:h-[75vh] overflow-hidden">
        {/* image */}
        <img
          src={imgs[currentImageIndex]}
          alt={TourData.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />

        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* image nav */}
        {imgs.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* dot indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {imgs.map((_: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`rounded-full transition-all duration-300 ${i === currentImageIndex
                    ? "bg-white w-7 h-2"
                    : "bg-white/50 w-2 h-2 hover:bg-white/75"
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* thumbnail strip */}
        {imgs.length > 1 && (
          <div className="hidden md:flex absolute bottom-8 right-8 gap-2 z-20">
            {imgs.slice(0, 4).map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === currentImageIndex
                  ? "border-white scale-105"
                  : "border-white/30 opacity-70 hover:opacity-100"
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {imgs.length > 4 && (
              <div className="w-14 h-14 rounded-lg bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xs font-semibold">
                +{imgs.length - 4}
              </div>
            )}
          </div>
        )}

        {/* hero text */}
        <div className="absolute inset-0 flex items-end z-10">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium">
                <MapPin className="w-3 h-3" />
                {TourData.location}
              </span>
              {durationDays !== "-" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {durationDays} Days
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-3 tracking-tight">
              {TourData.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed line-clamp-2">
              {TourData.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE PRICE BAR ──────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Starting from</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            ৳{Number(TourData.costFrom || 0).toLocaleString()}
            <span className="text-xs font-normal text-slate-500 dark:text-zinc-400 ml-1">/ person</span>
          </p>
        </div>
        <button
          onClick={handleBookingSubmit}
          disabled={isBooking}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-indigo-600/30"
        >
          {isBooking ? "Processing…" : "Book Now"}
        </button>
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

          {/* ── LEFT / MAIN CONTENT ───────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: "Start Date",
                  value: formatDate(TourData.startDate),
                  sub: formatDate(TourData.endDate),
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  label: "Duration",
                  value: `${durationDays} Days`,
                  sub: "Full trip",
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  label: "Max Guests",
                  value: `${TourData.maxGuest}`,
                  sub: "Small group",
                },
                {
                  icon: <MapPin className="w-4 h-4" />,
                  label: "Min Age",
                  value: `${TourData.minAge}+`,
                  sub: "Years old",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200">
                      {stat.icon}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                About This Tour
              </h2>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
                {TourData.description}
              </p>
            </div>

            {/* Amenities */}
            {TourData.amenities && TourData.amenities.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Amenities
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TourData.amenities.map((amenity: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors duration-150"
                    >
                      <Check className="w-3 h-3" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Day-by-Day Itinerary
                </h2>
              </div>

              {Array.isArray(TourData.tourPlan) && TourData.tourPlan.length ? (
                <div className="relative">
                  {/* vertical line */}
                  <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 via-indigo-200 to-transparent dark:from-indigo-600 dark:via-indigo-900" />
                  <div className="space-y-4">
                    {TourData.tourPlan.map((day: string, i: number) => (
                      <div key={i} className="flex gap-5 group">
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-200 relative z-10">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1 bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-4 border border-slate-200 dark:border-zinc-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 mt-0.5">
                          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                            Day {i + 1}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                            {day}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 dark:text-zinc-500">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No itinerary available yet.</p>
                </div>
              )}
            </div>

            {/* Included / Excluded */}
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    What's Included
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {Array.isArray(TourData.included) && TourData.included.length ? (
                    TourData.included.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 group">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400 dark:text-zinc-500">
                      No items listed
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Not Included
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {Array.isArray(TourData.excluded) && TourData.excluded.length ? (
                    TourData.excluded.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400 dark:text-zinc-500">
                      No items listed
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* ── RIGHT / BOOKING CARD ──────────────────────────────── */}
          <div className="hidden lg:block w-full lg:w-[360px] xl:w-[380px] flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-200/60 dark:shadow-zinc-950/80 overflow-hidden">

                {/* price header */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 p-6">
                  <p className="text-indigo-200 text-xs font-medium mb-1 uppercase tracking-wider">
                    Starting from
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ৳{Number(TourData.costFrom || 0).toLocaleString()}
                    </span>
                    <span className="text-indigo-200 text-sm">/ person</span>
                  </div>
                  <p className="text-indigo-200 text-xs mt-2">
                    {formatDate(TourData.startDate)} → {formatDate(TourData.endDate)}
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {/* guest counter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-800 rounded-xl p-1 border border-slate-200 dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                        disabled={guestCount <= 1}
                        className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-600 flex items-center justify-center text-slate-700 dark:text-zinc-200 font-bold text-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                      >
                        −
                      </button>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {guestCount}
                        </span>
                        <p className="text-xs text-slate-400 dark:text-zinc-500">
                          {guestCount === 1 ? "guest" : "guests"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => Math.min(maxGuests, g + 1))}
                        disabled={isMaxGuests}
                        className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-600 flex items-center justify-center text-slate-700 dark:text-zinc-200 font-bold text-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    {isMaxGuests && (
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                          Maximum guest limit reached
                        </span>
                      </div>
                    )}
                  </div>

                  {/* cost breakdown */}
                  <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-4 border border-slate-200 dark:border-zinc-700/50 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-zinc-400">
                        ৳{Number(TourData.costFrom || 0).toLocaleString()} × {guestCount} {guestCount === 1 ? "guest" : "guests"}
                      </span>
                      <span className="text-slate-700 dark:text-zinc-300 font-medium">
                        ৳{totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-zinc-400">
                        Service fee
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/40">
                        Free
                      </span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-zinc-700 pt-2.5 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        ৳{totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleBookingSubmit}
                    disabled={isBooking}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                  >
                    {isBooking ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : (
                      "Reserve Your Spot"
                    )}
                  </button>

                  {/* trust badges */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: <Check className="w-3.5 h-3.5" />, text: "Instant Confirm" },
                      { icon: <Check className="w-3.5 h-3.5" />, text: "Free Cancel" },
                      { icon: <Check className="w-3.5 h-3.5" />, text: "Local Guides" },
                    ].map((badge, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800/40 text-center"
                      >
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {badge.icon}
                        </span>
                        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium leading-tight">
                          {badge.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE FULL BOOKING SECTION ──────────────────────────────── */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 px-6 py-5">
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                ৳{Number(TourData.costFrom || 0).toLocaleString()}
              </span>
              <span className="text-indigo-200 text-sm">/ person</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Number of Guests
            </label>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-800 rounded-xl p-1 border border-slate-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                disabled={guestCount <= 1}
                className="w-11 h-11 rounded-lg bg-white dark:bg-zinc-700 hover:bg-slate-100 flex items-center justify-center text-slate-700 dark:text-zinc-200 font-bold text-xl transition disabled:opacity-30"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{guestCount}</span>
                <p className="text-xs text-slate-400 dark:text-zinc-500">{guestCount === 1 ? "guest" : "guests"}</p>
              </div>
              <button
                type="button"
                onClick={() => setGuestCount((g) => Math.min(maxGuests, g + 1))}
                disabled={isMaxGuests}
                className="w-11 h-11 rounded-lg bg-white dark:bg-zinc-700 hover:bg-slate-100 flex items-center justify-center text-slate-700 dark:text-zinc-200 font-bold text-xl transition disabled:opacity-30"
              >
                +
              </button>
            </div>

            {isMaxGuests && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Maximum guest limit reached
                </span>
              </div>
            )}

            {/* cost summary */}
            <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-4 border border-slate-200 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-zinc-400">
                  ৳{Number(TourData.costFrom || 0).toLocaleString()} × {guestCount}
                </span>
                <span className="text-slate-700 dark:text-zinc-300 font-medium">৳{totalCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-zinc-700 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">৳{totalCost.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={isBooking}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/30"
            >
              {isBooking ? "Processing…" : "Reserve Your Spot"}
            </button>

            <div className="flex gap-2">
              {["Instant Confirm", "Free Cancel", "Local Guides"].map((text, i) => (
                <div key={i} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800/40">
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium leading-tight text-center">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}