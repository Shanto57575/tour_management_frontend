import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllToursQuery, useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import type { ITour } from "@/types/tour.type";
import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";
import { EyeIcon, SearchIcon, MapPinIcon, BanknoteIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function AllPlaces() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tourType, setTourType] = useState("");
  const [division, setDivision] = useState("");

  const { data: tourTypesResponse } = useGetTourTypesQuery(undefined);
  const { data: divisionsResponse } = useGetAllDivisionsQuery(undefined);

  const tourTypes = tourTypesResponse?.data || tourTypesResponse || [];
  const divisions = divisionsResponse?.data || divisionsResponse || [];

  const { data, isLoading } = useGetAllToursQuery({
    page,
    limit: 8,
    searchTerm: searchTerm || undefined,
    tourType: tourType && tourType !== "all" ? tourType : undefined,
    division: division && division !== "all" ? division : undefined
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <FullPageLoader />
      </div>
    );

  const tours = data?.tours || [];
  const meta = data?.meta || { page: 1, totalPage: 1 };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Manage Tours</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Search tours..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select value={tourType} onValueChange={(val) => { setTourType(val); setPage(1); }}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Tour Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tour Types</SelectItem>
            {tourTypes?.map((type: any) => (
              <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={division} onValueChange={(val) => { setDivision(val); setPage(1); }}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Divisions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {divisions?.division?.map((div: any) => (
              <SelectItem key={div._id} value={div._id}>{div.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No Tours Available
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((tour: ITour) => (
              <div
                key={tour._id}
                className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={tour.images?.[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4">
                  <h2 className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 truncate mb-3 leading-tight">
                    {tour.title}
                  </h2>

                  <div className="space-y-1.5 mb-3">
                    <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPinIcon size={12} className="shrink-0" />
                      <span className="truncate">{tour.location} — {tour.departureLocation}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <BanknoteIcon size={12} className="shrink-0" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{tour.costFrom}</span>
                      <span>BDT</span>
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {tour.description}
                  </p>

                  <Link to={`/tour/${tour.slug}`}>
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-purple-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-purple-500 dark:hover:text-white text-white transition-colors duration-200"
                    >
                      <EyeIcon size={12} />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
