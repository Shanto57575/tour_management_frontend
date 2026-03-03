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

  console.log(tourTypes);
  console.log(divisions);
  const { data, isLoading } = useGetAllToursQuery({
    page,
    limit: 8,
    searchTerm: searchTerm || undefined,
    tourType: tourType && tourType !== "all" ? tourType : undefined,
    division: division && division !== "all" ? division : undefined
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((tour: ITour) => (
              <div
                key={tour._id}
                className="group border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <img
                  src={tour.images?.[0]}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="p-5 space-y-2">
                  <h2 className="font-semibold text-lg truncate">
                    {tour.title}
                  </h2>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPinIcon size={16} className="text-gray-500" /> {tour.location} — {tour.departureLocation}
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <BanknoteIcon size={16} className="text-gray-500" /> <strong>{tour.costFrom}</strong> BDT
                  </p>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {tour.description}
                  </p>

                  <div>
                    <Link to={`/tour/${tour.slug}`}>
                      <Button
                        size="sm"
                        className="cursor-pointer w-full flex items-center gap-1"
                        variant="secondary"
                      >
                        <EyeIcon size={16} />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
