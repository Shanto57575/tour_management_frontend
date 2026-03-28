import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  Shield,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import TourLoader from "@/components/modules/Tour/TourLoader";
import TourNotFound from "@/components/modules/Tour/TourNotFound";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import type { ITourEntityRef, ITourPlan } from "@/types/tour.type";
import { toast } from "sonner";

const getEntityName = (value?: string | ITourEntityRef) => {
  if (!value) return "";
  return typeof value === "string" ? value : value.name || value.slug || "";
};

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
  const navigate = useNavigate();

  const imgs =
    TourData?.images && TourData?.images?.length
      ? TourData?.images
      : ["/placeholder.jpg"];

  useEffect(() => {
    if (!TourData || imgs.length <= 1) return;

    const sliderInterval = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
    }, 5000);

    return () => window.clearInterval(sliderInterval);
  }, [TourData, imgs.length]);

  if (isLoading) return <TourLoader />;
  if (!TourData) return <TourNotFound />;

  const primaryLocation =
    getEntityName(TourData.destination) ||
    getEntityName(TourData.district) ||
    getEntityName(TourData.division) ||
    "-";

  const basePrice = Number(TourData.pricePerPerson || TourData.costFrom || 0);
  const discountPercent = Number(TourData.discount || 0);
  const effectivePrice =
    discountPercent > 0
      ? Math.round(basePrice - (basePrice * discountPercent) / 100)
      : basePrice;

  const formatDate = (s?: string) =>
    s
      ? new Date(s).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  const durationDays =
    typeof TourData.durationDays === "number"
      ? TourData.durationDays
      : TourData?.startDate && TourData?.endDate
        ? Math.ceil(
            (new Date(TourData.endDate).getTime() -
              new Date(TourData.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : "-";

  const maxGuests = Number(TourData.maxGuest || 1);
  const isMaxGuests = guestCount >= maxGuests;
  const isInactive = TourData.status === "inactive";
  const isUnavailable = TourData.isAvailable === false;
  const isExpired = TourData.endDate
    ? Date.now() > new Date(new Date(TourData.endDate).setHours(23, 59, 59, 999)).getTime()
    : false;
  const isNotBookable = isInactive || isUnavailable || isExpired;
  const lifecycleLabel = isExpired || isInactive ? "Ended" : isUnavailable ? "Running" : "Upcoming";
  const unavailableReason = isExpired || isInactive
    ? "This tour has ended and is no longer available for booking."
    : isUnavailable
      ? "This tour is currently running. New bookings are paused for this schedule."
      : "";

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNotBookable) {
      toast.error("This tour is currently not available for booking");
      return;
    }

    if (!user?.data) {
      toast.error("Please Login First");
      navigate("/login");
      return;
    }
    if (!user.data.phone) {
      navigate(`/${user?.data?.role?.toLowerCase()}/profile`);
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
      const paymentRes = await createPaymentIntent({ bookingId, method: "CARD" }).unwrap();
      if (paymentRes?.data?.clientSecret) {
        const amount = Number(paymentRes.data.payment?.amount ?? effectivePrice * guestCount);
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            tourTitle: TourData.title,
            tourLocation: primaryLocation,
            tourImage: TourData.images?.[0] ?? null,
            guestCount,
            amount,
            costPerPerson: effectivePrice,
            startDate: TourData.startDate,
            endDate: TourData.endDate,
            bookingId,
          })
        );
        setCheckoutData({ clientSecret: paymentRes.data.clientSecret, amount });
        return;
      }
      toast.success("Booking submitted successfully");
    } catch (error: unknown) {
      const apiError = error as { status?: number; data?: { message?: string } };
      if (apiError.status === 401) return toast.error("Session Over! Please Login First");
      toast.error(apiError.data?.message || "Failed to submit booking. Please try again.");
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  const totalCost = effectivePrice * guestCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a12]">
      <div className="td-root">
        {checkoutData && (
          <CheckoutModal
            clientSecret={checkoutData.clientSecret}
            amount={checkoutData.amount}
            tourTitle={TourData.title}
            onClose={() => setCheckoutData(null)}
          />
        )}

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[88vh] overflow-hidden noise-overlay">
          {/* Background image */}
          <img
            src={imgs[currentImageIndex]}
            alt={TourData.title}
            className="hero-img absolute inset-0 w-full h-full object-cover"
          />

          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-transparent" />

          {/* Image nav arrows */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 z-20 group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 z-20 group"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 lg:hidden">
                {imgs.map((_: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentImageIndex
                        ? "bg-purple-400 w-6 h-2"
                        : "bg-white/40 w-2 h-2 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Desktop thumbnail strip */}
          {imgs.length > 1 && (
            <div className="hidden lg:flex absolute bottom-8 right-10 gap-2 z-20">
              {imgs.slice(0, 5).map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`thumb-btn w-14 h-14 xl:w-16 xl:h-16 rounded-xl overflow-hidden border-2 ${
                    i === currentImageIndex
                      ? "border-purple-400 opacity-100 scale-105"
                      : "border-white/20 opacity-60 hover:opacity-90"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {imgs.length > 5 && (
                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xs font-semibold">
                  +{imgs.length - 5}
                </div>
              )}
            </div>
          )}

          {/* Hero content */}
          <div className="absolute inset-0 flex items-end z-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-10 sm:pb-14 md:pb-16">

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white/90 text-xs font-medium tracking-wide">
                  <MapPin className="w-3 h-3 text-purple-300" />
                  {primaryLocation}
                </span>
                {durationDays !== "-" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-xl border border-purple-400/25 text-purple-200 text-xs font-medium tracking-wide">
                    <Clock className="w-3 h-3" />
                    {durationDays} Days
                  </span>
                )}
                {(TourData.isFeatured || TourData.isTrending || (TourData.averageRating && TourData.averageRating >= 4)) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 backdrop-blur-xl border border-emerald-400/20 text-emerald-300 text-xs font-medium tracking-wide">
                    <Star className="w-3 h-3 fill-current" />
                    {TourData.isTrending ? "Trending" : "Top Rated"}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl border text-xs font-medium tracking-wide ${
                    lifecycleLabel === "Upcoming"
                      ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200"
                      : lifecycleLabel === "Running"
                        ? "bg-amber-500/20 border-amber-400/30 text-amber-100"
                        : "bg-red-500/20 border-red-400/30 text-red-200"
                  }`}
                >
                  {lifecycleLabel}
                </span>
              </div>

              <h1 className="td-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] max-w-3xl mb-4 tracking-tight">
                {TourData.title}
              </h1>

              {/* Price teaser — hidden on lg (shown in sidebar) */}
              <div className="lg:hidden mt-5 flex items-center gap-3">
                <div>
                  <p className="text-white/50 text-xs mb-0.5">
                    {discountPercent > 0 ? "Discounted price" : "Starting from"}
                  </p>
                  {discountPercent > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-medium text-white/40 line-through">৳{basePrice.toLocaleString()}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>
                    </div>
                  )}
                  <p className="text-2xl sm:text-3xl font-bold text-white td-display">
                    ৳{effectivePrice.toLocaleString()}
                    <span className="text-sm font-normal text-white/50 ml-1">/ person</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">

            {/* ── LEFT COLUMN ─────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-6 md:space-y-8">

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up fade-up-1">
                {[
                  {
                    icon: <Calendar className="w-4 h-4" />,
                    label: "Start Date",
                    value: formatDate(TourData.startDate),
                    sub: `Ends ${formatDate(TourData.endDate)}`,
                    accent: "purple",
                  },
                  {
                    icon: <Clock className="w-4 h-4" />,
                    label: "Duration",
                    value: `${durationDays} Days`,
                    sub: "Full experience",
                    accent: "violet",
                  },
                  {
                    icon: <Users className="w-4 h-4" />,
                    label: "Total Seats",
                    value: `${TourData.maxGuest}`,
                    sub: "seats",
                    accent: "purple",
                  },
                  {
                    icon: <Users className="w-4 h-4" />,
                    label: "Available",
                    value: `${Math.max(0, (TourData.maxGuest || 0) - (TourData.bookedCount || 0))}`,
                    sub: "seats left",
                    accent: "violet",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="stat-card group bg-white dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200/80 dark:border-white/8 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/8 dark:hover:shadow-purple-500/10 cursor-default"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-200">
                      {stat.icon}
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-white/35 uppercase tracking-widest mb-1">
                      {stat.label}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight td-display">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-white/30 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div className="fade-up fade-up-2 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/8 p-6 md:p-8">
                <h2 className="td-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Tour Essentials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Lifecycle</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">{lifecycleLabel}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Availability</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">
                      {TourData.isAvailable === false ? "Not bookable now" : "Open for booking"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Tour Type</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">{getEntityName(TourData.tourType) || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Group</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">{TourData.groupType || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Difficulty</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">{TourData.difficulty || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Guide</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">{getEntityName(TourData.guide) || "Assigned later"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] px-3.5 py-3 sm:col-span-2 lg:col-span-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold">Route</p>
                    <p className="mt-1 text-slate-900 dark:text-white font-semibold">
                      {(TourData.departureLocation || "-") + " -> " + (TourData.arrivalLocation || "-")}
                    </p>
                  </div>
                </div>
                {Array.isArray(TourData.languages) && TourData.languages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {TourData.languages.map((lang: string) => (
                      <span key={lang} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/75">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
                {Array.isArray(TourData.tags) && TourData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TourData.tags.map((tag: string) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Min Age Note */}
              <div className="fade-up fade-up-2 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/20 p-5 md:p-6 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                    Age Requirement
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Minimum traveller age must be <span className="font-bold">{TourData.minAge}+ years</span> to participate in this tour.
                  </p>
                </div>
              </div>

              {/* About */}
              <div className="fade-up fade-up-3 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/8 p-6 md:p-8">
                <h2 className="td-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  About This Tour
                </h2>
                <div className="w-10 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mb-4" />
                <p className="text-slate-600 dark:text-white/60 leading-relaxed text-sm md:text-[15px] font-light">
                  {TourData.description}
                </p>
              </div>

              {/* Amenities */}
              {TourData.amenities && TourData.amenities.length > 0 && (
                <div className="fade-up fade-up-4 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/8 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="td-display text-xl font-bold text-slate-900 dark:text-white">
                      Amenities
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TourData.amenities.map((amenity: string, i: number) => (
                      <span
                        key={i}
                        className="amenity-tag inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-500/20 text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-500/15"
                      >
                        <Check className="w-3 h-3" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              <div className="fade-up fade-up-5 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/8 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="td-display text-xl font-bold text-slate-900 dark:text-white leading-none">
                      Day-by-Day Itinerary
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-white/35 mt-0.5">Your complete journey breakdown</p>
                  </div>
                </div>

                {Array.isArray(TourData.tourPlan) && TourData.tourPlan.length ? (
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[17px] top-4 bottom-4 w-px bg-gradient-to-b from-purple-400 via-purple-200 to-transparent dark:from-purple-600 dark:via-purple-900/40" />
                    <div className="space-y-4">
                      {TourData.tourPlan.map((day: ITourPlan, i: number) => (
                        <div key={`${day.day}-${day.title}-${i}`} className="itinerary-row flex gap-5 group">
                          {/* Day dot */}
                          <div className="relative flex-shrink-0 z-10">
                            <div className="day-dot w-[34px] h-[34px] rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">
                              {day.day || i + 1}
                            </div>
                          </div>
                          {/* Content */}
                          <div className="flex-1 bg-slate-50 dark:bg-white/[0.025] rounded-xl p-4 border border-slate-200/60 dark:border-white/6 group-hover:border-purple-200 dark:group-hover:border-purple-500/20 transition-colors duration-200 mt-0.5">
                            <p className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1">
                              Day {day.day || i + 1}
                            </p>
                            <h3 className="td-display text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                              {day.title}
                            </h3>
                            {day.description && (
                              <p className="text-sm text-slate-600 dark:text-white/50 leading-relaxed font-light">
                                {day.description}
                              </p>
                            )}
                            {Array.isArray(day.meals) && day.meals.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {day.meals.map((meal: string, mi: number) => (
                                  <span key={mi} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 font-medium">
                                    {meal}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-300 dark:text-white/20">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No itinerary available yet.</p>
                  </div>
                )}
              </div>

              {/* Included / Excluded */}
              <div className="fade-up fade-up-6 grid sm:grid-cols-2 gap-4 md:gap-6">
                {/* Included */}
                <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/8 p-5 md:p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="td-display text-base font-bold text-slate-900 dark:text-white">
                      What's Included
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {Array.isArray(TourData.included) && TourData.included.length ? (
                      TourData.included.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-slate-400 dark:text-white/30">No items listed</li>
                    )}
                  </ul>
                </div>

                {/* Excluded */}
                <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/8 p-5 md:p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="td-display text-base font-bold text-slate-900 dark:text-white">
                      Not Included
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {Array.isArray(TourData.excluded) && TourData.excluded.length ? (
                      TourData.excluded.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-slate-400 dark:text-white/30">No items listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── RIGHT / BOOKING SIDEBAR ──────────────────────────── */}
            <div className="hidden lg:block w-[340px] xl:w-[370px] flex-shrink-0">
              <div className="sticky top-8">
                <div className="booking-card-glow bg-white dark:bg-[#0f0f1a] rounded-2xl border border-purple-100 dark:border-purple-500/15 overflow-hidden">

                  {/* Price header */}
                  <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 dark:from-purple-700 dark:via-violet-700 dark:to-purple-800 p-6 overflow-hidden">
                    {/* Decorative orbs */}
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/8 blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-purple-400/20 blur-lg" />

                    <p className="text-purple-200 text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 relative z-10">
                      {discountPercent > 0 ? "Discounted price" : "Starting from"}
                    </p>
                    {discountPercent > 0 && (
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <span className="text-purple-300/60 text-sm line-through">৳{basePrice.toLocaleString()}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/20">{discountPercent}% OFF</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5 relative z-10">
                      <span className="td-display text-4xl xl:text-5xl font-bold text-white leading-none">
                        ৳{effectivePrice.toLocaleString()}
                      </span>
                      <span className="text-purple-200/80 text-sm font-light">/ person</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 relative z-10">
                      <Calendar className="w-3.5 h-3.5 text-purple-300" />
                      <p className="text-purple-200 text-xs">
                        {formatDate(TourData.startDate)} → {formatDate(TourData.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 xl:p-6 space-y-5">

                    {/* Guest counter */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-white/35 uppercase tracking-[0.12em] mb-3">
                        Number of Guests
                      </label>
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.03] rounded-xl p-1.5 border border-slate-200 dark:border-white/8">
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                          disabled={guestCount <= 1}
                          className="cursor-pointer w-10 h-10 rounded-lg bg-white dark:bg-white/6 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex items-center justify-center text-slate-700 dark:text-white font-bold text-lg transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed border border-slate-200/80 dark:border-white/8 hover:border-purple-200 dark:hover:border-purple-500/20"
                        >
                          −
                        </button>
                        <div className="text-center">
                          <span className="td-display text-2xl font-bold text-slate-900 dark:text-white">
                            {guestCount}
                          </span>
                          <p className="text-[11px] text-slate-400 dark:text-white/35">
                            {guestCount === 1 ? "guest" : "guests"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.min(maxGuests, g + 1))}
                          disabled={isMaxGuests}
                          className="cursor-pointer w-10 h-10 rounded-lg bg-white dark:bg-white/6 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex items-center justify-center text-slate-700 dark:text-white font-bold text-lg transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed border border-slate-200/80 dark:border-white/8 hover:border-purple-200 dark:hover:border-purple-500/20"
                        >
                          +
                        </button>
                      </div>

                      {isMaxGuests && (
                        <div className="flex items-center gap-2 mt-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                            Maximum guest limit reached
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cost breakdown */}
                    <div className="bg-slate-50 dark:bg-white/[0.025] rounded-xl p-4 border border-slate-200/60 dark:border-white/6 space-y-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-white/45">
                          ৳{effectivePrice.toLocaleString()} × {guestCount} {guestCount === 1 ? "guest" : "guests"}
                        </span>
                        <span className="text-slate-700 dark:text-white/75 font-medium">
                          ৳{totalCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-white/45">Service fee</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                          Free
                        </span>
                      </div>
                      <div className="border-t border-slate-200 dark:border-white/8 pt-2.5 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                        <span className="td-display text-xl font-bold text-purple-600 dark:text-purple-400">
                          ৳{totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleBookingSubmit}
                      disabled={isBooking || isNotBookable}
                      className="cursor-pointer w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isBooking ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          {isNotBookable ? "Unavailable" : "Reserve Your Spot"}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {isNotBookable && (
                      <p className="text-xs text-red-500 text-center">{unavailableReason}</p>
                    )}

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: <Zap className="w-3.5 h-3.5" />, text: "Instant Confirm" },
                        { icon: <Shield className="w-3.5 h-3.5" />, text: "Secure Payment" },
                        { icon: <Star className="w-3.5 h-3.5" />, text: "Local Guides" },
                      ].map((badge, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/8 border border-purple-100 dark:border-purple-500/15 text-center"
                        >
                          <span className="text-purple-500 dark:text-purple-400">{badge.icon}</span>
                          <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold leading-tight">
                            {badge.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-[11px] text-slate-400 dark:text-white/25">
                      No charge until your booking is confirmed
                    </p>

                    <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-3.5">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold mb-1.5">
                        Cancellation Policy
                      </p>
                      <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                        {TourData.cancellationPolicy || "Cancellation terms will be shared by the operator during confirmation."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE BOOKING SECTION ───────────────────────────────── */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-white dark:bg-[#0f0f1a] rounded-2xl border border-purple-100 dark:border-purple-500/15 overflow-hidden shadow-xl shadow-purple-500/8 dark:shadow-purple-500/15">

            {/* Price header */}
            <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 dark:from-purple-700 dark:via-violet-700 dark:to-purple-800 px-5 py-5 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/8 blur-xl" />
              <p className="text-purple-200 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 relative z-10">
                {discountPercent > 0 ? "Discounted price" : "Starting from"}
              </p>
              {discountPercent > 0 && (
                <div className="flex items-center gap-2 mb-1 relative z-10">
                  <span className="text-purple-300/60 text-sm line-through">৳{basePrice.toLocaleString()}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5 relative z-10">
                <span className="td-display text-3xl sm:text-4xl font-bold text-white">
                  ৳{effectivePrice.toLocaleString()}
                </span>
                <span className="text-purple-200/80 text-sm font-light">/ person</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Guest counter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-white/35 uppercase tracking-[0.12em] mb-3">
                  Number of Guests
                </label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.03] rounded-xl p-1.5 border border-slate-200 dark:border-white/8">
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    disabled={guestCount <= 1}
                    className="w-11 h-11 rounded-lg bg-white dark:bg-white/6 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex items-center justify-center text-slate-700 dark:text-white font-bold text-xl transition disabled:opacity-25 border border-slate-200 dark:border-white/8"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <span className="td-display text-3xl font-bold text-slate-900 dark:text-white">
                      {guestCount}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-white/35">
                      {guestCount === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.min(maxGuests, g + 1))}
                    disabled={isMaxGuests}
                    className="w-11 h-11 rounded-lg bg-white dark:bg-white/6 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex items-center justify-center text-slate-700 dark:text-white font-bold text-xl transition disabled:opacity-25 border border-slate-200 dark:border-white/8"
                  >
                    +
                  </button>
                </div>

                {isMaxGuests && (
                  <div className="flex items-center gap-2 mt-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                      Maximum guest limit reached
                    </span>
                  </div>
                )}
              </div>

              {/* Cost summary */}
              <div className="bg-slate-50 dark:bg-white/[0.025] rounded-xl p-4 border border-slate-200/60 dark:border-white/6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-white/45">
                    ৳{effectivePrice.toLocaleString()} × {guestCount}
                  </span>
                  <span className="text-slate-700 dark:text-white/75 font-medium">
                    ৳{totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-white/8 pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="td-display text-xl font-bold text-purple-600 dark:text-purple-400">
                    ৳{totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleBookingSubmit}
                disabled={isBooking || isNotBookable}
                className="cta-btn w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    {isNotBookable ? "Unavailable" : "Reserve Your Spot"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {isNotBookable && (
                <p className="text-xs text-red-500 text-center">{unavailableReason}</p>
              )}

              {/* Trust badges */}
              <div className="flex gap-2">
                {[
                  { icon: <Zap className="w-3 h-3" />, text: "Instant Confirm" },
                  { icon: <Shield className="w-3 h-3" />, text: "Secure Payment" },
                  { icon: <Star className="w-3 h-3" />, text: "Local Guides" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/8 border border-purple-100 dark:border-purple-500/15"
                  >
                    <span className="text-purple-500 dark:text-purple-400">{badge.icon}</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold leading-tight text-center">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-center text-[11px] text-slate-400 dark:text-white/25">
                No charge until your booking is confirmed
              </p>

              <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-3.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35 font-semibold mb-1.5">
                  Cancellation Policy
                </p>
                <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                  {TourData.cancellationPolicy || "Cancellation terms will be shared by the operator during confirmation."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}