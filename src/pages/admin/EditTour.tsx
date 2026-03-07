/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import {
  useGetTourTypesQuery,
  useEditTourMutation,
} from "@/redux/features/tour/tour.api";
import type { ITour } from "@/types/tour.type";
import type { IErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.string().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.string().min(1, "Max guest is required"),
  minAge: z.string().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

type EditTourProps = {
  tour: ITour;
  children?: React.ReactNode;
};

export const EditTour = ({ tour, children }: EditTourProps) => {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const { data: divisionData, isLoading: divisionLoading } =
    useGetAllDivisionsQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);
  const [editTour, { isLoading }] = useEditTourMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: tour.title || "",
      description: tour.description || "",
      location: tour.location || "",
      costFrom: String(tour.costFrom || ""),
      startDate: tour.startDate ? new Date(tour.startDate) : undefined,
      endDate: tour.endDate ? new Date(tour.endDate) : undefined,
      departureLocation: tour.departureLocation || "",
      arrivalLocation: tour.arrivalLocation || "",
      included:
        tour.included?.length > 0
          ? tour.included.map((v) => ({ value: v }))
          : [{ value: "" }],
      excluded:
        tour.excluded?.length > 0
          ? tour.excluded.map((v) => ({ value: v }))
          : [{ value: "" }],
      amenities:
        tour.amenities?.length > 0
          ? tour.amenities.map((v) => ({ value: v }))
          : [{ value: "" }],
      tourPlan:
        tour.tourPlan?.length > 0
          ? tour.tourPlan.map((v) => ({ value: v }))
          : [{ value: "" }],
      maxGuest: String(tour.maxGuest ?? ""),
      minAge: String(tour.minAge ?? ""),
      division: tour.division || "",
      tourType: tour.tourType || "",
    },
  });

  const {
    fields: includedFields,
    append: appendIncluded,
    remove: removeIncluded,
  } = useFieldArray({
    control: form.control,
    name: "included",
  });

  const {
    fields: excludedFields,
    append: appendExcluded,
    remove: removeExcluded,
  } = useFieldArray({
    control: form.control,
    name: "excluded",
  });

  const {
    fields: amenitiesFields,
    append: appendAmenities,
    remove: removeAmenities,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan,
  } = useFieldArray({
    control: form.control,
    name: "tourPlan",
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Updating tour...");

    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      minAge: Number(data.minAge),
      maxGuest: Number(data.maxGuest),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included:
        data.included[0].value === ""
          ? []
          : data.included.map((item) => item.value),
      excluded:
        data.excluded[0].value === ""
          ? []
          : data.excluded.map((item) => item.value),
      amenities:
        data.amenities[0].value === ""
          ? []
          : data.amenities.map((item) => item.value),
      tourPlan:
        data.tourPlan[0].value === ""
          ? []
          : data.tourPlan.map((item) => item.value),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => {
      if (image instanceof File) formData.append("files", image);
    });

    try {
      const res = await editTour({
        tourId: tour._id,
        tourInfo: formData,
      }).unwrap();
      if (res.success) {
        toast.success("Tour updated successfully", { id: toastId });
        setOpen(false);
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as IErrorResponse).message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const divisionOptions = divisionData?.division?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })
  );

  const tourTypeOptions = tourTypeData?.map(
    (tourType: { _id: string; name: string }) => ({
      value: tourType._id,
      label: tourType.name,
    })
  );

  useEffect(() => {
    if (tour.images && tour.images.length > 0) {
      setPreviewImages(tour.images);
    }
  }, [tour.images]);

  const renderDynamicField = (
    fields: any[],
    name: string,
    label: string,
    append: (value: any) => void,
    remove: (index: number) => void
  ) => (
    <div>
      <div className="flex justify-between items-center">
        <p className="font-semibold">{label}</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => append({ value: "" })}
        >
          <Plus />
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {fields.map((item, index) => (
          <div className="flex gap-2 flex-col sm:flex-row" key={item.id}>
            <FormField
              control={form.control}
              name={`${name}.${index}.value` as any}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={() => remove(index)}
              variant="destructive"
              size="icon"
              type="button"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="outline">
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl sm:max-w-4xl max-h-[90vh] overflow-auto p-0">
        <Card className="rounded-2xl overflow-hidden shadow-sm border-0">
          <CardHeader className="pt-6 pb-4 px-6">
            <CardTitle>Edit Tour</CardTitle>
            <CardDescription>Update tour information</CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-4">
            <Form {...form}>
              <form
                id="edit-tour-form"
                className="space-y-5"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tour Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Tour Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost (BDT)</FormLabel>
                        <FormControl>
                          <Input placeholder="Cost (BDT)" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="departureLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Departure Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="arrivalLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Arrival Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={divisionLoading}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisionOptions?.map(
                              (item: { label: string; value: string }) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tourType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tour Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tour type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tourTypeOptions?.map(
                              (option: { value: string; label: string }) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="maxGuest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guest</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Maximum guests"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Minimum age"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div>
                    <FormLabel>Tour Images</FormLabel>
                    {images.length === 0 && previewImages.length > 0 && (
                      <div className="mb-4 p-4 border border-dashed rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium">
                            Current Images ({previewImages.length})
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          {previewImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-md overflow-hidden border"
                            >
                              <img
                                src={img}
                                alt={`Current ${idx}`}
                                className="size-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Upload new images below to replace these
                        </p>
                      </div>
                    )}

                    <MultipleImageUploader setImages={setImages} />
                  </div>
                </div>

                <div className="border-t pt-5" />

                {renderDynamicField(
                  includedFields,
                  "included",
                  "Included",
                  appendIncluded,
                  removeIncluded
                )}

                {renderDynamicField(
                  excludedFields,
                  "excluded",
                  "Excluded",
                  appendExcluded,
                  removeExcluded
                )}

                {renderDynamicField(
                  amenitiesFields,
                  "amenities",
                  "Amenities",
                  appendAmenities,
                  removeAmenities
                )}

                {renderDynamicField(
                  tourPlanFields,
                  "tourPlan",
                  "Tour Plan",
                  appendTourPlan,
                  removeTourPlan
                )}
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit" form="edit-tour-form">
              {isLoading ? "Updating..." : "Update Tour"}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
