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
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsByDivisionQuery } from "@/redux/features/district/district.api";
import { useGetAvailableGuidesQuery } from "@/redux/features/guide/guide.api";
import {
  useGetTourTypesQuery,
  useEditTourMutation,
} from "@/redux/features/tour/tour.api";
import type { ITour, ITourEntityRef, ITourPlan } from "@/types/tour.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import { format, formatISO, startOfDay } from "date-fns";
import { CalendarIcon, Plus, Trash2, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import z from "zod";

const listItemSchema = z.object({ value: z.string() });
const tourPlanItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  meals: z.string().optional(),
});

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title should not exceed 50 characters"),
  description: z.string().min(1, "Description is required"),
  pricePerPerson: z.string().min(1, "Price per person is required"),
  discount: z.string(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((value) => Boolean(value.from && value.to), {
      message: "Date range is required",
    }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(listItemSchema),
  excluded: z.array(listItemSchema),
  amenities: z.array(listItemSchema),
  languages: z.array(listItemSchema),
  tourPlan: z.array(tourPlanItemSchema),
  maxGuest: z.string().min(1, "Max guest is required"),
  minAge: z.string().min(1, "Minimum age is required"),
  durationDays: z.string().optional(),
  durationNights: z.string().optional(),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  destination: z.string().min(1, "Destination is required"),
  tourType: z.string().min(1, "Tour type is required"),
  groupType: z.enum(["private", "group", "both"]),
  difficulty: z.enum(["easy", "moderate", "hard"]),
  cancellationPolicy: z.string().optional(),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  status: z.enum(["active", "inactive"]),
  guide: z.string().optional(),
});

type OptionItem = { value: string; label: string };
type GuideUserOption = { _id: string; name?: string; email?: string };

type EditTourProps = {
  tour: ITour;
  children?: React.ReactNode;
};

const normalizeList = (items: { value: string }[]) =>
  items.map((item) => item.value.trim()).filter(Boolean);

const getEntityId = (value?: string | ITourEntityRef) => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

const mapPlanItems = (plans?: ITourPlan[]) => {
  if (!plans || plans.length === 0) {
    return [{ title: "", description: "", meals: "" }];
  }

  return plans.map((item) => ({
    title: item.title || "",
    description: item.description || "",
    meals: (item.meals || []).join(", "),
  }));
};

const normalizeImageUrls = (images?: Array<string | null | undefined>) =>
  (images || []).filter(
    (img): img is string => typeof img === "string" && img.trim().length > 0,
  );

const getGuideUserOption = (value: unknown): GuideUserOption | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate._id !== "string") {
    return null;
  }

  return {
    _id: candidate._id,
    name: typeof candidate.name === "string" ? candidate.name : undefined,
    email: typeof candidate.email === "string" ? candidate.email : undefined,
  };
};

const getFirstErrorField = (errors: Record<string, unknown>, parent = ""): string | null => {
  for (const key of Object.keys(errors)) {
    const value = errors[key] as Record<string, unknown> | undefined;
    const fieldPath = parent ? `${parent}.${key}` : key;

    if (!value) continue;

    if (typeof value === "object" && ("message" in value || "type" in value)) {
      return fieldPath;
    }

    if (typeof value === "object") {
      const nested = getFirstErrorField(value, fieldPath);
      if (nested) return nested;
    }
  }

  return null;
};

const getFormDefaults = (tour: ITour) => ({
  title: tour.title || "",
  description: tour.description || "",
  pricePerPerson: String(tour.pricePerPerson || tour.costFrom || ""),
  discount: String(tour.discount || 0),
  dateRange: {
    from: tour.startDate ? new Date(tour.startDate) : undefined,
    to: tour.endDate ? new Date(tour.endDate) : undefined,
  },
  departureLocation: tour.departureLocation || "",
  arrivalLocation: tour.arrivalLocation || "",
  included:
    tour.included && tour.included.length > 0
      ? tour.included.map((value) => ({ value }))
      : [{ value: "" }],
  excluded:
    tour.excluded && tour.excluded.length > 0
      ? tour.excluded.map((value) => ({ value }))
      : [{ value: "" }],
  amenities:
    tour.amenities && tour.amenities.length > 0
      ? tour.amenities.map((value) => ({ value }))
      : [{ value: "" }],
  languages:
    tour.languages && tour.languages.length > 0
      ? tour.languages.map((value) => ({ value }))
      : [{ value: "English" }],
  tourPlan: mapPlanItems(tour.tourPlan),
  maxGuest: String(tour.maxGuest ?? ""),
  minAge: String(tour.minAge ?? ""),
  durationDays: String(tour.durationDays ?? ""),
  durationNights: String(tour.durationNights ?? ""),
  division: getEntityId(tour.division),
  district: getEntityId(tour.district),
  destination: getEntityId(tour.destination),
  tourType: getEntityId(tour.tourType),
  groupType: tour.groupType || "group",
  difficulty: tour.difficulty || "easy",
  cancellationPolicy: tour.cancellationPolicy || "",
  isFeatured: Boolean(tour.isFeatured),
  isTrending: Boolean(tour.isTrending),
  status: tour.status || "active",
  guide: "",
});

