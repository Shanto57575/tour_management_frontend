import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { EditIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTourTypeModal from "@/components/modules/TourType/AddTourTypeModal";
import FullPageLoader from "@/utils/FullPageLoader";

export const AddTourType = () => {
  const { data, isLoading } = useGetTourTypesQuery(undefined);

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
              {data.map((item: { name: string }, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium w-full">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      <EditIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      <Trash2Icon color="red" className="w-4 h-4" />
                    </Button>
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
