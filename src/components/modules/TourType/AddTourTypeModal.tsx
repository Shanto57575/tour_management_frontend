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
import { useAddTourTypeMutation } from "@/redux/features/tour/tour.api";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type TourTypeForm = {
  name: string;
};

const AddTourTypeModal = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<TourTypeForm>();

  const [addTourType, { isLoading }] = useAddTourTypeMutation();

  const onSubmit: SubmitHandler<TourTypeForm> = async (data) => {
    try {
      const res = await addTourType({ name: data.name }).unwrap();
      if (res.success) {
        toast.success("New Tour Type added");
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add tour type");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Add Tour Type</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Tour Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form id="add-tour-type" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Tour type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-4 mb-2">Tour Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tour Type"
                        type="text"
                        {...field}
                        value={field.value || ""}
                      />
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
                <>
                  <span>please wait...</span>
                  <LoaderCircleIcon
                    className="-ms-1 animate-spin"
                    size={16}
                    aria-hidden="true"
                  />
                </>
              ) : (
                "submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddTourTypeModal;
