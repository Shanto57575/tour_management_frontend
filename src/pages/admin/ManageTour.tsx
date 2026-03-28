import { useId, useMemo, useState } from "react";
import {
  useGetAllToursQuery,
  useRemoveTourMutation,
  useGetTourTypesQuery
} from "@/redux/features/tour/tour.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsByDivisionQuery } from "@/redux/features/district/district.api";
import { skipToken } from "@reduxjs/toolkit/query";
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
import {
  Trash2Icon,
  EyeIcon,
  PencilIcon,
  SearchIcon,
  MapPinIcon,
  BanknoteIcon,
  StarIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";
import FullPageLoader from "@/utils/FullPageLoader";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "sonner";
import Pagination from "@/utils/Pagination";
import { Link } from "react-router";
import type { ITour } from "@/types/tour.type";
import { EditTour } from "@/pages/admin/EditTour";
import { Container } from "@/components/shared/Container";

type NamedOption = {
  _id: string;
  name: string;
};

const getEntityName = (
  value:
    | ITour["division"]
    | ITour["district"]
    | ITour["destination"]
    | ITour["tourType"]
) => {
  if (!value) return "";
  return typeof value === "string" ? value : value.name || "";
};

type FilterSidebarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tourTypeOptions: NamedOption[];
  selectedTourType: string;
  onSelectTourType: (tourTypeId: string) => void;
  divisionOptions: NamedOption[];
  selectedDivision: string;
  onSelectDivision: (divisionId: string) => void;
  districtOptions: NamedOption[];
  selectedDistricts: string[];
  onToggleDistrict: (districtId: string) => void;
  onClearDistricts: () => void;
  onClearAll: () => void;
};

