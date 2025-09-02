import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetTourTypesQuery,
  useRemoveTourTypeMutation,
} from "@/redux/features/tour/tour.api";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTourTypeModal from "@/components/modules/TourType/AddTourTypeModal";
import FullPageLoader from "@/utils/FullPageLoader";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "sonner";
import EditTourTypeModal from "@/components/modules/TourType/EditTourTypeModal";

export const AddTourType = () => {
  const { data, isLoading } = useGetTourTypesQuery(undefined);
  const [removeTourType] = useRemoveTourTypeMutation();

  const handleRemoveTourType = async (tourTypeId: string) => {
    const toastId = toast.loading("removing...");
    try {
      const res = await removeTourType(tourTypeId).unwrap();
      if (res.success) {
        console.log("");
        toast.success("Tour Type Deleted", { id: toastId });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete tour type", { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between my-8">
        <h1 className="font-semibold text-xl">Tour Types</h1>
        <AddTourTypeModal />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <FullPageLoader />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No Tour Type Added yet
        </div>
      ) : (
        <div className="border border-muted rounded-md p-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Edit</TableHead>
                <TableHead className="text-right">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: { _id: string; name: string }) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium w-full">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <EditTourTypeModal
                      tourTypeId={item._id}
                      tourTypeName={item.name}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteConfirmation
                      onConfirm={() => handleRemoveTourType(item._id)}
                    >
                      <Button
                        size="sm"
                        variant={"outline"}
                        className="cursor-pointer"
                      >
                        <Trash2Icon color="red" />
                      </Button>
                    </DeleteConfirmation>
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
