import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsByDivisionQuery } from "@/redux/features/district/district.api";
import { useGetAllToursQuery, useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import type { ITour, ITourEntityRef } from "@/types/tour.type";
import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  BanknoteIcon,
  EyeIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Link } from "react-router";

const getEntityName = (value?: string | ITourEntityRef) => {
  if (!value) return "";
  return typeof value === "string" ? value : value.name || value.slug || "";
};

type FilterSidebarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  divisionOptions: { _id: string; name: string }[];
  selectedDivision: string;
  onSelectDivision: (divisionId: string) => void;
  districtOptions: { _id: string; name: string }[];
  selectedDistricts: string[];
  onToggleDistrict: (districtId: string) => void;
  tourTypeOptions: { _id: string; name: string }[];
  selectedTourTypes: string[];
  onToggleTourType: (tourTypeId: string) => void;
  onClearDistricts: () => void;
  onClearTourTypes: () => void;
  onClearAll: () => void;
};

const FilterSidebar = ({
  searchTerm,
  onSearchChange,
  divisionOptions,
  selectedDivision,
  onSelectDivision,
  districtOptions,
  selectedDistricts,
  onToggleDistrict,
  tourTypeOptions,
  selectedTourTypes,
  onToggleTourType,
  onClearDistricts,
  onClearTourTypes,
  onClearAll,
}: FilterSidebarProps) => {
  const hasAnyFilter =
    searchTerm.trim().length > 0 ||
    selectedDivision !== "all" ||
    selectedDistricts.length > 0 ||
    selectedTourTypes.length > 0;
  const divisionRadioName = useId();

  return (
    <div className="h-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 overflow-y-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Filters</h2>
        {hasAnyFilter && (
          <Button type="button" size="sm" variant="ghost" onClick={onClearAll} className="h-7 px-2 text-xs">
            <XIcon className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Search</label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tours..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Division</label>
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onSelectDivision("all")}>
            All Divisions
          </Button>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="radio"
              name={divisionRadioName}
              checked={selectedDivision === "all"}
              onChange={() => onSelectDivision("all")}
              className="size-4 accent-purple-600 dark:accent-purple-400"
            />
            <span>All Divisions</span>
          </label>
          {divisionOptions.map((item) => (
            <label key={item._id} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="radio"
                name={divisionRadioName}
                checked={selectedDivision === item._id}
                onChange={() => onSelectDivision(item._id)}
                className="size-4 accent-purple-600 dark:accent-purple-400"
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">District</label>
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onClearDistricts}>
            All Districts
          </Button>
        </div>

        {selectedDivision === "all" ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Select one division first to choose districts.</p>
        ) : districtOptions.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No districts found for this division.</p>
        ) : (
          <div className="space-y-2 pr-1 max-h-56 overflow-y-auto">
            {districtOptions.map((item) => (
              <label key={item._id} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(item._id)}
                  onChange={() => onToggleDistrict(item._id)}
                  className="size-4 rounded accent-black dark:accent-white"
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tour Type</label>
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onClearTourTypes}>
            All Tour Types
          </Button>
        </div>
        <div className="space-y-2 pr-1 max-h-56 overflow-y-auto">
          {tourTypeOptions.map((item) => (
            <label key={item._id} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTourTypes.includes(item._id)}
                onChange={() => onToggleTourType(item._id)}
                className="size-4 rounded accent-black dark:accent-white"
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AllPlaces() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTourTypes, setSelectedTourTypes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: tourTypesResponse } = useGetTourTypesQuery(undefined);
  const { data: divisionsResponse } = useGetAllDivisionsQuery(undefined);

  const tourTypeOptions = tourTypesResponse?.data || tourTypesResponse || [];
  const divisionOptions = divisionsResponse?.division || divisionsResponse?.data?.division || [];

  const districtQueryArg =
    selectedDivision !== "all" ? { division: selectedDivision } : skipToken;

  const { data: districtsResponse = [] } = useGetDistrictsByDivisionQuery(districtQueryArg);

  const districtOptions = useMemo(
    () => districtsResponse.map((item) => ({ _id: item._id, name: item.name })),
    [districtsResponse],
  );

  const { data, isLoading } = useGetAllToursQuery({
    page,
    limit: 12,
    searchTerm: searchTerm || undefined,
    division: selectedDivision !== "all" ? selectedDivision : undefined,
    district: selectedDistricts.length > 0 ? selectedDistricts.join(",") : undefined,
    tourType: selectedTourTypes.length > 0 ? selectedTourTypes.join(",") : undefined,
  });

  const tours = data?.tours || [];
  const meta = data?.meta || { page: 1, totalPage: 1 };

  const handleSelectDivision = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedDistricts([]);
    setPage(1);
  };

  const handleToggleDistrict = (districtId: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(districtId)
        ? prev.filter((item) => item !== districtId)
        : [...prev, districtId],
    );
    setPage(1);
  };

  const handleToggleTourType = (tourTypeId: string) => {
    setSelectedTourTypes((prev) =>
      prev.includes(tourTypeId)
        ? prev.filter((item) => item !== tourTypeId)
        : [...prev, tourTypeId],
    );
    setPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedDivision("all");
    setSelectedDistricts([]);
    setSelectedTourTypes([]);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <FullPageLoader />
      </div>
    );
  }

  return (
    <Container className="w-full p-4 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">All Places</h1>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button className="lg:hidden" variant="outline" type="button">
              <FilterIcon className="size-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[90vw] sm:max-w-md overflow-hidden">
            <SheetHeader>
              <SheetTitle>Filter Tours</SheetTitle>
              <SheetDescription>Refine results by division, district, and tour type.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4 h-[calc(100vh-88px)] overflow-y-auto">
              <FilterSidebar
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setPage(1);
                }}
                divisionOptions={divisionOptions}
                selectedDivision={selectedDivision}
                onSelectDivision={handleSelectDivision}
                districtOptions={districtOptions}
                selectedDistricts={selectedDistricts}
                onToggleDistrict={handleToggleDistrict}
                tourTypeOptions={tourTypeOptions}
                selectedTourTypes={selectedTourTypes}
                onToggleTourType={handleToggleTourType}
                onClearDistricts={() => {
                  setSelectedDistricts([]);
                  setPage(1);
                }}
                onClearTourTypes={() => {
                  setSelectedTourTypes([]);
                  setPage(1);
                }}
                onClearAll={handleClearAll}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 lg:sticky lg:top-4 self-start">
          <FilterSidebar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            divisionOptions={divisionOptions}
            selectedDivision={selectedDivision}
            onSelectDivision={handleSelectDivision}
            districtOptions={districtOptions}
            selectedDistricts={selectedDistricts}
            onToggleDistrict={handleToggleDistrict}
            tourTypeOptions={tourTypeOptions}
            selectedTourTypes={selectedTourTypes}
            onToggleTourType={handleToggleTourType}
            onClearDistricts={() => {
              setSelectedDistricts([]);
              setPage(1);
            }}
            onClearTourTypes={() => {
              setSelectedTourTypes([]);
              setPage(1);
            }}
            onClearAll={handleClearAll}
          />
        </aside>

        <section className="lg:col-span-9 xl:col-span-9 pr-1 flex flex-col">
          {tours.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No Tours Available</div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour: ITour) => {
                  const location =
                    getEntityName(tour.destination) ||
                    getEntityName(tour.district) ||
                    getEntityName(tour.division) ||
                    "Unknown";

                  const basePrice = Number(tour.pricePerPerson || tour.costFrom || 0);
                  const discount = Number(tour.discount || 0);
                  const finalPrice = basePrice - (basePrice * discount) / 100;

                  const seatsLeft = (tour.maxGuest || 0) - (tour.bookedCount || 0);

                  return (
                    <div
                      key={tour._id}
                      className="group border rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={tour.images?.[0] || "/placeholder.jpg"}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-md">
                            {discount}% OFF
                          </span>
                        )}

                        {(tour.status === "inactive" || tour.isAvailable === false) && (
                          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <h2 className="font-semibold text-base md:text-lg line-clamp-1">
                          {tour.title}
                        </h2>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPinIcon size={14} />
                          <span className="truncate">
                            {location}
                            {tour.departureLocation ? ` - ${tour.departureLocation}` : ""}
                          </span>
                        </p>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            ⭐ {tour.averageRating?.toFixed(1) || "4.5"}
                          </span>

                          <span
                            className={
                              seatsLeft > 0
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {seatsLeft > 0
                              ? `${seatsLeft} seats left`
                              : "Sold out"}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <BanknoteIcon size={16} />
                          <span className="text-sm font-semibold text-purple-600">
                            ৳{finalPrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs line-through text-muted-foreground">
                              ৳{basePrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {tour.description}
                        </p>

                        {/* Action */}
                        <div className="pt-3">
                          <Link to={`/tour/${tour.slug}`} className="block">
                            <Button
                              size="sm"
                              className="relative w-full h-9 text-xs font-medium cursor-pointer 
      flex items-center justify-center gap-1.5 rounded-lg 
      bg-purple-600 text-white overflow-hidden group"
                            >
                              <span
                                className="absolute inset-0 bg-purple-700 
        translate-x-[-100%] group-hover:translate-x-0 
        transition-transform duration-300 ease-out"
                              ></span>

                              {/* content */}
                              <span className="relative flex items-center gap-1.5">
                                <EyeIcon size={14} />
                                View Details
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 mt-2">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPage}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </Container>
  );
}
