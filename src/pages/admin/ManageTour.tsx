import { useState } from "react";
import {
  useGetAllToursQuery,
  useRemoveTourMutation,
} from "@/redux/features/tour/tour.api";
import { Button } from "@/components/ui/button";
import { Trash2Icon, EyeIcon, PencilIcon } from "lucide-react";
import FullPageLoader from "@/utils/FullPageLoader";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "sonner";
import Pagination from "@/utils/Pagination";
import { Link } from "react-router";
import type { ITour } from "@/types/tour.type";
import { EditTour } from "./EditTour";

export const ManageTour = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllToursQuery({ page, limit: 9 });
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Manage Tours</h1>
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

                  <p className="text-sm text-gray-600">
                    📍 {tour.location} — {tour.departureLocation}
                  </p>

                  <p className="text-sm text-gray-600">
                    💰 <strong>{tour.costFrom}</strong> BDT
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