export const EditTour = ({ tour, children }: EditTourProps) => {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [todayStart] = useState(() => startOfDay(new Date()));

  const { data: divisionData, isLoading: divisionLoading } =
    useGetAllDivisionsQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);
  const [editTour, { isLoading }] = useEditTourMutation();

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaults(tour),
  });

  const selectedDivision = form.watch("division");
  const selectedDistrict = form.watch("district");

  const { data: districtData = [] } = useGetDistrictsByDivisionQuery(
    selectedDivision ? { division: selectedDivision } : skipToken,
  );

  const { data: destinationResponse } = useGetAllDestinationsQuery(
    selectedDivision ? { division: selectedDivision, limit: 1000 } : skipToken,
  );

  const { data: availableGuidesData } = useGetAvailableGuidesQuery(
    selectedDivision
      ? { division: selectedDivision, district: selectedDistrict || undefined }
      : skipToken,
  );

  const currentGuide = tour.guide as ({ _id: string; name?: string; email?: string } | string) | undefined;

  useEffect(() => {
    form.reset(getFormDefaults(tour));
  }, [tour, form]);

  useEffect(() => {
    const cleanedImages = normalizeImageUrls(
      tour.images as Array<string | null | undefined>,
    );

    if (cleanedImages.length > 0) {
      setPreviewImages(cleanedImages);
    } else {
      setPreviewImages([]);
    }

    setRemovedExistingImages([]);
  }, [tour.images]);

  useEffect(() => {
    if (!open) return;

    setImages([]);
    setPreviewImages(
      normalizeImageUrls(tour.images as Array<string | null | undefined>),
    );
    setRemovedExistingImages([]);
    form.reset(getFormDefaults(tour));
  }, [open, tour, form]);

  const divisionOptions = divisionData?.division?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    }),
  );

  const districtOptions = districtData.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const destinationOptions = destinationResponse?.destinations?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const tourTypeOptions = tourTypeData?.map(
    (tourType: { _id: string; name: string }) => ({
      value: tourType._id,
      label: tourType.name,
    }),
  );

  const {
    fields: includedFields,
    append: appendIncluded,
    remove: removeIncluded,
  } = useFieldArray({ control: form.control, name: "included" });

  const {
    fields: excludedFields,
    append: appendExcluded,
    remove: removeExcluded,
  } = useFieldArray({ control: form.control, name: "excluded" });

  const {
    fields: amenitiesFields,
    append: appendAmenities,
    remove: removeAmenities,
  } = useFieldArray({ control: form.control, name: "amenities" });

  const {
    fields: languagesFields,
    append: appendLanguages,
    remove: removeLanguages,
  } = useFieldArray({ control: form.control, name: "languages" });

  const {
    fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan,
  } = useFieldArray({ control: form.control, name: "tourPlan" });

  const handleSubmit = async (data: any) => {
    const toastId = toast.loading("Updating tour...");
    const validRemovedImages = removedExistingImages.filter(
      (img): img is string => typeof img === "string" && img.trim().length > 0,
    );

    if (!data.dateRange?.from || !data.dateRange?.to) {
      toast.error("Please select a valid date range", { id: toastId });
      return;
    }

    const tourData = {
      title: data.title.trim(),
      description: data.description.trim(),
      pricePerPerson: Number(data.pricePerPerson),
      discount: Number(data.discount || 0),
      startDate: formatISO(data.dateRange.from),
      endDate: formatISO(data.dateRange.to),
      departureLocation: data.departureLocation.trim(),
      arrivalLocation: data.arrivalLocation.trim(),
      included: normalizeList(data.included),
      excluded: normalizeList(data.excluded),
      amenities: normalizeList(data.amenities),
      languages: normalizeList(data.languages),
      tourPlan: data.tourPlan
        .map((item: { title: string; description?: string; meals?: string }, index: number) => ({
          day: index + 1,
          title: item.title.trim(),
          description: item.description?.trim() || "",
          meals: (item.meals || "")
            .split(",")
            .map((meal: string) => meal.trim())
            .filter(Boolean),
        }))
        .filter((item: { title: string }) => item.title),
      maxGuest: Number(data.maxGuest),
      minAge: Number(data.minAge),
      durationDays: data.durationDays ? Number(data.durationDays) : undefined,
      durationNights: data.durationNights ? Number(data.durationNights) : undefined,
      division: data.division,
      district: data.district,
      destination: data.destination,
      tourType: data.tourType,
      ...(data.guide === "UNASSIGN" ? { guide: null } : data.guide ? { guide: data.guide } : {}),
      groupType: data.groupType,
      difficulty: data.difficulty,
      cancellationPolicy: data.cancellationPolicy?.trim() || undefined,
      isFeatured: data.isFeatured,
      isTrending: data.isTrending,
      status: data.status,
      deleteImages: validRemovedImages.length > 0 ? validRemovedImages : undefined,
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
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const handleInvalidSubmit = (errors: Record<string, unknown>) => {
    const firstError = getFirstErrorField(errors);

    if (!firstError) return;

    const scrollToField = (fieldPath: string) => {
      const baseField = fieldPath.split(".")[0];
      const target =
        (document.querySelector(`[name="${fieldPath}"]`) as HTMLElement | null) ||
        (document.querySelector(`[name="${baseField}"]`) as HTMLElement | null) ||
        (document.querySelector(`[data-field="${baseField}"]`) as HTMLElement | null) ||
        (document.querySelector('[aria-invalid="true"]') as HTMLElement | null);

      if (!target) return false;

      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof target.focus === "function") {
        target.focus({ preventScroll: true });
      }

      return true;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const didScroll = scrollToField(firstError);
        if (!didScroll) {
          scrollToField(firstError.split(".")[0]);
        }
      });
    });
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setPreviewImages((prev) => prev.filter((url) => url !== imageUrl));
    setRemovedExistingImages((prev) =>
      prev.includes(imageUrl) ? prev : [...prev, imageUrl],
    );
  };

  const renderStringArraySection = (
    fields: any[],
    name: "included" | "excluded" | "amenities" | "languages",
    label: string,
    append: (value: { value: string }) => void,
    remove: (index: number) => void,
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
        <DialogTitle className="sr-only">New</DialogTitle>
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
                onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
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
                    name="pricePerPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Per Person</FormLabel>
                        <FormControl>
                          <Input min={0} step={1} placeholder="Price in BDT" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input min={0} max={100} placeholder="0" type="number" {...field} />
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
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("district", "");
                            form.setValue("destination", "");
                            form.setValue("guide", "");
                          }}
                          disabled={divisionLoading}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisionOptions?.map((item: OptionItem) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedDivision}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districtOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
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
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedDivision}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {destinationOptions?.map((item: OptionItem) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
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
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tour type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tourTypeOptions?.map((option: OptionItem) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Guide Assignment */}
                <div className="rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      Guide Assignment
                    </p>
                    {currentGuide && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Current:{" "}
                          <span className="font-medium text-zinc-700 dark:text-zinc-200">
                            {typeof currentGuide === "object" ? currentGuide.name ?? currentGuide.email ?? currentGuide._id : currentGuide}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                          onClick={() => form.setValue("guide", "UNASSIGN")}
                        >
                          Unassign
                        </button>
                      </div>
                    )}
                  </div>
                  {form.watch("guide") === "UNASSIGN" && (
                    <p className="text-xs text-rose-600 dark:text-rose-400">
                      Guide will be unassigned on save.{" "}
                      <button type="button" className="underline" onClick={() => form.setValue("guide", "")}>Undo</button>
                    </p>
                  )}
                  <FormField
                    control={form.control}
                    name="guide"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value === "UNASSIGN" ? "UNASSIGN" : (field.value || "")}
                          onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                          disabled={!selectedDivision || field.value === "UNASSIGN"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={selectedDivision ? "Assign a different guide" : "Select division first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">— Keep current / No guide —</SelectItem>
                            {(availableGuidesData?.data ?? []).map((g) => {
                              const user = getGuideUserOption(g?.user);
                              const app = g.application as { specializations?: string[]; experienceYears?: number } | null;
                              return (
                                <SelectItem key={String(g._id)} value={user?._id ?? String(g._id)}>
                                  {user?.name ?? "Unknown"} — ★ {Number(g.avgRating ?? 0).toFixed(1)}
                                  {app?.specializations?.length ? ` · ${app.specializations.slice(0, 2).join(", ")}` : ""}
                                </SelectItem>
                              );
                            })}
                            {selectedDivision && (availableGuidesData?.data ?? []).length === 0 && (
                              <div className="px-4 py-2 text-sm text-muted-foreground">No available guides for this area</div>
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
                            min={1}
                            step={1}
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
                            min={0}
                            step={1}
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
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration Days</FormLabel>
                        <FormControl>
                          <Input min={1} step={1} type="number" placeholder="e.g. 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationNights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration Nights</FormLabel>
                        <FormControl>
                          <Input min={0} step={1} type="number" placeholder="e.g. 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col" data-field="dateRange">
                      <FormLabel>Tour Date Range</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start px-3 text-left font-normal",
                                !field.value?.from && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            defaultMonth={field.value?.from}
                            initialFocus
                            selected={field.value as DateRange | undefined}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                            disabled={(date) => date < todayStart}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select group type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="group">Group</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(value === "true")}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Featured" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="false">No</SelectItem>
                            <SelectItem value="true">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isTrending"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trending</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(value === "true")}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Trending" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="false">No</SelectItem>
                            <SelectItem value="true">Yes</SelectItem>
                          </SelectContent>
                        </Select>
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

                <FormField
                  control={form.control}
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Policy</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div>
                    <FormLabel>Tour Images</FormLabel>
                    {previewImages.length > 0 && (
                      <div className="my-4 p-4 border border-dashed rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium">
                            Current Images ({previewImages.length})
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          {previewImages.map((img, idx) => (
                            <div
                              key={`${img}-${idx}`}
                              className="relative aspect-square rounded-md overflow-hidden border"
                            >
                              <img
                                src={img}
                                alt={`Current ${idx}`}
                                className="size-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingImage(img)}
                                className="cursor-pointer absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-500"
                                aria-label="Remove existing image"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          You can remove existing images or add new ones below
                        </p>
                      </div>
                    )}

                    <MultipleImageUploader setImages={setImages} />
                  </div>
                </div>

                <div className="border-t pt-5" />

                {renderStringArraySection(
                  languagesFields,
                  "languages",
                  "Languages",
                  appendLanguages,
                  removeLanguages,
                )}

                {renderStringArraySection(
                  includedFields,
                  "included",
                  "Included",
                  appendIncluded,
                  removeIncluded,
                )}

                {renderStringArraySection(
                  excludedFields,
                  "excluded",
                  "Excluded",
                  appendExcluded,
                  removeExcluded,
                )}

                {renderStringArraySection(
                  amenitiesFields,
                  "amenities",
                  "Amenities",
                  appendAmenities,
                  removeAmenities,
                )}

                <div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Tour Plan</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => appendTourPlan({ title: "", description: "", meals: "" })}
                    >
                      <Plus />
                    </Button>
                  </div>

                  <div className="space-y-4 mt-4">
                    {tourPlanFields.map((item, index) => (
                      <div key={item.id} className="rounded-xl border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Day {index + 1}</p>
                          <Button
                            onClick={() => removeTourPlan(index)}
                            variant="destructive"
                            size="icon"
                            type="button"
                          >
                            <Trash2 />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`tourPlan.${index}.title` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Day title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tourPlan.${index}.description` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="What happens this day?" rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tourPlan.${index}.meals` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meals</FormLabel>
                              <FormControl>
                                <Input placeholder="breakfast, lunch, dinner" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit" form="edit-tour-form" className="cursor-pointer">
              {isLoading ? "Updating..." : "Update Tour"}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};