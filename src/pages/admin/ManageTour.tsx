import { useState } from "react";
import {
  useGetAllToursQuery,
  useRemoveTourMutation,
  useGetTourTypesQuery
} from "@/redux/features/tour/tour.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2Icon, EyeIcon, PencilIcon, SearchIcon, MapPinIcon, BanknoteIcon } from "lucide-react";
import FullPageLoader from "@/utils/FullPageLoader";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "sonner";
import Pagination from "@/utils/Pagination";
import { Link } from "react-router";
import type { ITour } from "@/types/tour.type";
import { EditTour } from "./EditTour";

export const ManageTour = () => {
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
    limit: 9,
    searchTerm: searchTerm || undefined,
    tourType: tourType && tourType !== "all" ? tourType : undefined,
    division: division && division !== "all" ? division : undefined
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
      console.log(error);
      toast.error("Failed to delete tour", { id: toastId });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <FullPageLoader />
      </div>
    );

  console.log(data);
  const tours = data?.tours || [];
  const meta = data?.meta || { page: 1, totalPage: 1 };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

                  <div className="flex justify-between gap-2 pt-3">
                    {/* View Details */}
                    <Link to={`/tour/${tour.slug}`}>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        variant="secondary"
                      >
                        <EyeIcon size={16} />
                        View Details
                      </Button>
                    </Link>

                    <EditTour tour={tour}>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        variant="outline"
                      >
                        <PencilIcon size={16} />
                        Edit
                      </Button>
                    </EditTour>

                    {/* Delete */}
                    <DeleteConfirmation
                      onConfirm={() => handleRemoveTour(tour._id)}
                      module="tour"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Trash2Icon color="red" size={16} />
                        Delete
                      </Button>
                    </DeleteConfirmation>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
};
