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
import { useUpdateDivisionMutation } from "@/redux/features/division/division.api";
import { EditIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type DivisionForm = {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
};

const EditDivisionModal = ({
  divisionData,
}: {
  divisionData: DivisionForm;
}) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const form = useForm<DivisionForm>({
    defaultValues: divisionData,
  });

  useEffect(() => {
    form.reset(divisionData);
  }, [divisionData, form]);

  const [updateDivision, { isLoading }] = useUpdateDivisionMutation();

  const onSubmit: SubmitHandler<DivisionForm> = async (data) => {
    const toastId = toast.loading("updating division....");
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(data));
      if (image instanceof File) {
        formData.append("file", image);
      }
      const res = await updateDivision({
        divisionData: formData,
        divisionId: divisionData._id,
      });

      if (res && "error" in res && res.error) {
        const err = res.error as any;
        const errMessage =
          err?.data?.errorSources?.[0]?.message ??
          err?.data?.message ??
          err?.message ??
          "Failed to update division";
        toast.error(errMessage, { id: toastId });
      }

      if (res && "data" in res && res.data?.success) {
        toast.success(`${res.data.message}`, { id: toastId });
        setImage(null);
        setOpen(false);
        form.reset();
      }
    } catch (error: any) {
      console.log("error==>", error);
      console.log(error?.data?.errorSources[0]?.message);
      toast.error(`${error?.data?.errorSources[0]?.message}`, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <EditIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Division data</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="edit-division" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "division is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 mb-2">Division Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. chittagong"
                      type="text"
                      {...field}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 mb-2">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description...." {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <SingleImageUploader
            setImage={setImage}
            initialImage={divisionData.thumbnail || null}
            isLoading={isLoading}
          />
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isLoading} form="edit-division" type="submit">
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
    </Dialog>
  );
};

export default EditDivisionModal;
