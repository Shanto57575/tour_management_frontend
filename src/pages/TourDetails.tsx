import { useState } from "react";
import { useParams } from "react-router";
import { useGetTourQuery } from "@/redux/features/tour/tour.api";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
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
  const { data: user } = useUserInfoQuery(undefined);
  console.log(user);
  console.log(TourData);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guestCount, setGuestCount] = useState<number>(1);

  if (isLoading) return <TourLoader />;

  if (!TourData) {
    return <TourNotFound />;
  }

  const imgs =
    TourData.images && TourData.images.length
      ? TourData.images
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
    TourData.startDate && TourData.endDate
      ? Math.ceil(
          (new Date(TourData.endDate).getTime() -
            new Date(TourData.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : "-";

  const maxGuests = Number(TourData.maxGuest || 1);
  const isMaxGuests = guestCount >= maxGuests;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Login First");
      return;
    }
    try {
      const payload: { tour: string; guestCount: number } = {
        tour: TourData?._id,
        guestCount,
      };

      const res = await createBooking(payload).unwrap();
      console.log("res==>", res);
      toast.success("Booking submitted successfully! We'll contact you soon.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.data.message || "Failed to submit booking. Please try again."
      );
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imgs[currentImageIndex]}
            alt={TourData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {imgs.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-800 hover:bg-white transition shadow-lg z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-800 hover:bg-white transition shadow-lg z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {imgs.map((_: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/60 w-1.5"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-gray-800 mb-3 text-sm font-medium shadow-lg">
              <MapPin className="w-4 h-4" />
              {TourData.location}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 max-w-3xl">
              {TourData.title}
            </h1>
            <p className="text-lg text-white/95 max-w-2xl">
              {TourData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Duration
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatDate(TourData.startDate)} -{" "}
                      {formatDate(TourData.endDate)}
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {durationDays} days
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Group Size
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Maximum {TourData.maxGuest} guests
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                      Small group
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Minimum Age
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {TourData.minAge} years old
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                      All ages welcome
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Tour Type
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Round trip
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                      Full circuit
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {TourData.amenities && TourData.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Amenities
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TourData.amenities.map((amenity: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Itinerary
                </h2>
              </div>
              <div className="space-y-3">
                {Array.isArray(TourData.tourPlan) &&
                TourData.tourPlan.length ? (
                  TourData.tourPlan.map((day: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm pt-1">
                        {day}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No itinerary available.
                  </p>
                )}
              </div>
            </div>

            {/* Included/Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    What's Included
                  </h3>
                </div>
                <ul className="space-y-2">
                  {Array.isArray(TourData.included) &&
                  TourData.included.length ? (
                    TourData.included.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No items listed
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Not Included
                  </h3>
                </div>
                <ul className="space-y-2">
                  {Array.isArray(TourData.excluded) &&
                  TourData.excluded.length ? (
                    TourData.excluded.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <X className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No items listed
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    From
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ৳{Number(TourData.costFrom || 0).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      / person
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Guests
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount((g) => Math.max(1, g - 1))
                          }
                          className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition"
                          aria-label="Decrease guests"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">
                          {guestCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount((g) => Math.min(maxGuests, g + 1))
                          }
                          disabled={isMaxGuests}
                          className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase guests"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {isMaxGuests && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Maximum guest limit reached</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBooking ? "Processing..." : "Book Now"}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Expert local guides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
