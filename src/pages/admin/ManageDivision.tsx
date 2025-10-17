import DeleteConfirmation from "@/components/DeleteConfirmation";
import AddDivisionModal from "@/components/modules/Division/AddDivisionModal";
import EditDivisionModal from "@/components/modules/Division/EditDivisionModal";
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
  useGetAllDivisionsQuery,
  useRemoveDivisionMutation,
} from "@/redux/features/division/division.api";
import FullPageLoader from "@/utils/FullPageLoader";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const ManageDivision = () => {
  const [removeDivision] = useRemoveDivisionMutation();
  const { data, isLoading } = useGetAllDivisionsQuery(undefined);
  const division = data?.division;

  const handleRemoveDivision = async (divisionId: string) => {
    const toastId = toast.loading("removing...");
    try {
      const res = await removeDivision(divisionId).unwrap();
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-end mt-10">
        <AddDivisionModal />
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <FullPageLoader />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No Tour Type Added yet
          </div>
        ) : (
          <div className="border border-muted rounded-md p-10 mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right w-20">Edit</TableHead>
                  <TableHead className="text-right w-20">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {division.map(
                  (item: { _id: string; name: string; thumbnail: string }) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div className="flex items-center gap-x-2">
                          <img
                            className="w-10 h-10 rounded"
                            src={item.thumbnail}
                            alt={`${item.name.toLowerCase().slice(0, 3)} image`}
                          />
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right w-20">
                        <EditDivisionModal divisionData={item} />
                      </TableCell>
                      <TableCell className="text-right w-20">
                        <DeleteConfirmation
                          onConfirm={() => handleRemoveDivision(item._id)}
                          module="division"
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
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDivision;
