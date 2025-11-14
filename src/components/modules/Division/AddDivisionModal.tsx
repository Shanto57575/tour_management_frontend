/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleImageUploader from "@/components/SingleImageUploader";
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
import { Textarea } from "@/components/ui/textarea";
import { useAddDivisionMutation } from "@/redux/features/division/division.api";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type TourTypeForm = {
  name: string;
  description: string;
};

const AddDivisionModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const form = useForm<TourTypeForm>();

  const [addDivision, { isLoading }] = useAddDivisionMutation();

  const onSubmit: SubmitHandler<TourTypeForm> = async (data) => {
    const toastId = toast.loading("adding division....");
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(data));
      formData.append("file", image as File);
      const res = await addDivision(formData);
      console.log(res);
      if (!(res.error as any)?.data?.success) {
        toast.error("Failed to add division", { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(`${res?.data?.message}`, { id: toastId });
        setOpen(false);
        form.reset();
      }
    } catch (error: any) {
      console.log(error);
      console.log(error?.data?.errorSources[0]?.message);
      toast.error(`${error?.data?.errorSources[0]?.message}`, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Division</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Division</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="add-division" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "division is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 mb-2">Division Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. chattogram"
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
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 mb-2">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="description...."
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
          <SingleImageUploader setImage={setImage} />
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={!image || isLoading}
            form="add-division"
            type="submit"
          >
            {isLoading ? (
              <>
                <span>submitting </span>
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
    </Dialog>
  );
};

export default AddDivisionModal;
