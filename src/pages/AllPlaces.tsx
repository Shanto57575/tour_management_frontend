import { Button } from "@/components/ui/button";
import { useGetAllToursQuery } from "@/redux/features/tour/tour.api";
import type { ITour } from "@/types/tour.type";
import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function AllPlaces() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllToursQuery({ page, limit: 8 });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <FullPageLoader />
      </div>
    );

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

                  <p className="text-sm text-gray-600">
                    📍 {tour.location} — {tour.departureLocation}
                  </p>

                  <p className="text-sm text-gray-600">
                    💰 <strong>{tour.costFrom}</strong> BDT
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
