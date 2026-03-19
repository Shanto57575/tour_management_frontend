import { useMemo, useState } from "react";
import { MapPin, Clock, ArrowRight, Star, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Link } from "react-router";
import {
  type IDestination,
  useGetAllDestinationsQuery,
} from "@/redux/features/destination/destination.api";
import FullPageLoader from "@/utils/FullPageLoader";

const toSegment = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const getDivisionName = (destination: IDestination) => {
  if (typeof destination.division === "string") return destination.division;
  return destination.division?.name ?? "Bangladesh";
};

const getPrice = (destination: IDestination) => destination.startingPrice ?? 0;

function DestinationCard({
  destination,
  index,
}: {
  destination: IDestination;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const divisionName = getDivisionName(destination);
  const divisionSegment = toSegment(divisionName || "bangladesh");
  const slug = destination.slug ?? toSegment(destination.name);
  const coverImage =
    destination.images?.[0] ||
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop";

  return (
    <Link
      to={`/destination/${divisionSegment}/${slug}`}
      className="group relative rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-900/40 cursor-pointer block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 1,
        transform: "translateY(0) scale(1)",
        transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08}s`,
      }}
    >
      <div className="relative h-60 mx-auto overflow-hidden">
        <img
          src={coverImage}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
            transform: hovered ? "translateX(100%)" : "translateX(-100%)",
            transition: "transform 0.7s ease",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full px-3 py-1 shadow-lg">
            <span className="text-[11px] font-bold text-white tracking-wide">
              {divisionName}
            </span>
          </div>

          {destination.isFeatured && (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-semibold text-amber-300">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white leading-tight drop-shadow-lg">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-white/70" />
            <span className="text-xs text-white/70">{destination.district || divisionName}</span>
          </div>
        </div>
      </div>

      <div className="p-4 font-open-sans bg-white dark:bg-zinc-900/70 border-t border-purple-100 dark:border-purple-900/30">
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {`${destination.description?.slice(0,120)}....`}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border text-[11px] font-medium bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800/50">
              <Clock size={10} />
              {destination.duration || "Custom"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Starting</p>
              <p className="text-sm font-bold text-foreground">
                ৳{getPrice(destination).toLocaleString()}
              </p>
            </div>

            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center group-hover:bg-purple-600 dark:group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-200">
              <ArrowRight
                size={14}
                className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedDestinations() {
  const [activeFilter, setActiveFilter] = useState("All");

  const { data, isLoading } = useGetAllDestinationsQuery({
    isFeatured: true,
    limit: 6,
    sort: "-createdAt",
  });

  const destinations = useMemo(() => data?.destinations ?? [], [data?.destinations]);

  const divisionFilters = useMemo(() => {
    const unique = new Set<string>();
    destinations.forEach((destination) => {
      unique.add(getDivisionName(destination));
    });

    return ["All", ...Array.from(unique)];
  }, [destinations]);

  const filteredDestinations =
    activeFilter === "All"
      ? destinations
      : destinations.filter(
          (destination) => getDivisionName(destination) === activeFilter,
        );

  return (
    <Container className="relative py-24 overflow-hidden bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={12} className="text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Top Picks Across Bangladesh
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Explore{" "}
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              Featured Destinations
            </span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Handpicked places from real destination data, curated for your next
            unforgettable trip.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {divisionFilters.map((filterName) => (
            <button
              key={filterName}
              onClick={() => setActiveFilter(filterName)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeFilter === filterName
                  ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30"
                  : "bg-white dark:bg-zinc-900/60 border-purple-100 dark:border-purple-900/40 text-muted-foreground hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              {filterName}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <FullPageLoader />
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No featured destinations available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDestinations.map((destination, i) => (
              <DestinationCard key={destination._id} destination={destination} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/all-destinations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-zinc-900/60 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 group"
          >
            View All Destinations
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </Container>
  );
}
