import DeleteConfirmation from "@/components/DeleteConfirmation";
import DestinationFormModal from "@/components/modules/Destination/DestinationFormModal";
import { DestinationFilterPanel } from "@/components/modules/Destination/DestinationFilterPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsByDivisionQuery } from "@/redux/features/district/district.api";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  type IDestination,
  useGetAllDestinationsQuery,
  useRemoveDestinationMutation,
} from "@/redux/features/destination/destination.api";
import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";
import { FilterIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface IDivisionOption {
  _id: string;
  name: string;
}

const ManageDestination = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: divisionsResponse } = useGetAllDivisionsQuery(undefined);
  const districtQueryArg =
    selectedDivision !== "all" ? { division: selectedDivision } : skipToken;
  const { data: districtResponse = [] } = useGetDistrictsByDivisionQuery(districtQueryArg);

  const divisions = useMemo(() => {
    const response = divisionsResponse as
      | { division?: IDivisionOption[]; data?: { division?: IDivisionOption[] } }
      | undefined;
    if (!response) return [];
    return response.division ?? response.data?.division ?? [];
  }, [divisionsResponse]);

  const divisionFilter = selectedDivision !== "all" ? selectedDivision : undefined;
  const districtFilter = selectedDistricts.length
    ? selectedDistricts.join(",")
    : undefined;

  const districtOptions = useMemo(() => districtResponse, [districtResponse]);

  const { data, isLoading } = useGetAllDestinationsQuery({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
    division: divisionFilter,
    district: districtFilter,
  });

  const [removeDestination] = useRemoveDestinationMutation();

  const destinations = data?.destinations ?? [];
  const meta = data?.meta ?? { page: 1, totalPage: 1 };
  const hasActiveFilters =
    searchTerm.length > 0 ||
    selectedDivision !== "all" ||
    selectedDistricts.length > 0;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const selectDivision = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedDistricts([]);
    setPage(1);
  };

  const toggleDistrict = (districtName: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(districtName)
        ? prev.filter((name) => name !== districtName)
        : [...prev, districtName],
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDivision("all");
    setSelectedDistricts([]);
    setPage(1);
  };

  const handleRemoveDestination = async (destinationId: string) => {
    const toastId = toast.loading("Removing destination...");
    try {
      const res = await removeDestination(destinationId).unwrap();
      if (res?.success) {
        toast.success(res.message || "Destination removed successfully", { id: toastId });
      }
    } catch (error: unknown) {
      const err = error as {
        data?: { errorSources?: { message?: string }[]; message?: string };
      };
      const message =
        err?.data?.errorSources?.[0]?.message ??
        err?.data?.message ??
        "Failed to remove destination";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Manage Destinations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            View, add, and manage travel destinations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" className="lg:hidden flex-1 sm:flex-none">
                <FilterIcon className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[90vw] sm:max-w-md overflow-hidden">
              <SheetHeader>
                <SheetTitle>Destination Filters</SheetTitle>
                <SheetDescription>Refine destinations by search, division, and district.</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-4 h-[calc(100vh-88px)] overflow-y-auto">
                <DestinationFilterPanel
                  searchTerm={searchTerm}
                  selectedDivision={selectedDivision}
                  selectedDistricts={selectedDistricts}
                  divisions={divisions}
                  districts={districtOptions}
                  onSearchChange={handleSearchChange}
                  onSelectDivision={selectDivision}
                  onDistrictToggle={toggleDistrict}
                  onClearDivision={() => {
                    setSelectedDivision("all");
                    setSelectedDistricts([]);
                    setPage(1);
                  }}
                  onClearDistrict={() => {
                    setSelectedDistricts([]);
                    setPage(1);
                  }}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <DestinationFormModal
            mode="create"
            trigger={
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
                <PlusIcon className="h-4 w-4" />
                Add Destination
              </Button>
            }
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-4 self-start">
          <DestinationFilterPanel
            searchTerm={searchTerm}
            selectedDivision={selectedDivision}
            selectedDistricts={selectedDistricts}
            divisions={divisions}
            districts={districtOptions}
            onSearchChange={handleSearchChange}
            onSelectDivision={selectDivision}
            onDistrictToggle={toggleDistrict}
            onClearDivision={() => {
              setSelectedDivision("all");
              setSelectedDistricts([]);
              setPage(1);
            }}
            onClearDistrict={() => {
              setSelectedDistricts([]);
              setPage(1);
            }}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-24 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <FullPageLoader />
            </div>
          ) : destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                No destinations found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "Add your first destination to get started"}
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Name
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Division
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          District
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Starting Price
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                          Images
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right pr-4">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {destinations.map((item: IDestination) => (
                        <TableRow
                          key={item._id}
                          className="border-b border-gray-100 dark:border-gray-800/70 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition-colors"
                        >
                          {/* Name */}
                          <TableCell className="font-medium text-sm text-gray-800 dark:text-gray-100 py-3.5 whitespace-nowrap">
                            {item.name}
                          </TableCell>

                          {/* Division */}
                          <TableCell className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {typeof item.division === "string"
                              ? item.division
                              : item.division?.name || "—"}
                          </TableCell>

                          {/* District */}
                          <TableCell className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {item.district || "—"}
                          </TableCell>

                          {/* Price */}
                          <TableCell className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            {typeof item.startingPrice === "number"
                              ? `${item.startingPrice.toLocaleString()} BDT`
                              : "—"}
                          </TableCell>

                          {/* Featured */}
                          <TableCell>
                            {item.isFeatured ? (
                              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-xs font-medium shadow-none">
                                Featured
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-0 text-xs font-medium shadow-none"
                              >
                                Regular
                              </Badge>
                            )}
                          </TableCell>

                          {/* Images */}
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300">
                              {item.images?.length || 0}
                            </span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="pr-4">
                            <div className="flex justify-end items-center gap-1.5">
                              <DestinationFormModal
                                mode="update"
                                destination={item}
                                trigger={
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-700 transition-colors"
                                  >
                                    <PencilIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                  </Button>
                                }
                              />
                              <DeleteConfirmation
                                onConfirm={() => handleRemoveDestination(item._id)}
                                module="destination"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20 dark:hover:border-red-800 transition-colors"
                                >
                                  <Trash2Icon className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                                </Button>
                              </DeleteConfirmation>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {meta.totalPage > 1 && (
                <div className="flex justify-center pt-1">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPage}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDestination;