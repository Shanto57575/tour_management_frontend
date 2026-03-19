import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import {
  type IDestination,
  useGetAllDestinationsQuery,
} from "@/redux/features/destination/destination.api";
import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";
import {
  ArrowRight,
  Clock,
  MapPin,
  SearchIcon,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

interface IDivisionOption {
  _id: string;
  name: string;
}

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

export default function AllDestinations() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [division, setDivision] = useState("all");
  const [sort, setSort] = useState("-createdAt");

  const { data: divisionResponse } = useGetAllDivisionsQuery(undefined);

  const divisions = useMemo(() => {
    const response = divisionResponse as
      | { division?: IDivisionOption[]; data?: { division?: IDivisionOption[] } }
      | undefined;

    if (!response) return [];
    return response.division ?? response.data?.division ?? [];
  }, [divisionResponse]);

  const { data, isLoading } = useGetAllDestinationsQuery({
    page,
    limit: 9,
    searchTerm: searchTerm || undefined,
    division: division === "all" ? undefined : division,
    sort,
  });

  const destinations = data?.destinations ?? [];
  const meta = data?.meta ?? { page: 1, totalPage: 1, total: 0 };

  const hasActiveFilters =
    searchTerm !== "" || division !== "all" || sort !== "-createdAt";

  const clearFilters = () => {
    setSearchTerm("");
    setDivision("all");
    setSort("-createdAt");
    setPage(1);
  };

  return (
    <Container className="relative py-16 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_15%,rgba(139,92,246,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.1),transparent_35%)]" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-5">
            <Sparkles size={12} className="text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Destination Explorer
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            All{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Destinations
            </span>
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Search, filter by division, and discover the best places in
            Bangladesh.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm p-4 md:p-5 mb-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search — takes remaining space */}
            <div className="relative flex-1 min-w-0">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={16}
              />
              <Input
                placeholder="Search destinations..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Selects row — stacks on mobile, inline on sm+ */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:shrink-0">
              {/* Division */}
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} className="text-muted-foreground shrink-0" />
                <Select
                  value={division}
                  onValueChange={(value) => {
                    setDivision(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {divisions.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 min-w-0">
                <SlidersHorizontal
                  size={15}
                  className="text-muted-foreground shrink-0"
                />
                <Select
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-createdAt">Newest First</SelectItem>
                    <SelectItem value="startingPrice">
                      Price: Low → High
                    </SelectItem>
                    <SelectItem value="-startingPrice">
                      Price: High → Low
                    </SelectItem>
                    <SelectItem value="name">Name: A → Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear — only visible when filters are active */}
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X size={13} />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Result count */}
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-purple-100 dark:border-purple-900/30">
            Showing{" "}
            <span className="font-medium text-foreground">
              {destinations.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {meta.total ?? 0}
            </span>{" "}
            destinations
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <FullPageLoader />
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground rounded-xl border border-dashed border-purple-200 dark:border-purple-900/40">
            No destinations found for your filters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.map((destination) => {
                const divisionName = getDivisionName(destination);
                const divisionSegment = toSegment(divisionName);
                const slug = destination.slug ?? toSegment(destination.name);
                const image =
                  destination.images?.[0] ||
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop";

                return (
                  <Link
                    key={destination._id}
                    to={`/destination/${divisionSegment}/${slug}`}
                    className="group rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/70 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
                  >
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-lg text-white">
                          {destination.name}
                        </h3>
                        <p className="text-white/75 text-xs inline-flex items-center gap-1">
                          <MapPin size={12} />{" "}
                          {destination.district || divisionName}
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                        {destination.summary ||
                          destination.description ||
                          "Discover more about this destination."}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-purple-100 text-purple-700 border border-purple-200 text-xs dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800/50">
                          <Clock size={11} />{" "}
                          {destination.duration || "Custom"}
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-muted-foreground">
                            Starting
                          </p>
                          <p className="font-semibold text-foreground">
                            ৳{(destination.startingPrice ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
                        View Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPage}
              onPageChange={(nextPage) => setPage(nextPage)}
            />
          </>
        )}
      </div>
    </Container>
  );
}