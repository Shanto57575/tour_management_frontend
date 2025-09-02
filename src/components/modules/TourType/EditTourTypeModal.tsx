import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditTourTypeMutation } from "@/redux/features/tour/tour.api";
import { EditIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type EditTourType = {
  tourTypeId: string;
  tourTypeName: string;
};

const EditTourTypeModal = ({ tourTypeId, tourTypeName }: EditTourType) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: { name: tourTypeName },
  });

  const [editTourType, { isLoading }] = useEditTourTypeMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await editTourType({
        tourTypeId,
        tourType: { name: data?.name },
      }).unwrap();
      if (res.success) {
        toast.success("Tour Type updated");
        setOpen(false);
        form.reset({ name: data?.name });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update tour type");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>
            <EditIcon className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tour Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="add-tour-type">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Tour type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-4 mb-2">Tour Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Tour Type" type="text" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isLoading} form="add-tour-type" type="submit">
              {isLoading ? (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                "submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default EditTourTypeModal;
