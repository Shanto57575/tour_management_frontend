import DeleteConfirmation from "@/components/DeleteConfirmation";
import DestinationFormModal from "@/components/modules/Destination/DestinationFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type IDestination,
  useGetAllDestinationsQuery,
  useRemoveDestinationMutation,
} from "@/redux/features/destination/destination.api";
import FullPageLoader from "@/utils/FullPageLoader";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const ManageDestination = () => {
  const { data, isLoading } = useGetAllDestinationsQuery(undefined);
  const [removeDestination] = useRemoveDestinationMutation();

  const destinations = data?.destinations ?? [];

  const handleRemoveDestination = async (destinationId: string) => {
    const toastId = toast.loading("Removing destination...");

    try {
      const res = await removeDestination(destinationId).unwrap();
      if (res?.success) {
        toast.success(res.message || "Destination removed successfully", {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      const err = error as {
        data?: {
          errorSources?: { message?: string }[];
          message?: string;
        };
      };
      const message =
        err?.data?.errorSources?.[0]?.message ??
        err?.data?.message ??
        "Failed to remove destination";

      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Manage Destinations</h1>
        <DestinationFormModal
          mode="create"
          trigger={
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Destination
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <FullPageLoader />
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No destinations added yet
        </div>
      ) : (
        <div className="border border-muted rounded-md p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Starting Price</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((item: IDestination) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {typeof item.division === "string"
                      ? item.division
                      : item.division?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {typeof item.startingPrice === "number"
                      ? `${item.startingPrice} BDT`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.isFeatured ? (
                      <Badge>Featured</Badge>
                    ) : (
                      <Badge variant="secondary">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.images?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <DestinationFormModal
                        mode="update"
                        destination={item}
                        trigger={
                          <Button size="sm" variant="outline">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        }
                      />

                      <DeleteConfirmation
                        onConfirm={() => handleRemoveDestination(item._id)}
                        module="destination"
                      >
                        <Button size="sm" variant="outline">
                          <Trash2Icon className="h-4 w-4 text-red-500" />
                        </Button>
                      </DeleteConfirmation>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageDestination;
