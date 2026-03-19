import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSingleDestinationQuery } from "@/redux/features/destination/destination.api";
import FullPageLoader from "@/utils/FullPageLoader";
import {
  ArrowLeft,
  CalendarRange,
  Clock,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";

export default function DestinationDetails() {
  const { slug } = useParams();
  const { data: destination, isLoading } = useGetSingleDestinationQuery(slug || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = useMemo(
    () =>
      destination?.images?.length
        ? destination.images
        : [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
          ],
    [destination],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <FullPageLoader />
      </div>
    );
  }

  if (!destination) {
    return (
      <Container className="py-20">
        <div className="text-center rounded-2xl border border-dashed border-purple-200 dark:border-purple-900/40 py-16">
          <h1 className="text-2xl font-semibold mb-3">Destination not found</h1>
          <p className="text-muted-foreground mb-6">
            The destination you requested is unavailable or was removed.
          </p>
          <Link to="/all-destinations">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all destinations
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const divisionName =
    typeof destination.division === "string"
      ? destination.division
      : destination.division?.name || "Bangladesh";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <section className="relative h-[48vh] md:h-[62vh] overflow-hidden">
        <img
          src={images[activeImageIndex]}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/15" />

        <Container className="relative h-full flex items-end pb-10">
          <div className="w-full">
            <Link
              to="/all-destinations"
              className="inline-flex items-center gap-2 text-white/85 hover:text-white text-sm mb-4"
            >
              <ArrowLeft size={14} /> Back to all destinations
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-purple-600 hover:bg-purple-600 text-white border-none">
                <Sparkles className="h-3 w-3 mr-1" /> {divisionName}
              </Badge>
              {destination.isFeatured && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-black border-none">
                  Featured Pick
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
              {destination.name}
            </h1>
            <p className="text-white/80 max-w-2xl text-sm md:text-base line-clamp-2">
              {destination.summary || destination.description}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold mb-3">About this destination</h2>
              <p className="text-muted-foreground leading-relaxed">
                {destination.description || "No detailed description available yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold mb-4">Highlights & Attractions</h2>
              {destination.attractions?.length ? (
                <div className="flex flex-wrap gap-2">
                  {destination.attractions.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No attractions listed yet.</p>
              )}
            </div>

            {images.length > 1 && (
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <h2 className="text-lg font-semibold px-2 pt-1 mb-3">Gallery</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 rounded-xl overflow-hidden border transition-all ${
                        idx === activeImageIndex
                          ? "border-purple-500 ring-2 ring-purple-500/35"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      <img src={img} alt={`${destination.name}-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h3 className="text-lg font-semibold mb-4">Quick Info</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                    <Wallet size={14} /> Starting Price
                  </span>
                  <span className="font-semibold text-foreground">
                    ৳{(destination.startingPrice ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                    <Clock size={14} /> Duration
                  </span>
                  <span className="font-medium">{destination.duration || "Custom"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                    <CalendarRange size={14} /> Best Time
                  </span>
                  <span className="font-medium">{destination.bestTimeToVisit || "All year"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                    <MapPin size={14} /> District
                  </span>
                  <span className="font-medium">{destination.district || "N/A"}</span>
                </div>
              </div>

              <Link to="/all-destinations" className="block mt-5">
                <Button className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Explore More Destinations
                </Button>
              </Link>
              <Link to="/contact" className="block mt-2">
                <Button variant={"outline"} className="cursor-pointer w-full bg-transparent hover:bg-purple-700 text-purple-500 hover:text-white">
                  Contact Us for custom plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