const FilterSidebar = ({
  searchTerm,
  onSearchChange,
  tourTypeOptions,
  selectedTourType,
  onSelectTourType,
  divisionOptions,
  selectedDivision,
  onSelectDivision,
  districtOptions,
  selectedDistricts,
  onToggleDistrict,
  onClearDistricts,
  onClearAll,
}: FilterSidebarProps) => {
  const hasAnyFilter =
    searchTerm.trim().length > 0 ||
    selectedDivision !== "all" ||
    selectedDistricts.length > 0 ||
    selectedTourType !== "all";
  const tourTypeRadioName = useId();
  const divisionRadioName = useId();

  return (
    <div className="h-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 overflow-y-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Filters
        </h2>
        {hasAnyFilter && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onClearAll}
            className="h-7 px-2 text-xs"
          >
            <XIcon className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Search
        </label>
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
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Tour Type
          </label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={() => onSelectTourType("all")}
          >
            All Types
          </Button>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="radio"
              name={tourTypeRadioName}
              checked={selectedTourType === "all"}
              onChange={() => onSelectTourType("all")}
              className="size-4 accent-purple-600 dark:accent-purple-400"
            />
            <span>All Tour Types</span>
          </label>
          {tourTypeOptions?.map((item) => (
            <label
              key={item._id}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              <input
                type="radio"
                name={tourTypeRadioName}
                checked={selectedTourType === item._id}
                onChange={() => onSelectTourType(item._id)}
                className="size-4 accent-purple-600 dark:accent-purple-400"
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Division
          </label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={() => onSelectDivision("all")}
          >
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
          {divisionOptions?.map((item) => (
            <label
              key={item._id}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
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
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            District
          </label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={onClearDistricts}
          >
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
              <label
                key={item._id}
                className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
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
    </div>
  );
};

export const ManageTour = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tourType, setTourType] = useState("all");
  const [division, setDivision] = useState("all");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: tourTypesResponse } = useGetTourTypesQuery(undefined);
  const { data: divisionsResponse } = useGetAllDivisionsQuery(undefined);

  const tourTypeOptions: NamedOption[] =
    tourTypesResponse?.data || tourTypesResponse || [];
  const divisionOptions: NamedOption[] =
    divisionsResponse?.division || divisionsResponse?.data?.division || [];

  const districtQueryArg =
    division !== "all" ? { division } : skipToken;

  const { data: districtsResponse = [] } = useGetDistrictsByDivisionQuery(districtQueryArg);

  const districtOptions: NamedOption[] = useMemo(
    () => districtsResponse.map((item) => ({ _id: item._id, name: item.name })),
    [districtsResponse],
  );

  const { data, isLoading } = useGetAllToursQuery({
    page,
    limit: 12,
    searchTerm: searchTerm || undefined,
    tourType: tourType && tourType !== "all" ? tourType : undefined,
    division: division && division !== "all" ? division : undefined,
    district: selectedDistricts.length > 0 ? selectedDistricts.join(",") : undefined,
  });

  const [removeTour] = useRemoveTourMutation();

  const handleRemoveTour = async (tourId: string) => {
    const toastId = toast.loading("Removing...");
    try {
      const res = await removeTour(tourId).unwrap();
      if (res.success) {
        toast.success("Tour deleted successfully", { id: toastId });
      }
    } catch (error) {
      console.log("error ==>", error)
      toast.error("Failed to delete tour", { id: toastId });
    }
  };

  const handleSelectDivision = (divisionId: string) => {
    setDivision(divisionId);
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

  const handleClearAll = () => {
    setSearchTerm("");
    setTourType("all");
    setDivision("all");
    setSelectedDistricts([]);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <FullPageLoader />
      </div>
    );
  }

  const tours = data?.tours || [];
  const meta = data?.meta || { page: 1, totalPage: 1 };

  return (
    <Container className="w-full p-4 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Manage Tours</h1>

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
              <SheetDescription>
                Refine results by tour type and division.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4 h-[calc(100vh-88px)] overflow-y-auto">
              <FilterSidebar
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setPage(1);
                }}
                tourTypeOptions={tourTypeOptions}
                selectedTourType={tourType}
                onSelectTourType={(val) => {
                  setTourType(val);
                  setPage(1);
                }}
                divisionOptions={divisionOptions}
                selectedDivision={division}
                onSelectDivision={handleSelectDivision}
                districtOptions={districtOptions}
                selectedDistricts={selectedDistricts}
                onToggleDistrict={handleToggleDistrict}
                onClearDistricts={() => {
                  setSelectedDistricts([]);
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
            tourTypeOptions={tourTypeOptions}
            selectedTourType={tourType}
            onSelectTourType={(val) => {
              setTourType(val);
              setPage(1);
            }}
            divisionOptions={divisionOptions}
            selectedDivision={division}
            onSelectDivision={handleSelectDivision}
            districtOptions={districtOptions}
            selectedDistricts={selectedDistricts}
            onToggleDistrict={handleToggleDistrict}
            onClearDistricts={() => {
              setSelectedDistricts([]);
              setPage(1);
            }}
            onClearAll={handleClearAll}
          />
        </aside>

        <section className="lg:col-span-9 xl:col-span-9 pr-1 flex flex-col">
          {tours.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No Tours Available
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour: ITour) => {
                  const destinationName = getEntityName(tour.destination);
                  const districtName = getEntityName(tour.district);

                  const basePrice = Number(tour.pricePerPerson || 0);
                  const discount = Number(tour.discount || 0);
                  const finalPrice =
                    basePrice - (basePrice * discount) / 100;

                  const seatsLeft =
                    (tour.maxGuest || 0) - (tour.bookedCount || 0);

                  return (
                    <div
                      key={tour._id}
                      className="group border rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={tour.images?.[0]}
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

                        <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                          <MapPinIcon size={14} />
                          {destinationName ||
                            districtName ||
                            "Unknown"}
                        </p>

                        {/* Rating + Seats */}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <StarIcon size={14} className="text-yellow-500" />
                            {tour.averageRating?.toFixed(1) || "4.5"}
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
                          <span className="font-semibold text-purple-600">
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

                        {/* Actions */}
                        <div className="flex justify-between gap-2 pt-3">
                          <Link to={`/tour/${tour.slug}`}>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="cursor-pointer flex items-center gap-1"
                            >
                              <EyeIcon size={16} />
                            </Button>
                          </Link>

                          <EditTour tour={tour}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer flex items-center gap-1"
                            >
                              <PencilIcon size={16} />
                            </Button>
                          </EditTour>

                          <DeleteConfirmation
                            onConfirm={() =>
                              handleRemoveTour(tour._id)
                            }
                            module="tour"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer flex items-center gap-1"
                            >
                              <Trash2Icon
                                size={16}
                                className="text-red-500"
                              />
                            </Button>
                          </DeleteConfirmation>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
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
};