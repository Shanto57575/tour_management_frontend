import MultipleImageUploader from "@/components/MultipleImageUploader";
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
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetAllDestinationsQuery } from "@/redux/features/destination/destination.api";
import { useGetAvailableGuidesQuery } from "@/redux/features/guide/guide.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetDistrictsByDivisionQuery } from "@/redux/features/district/district.api";
import {
  useAddTourMutation,
  useGetTourTypesQuery,
} from "@/redux/features/tour/tour.api";
import type { IErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import { format, formatISO, startOfDay } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import type { DateRange } from "react-day-picker";

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

type TourFormValues = z.infer<typeof formSchema>;
type OptionItem = { value: string; label: string };
type GuideUserOption = { _id: string; name?: string; email?: string };

const defaultValues: TourFormValues = {
  title: "",
  description: "",
  pricePerPerson: "",
  discount: "0",
  dateRange: {
    from: undefined,
    to: undefined,
  },
  departureLocation: "",
  arrivalLocation: "",
  included: [{ value: "" }],
  excluded: [{ value: "" }],
  amenities: [{ value: "" }],
  languages: [{ value: "English" }],
  tourPlan: [{ title: "", description: "", meals: "" }],
  maxGuest: "",
  minAge: "",
  durationDays: "",
  durationNights: "",
  division: "",
  district: "",
  destination: "",
  tourType: "",
  groupType: "group",
  difficulty: "easy",
  cancellationPolicy: "",
  isFeatured: false,
  isTrending: false,
  status: "active",
  guide: "",
};

const normalizeList = (items: { value: string }[]) =>
  items.map((item) => item.value.trim()).filter(Boolean);

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

export const AddTour = () => {
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);
  const [todayStart] = useState(() => startOfDay(new Date()));

  const { data: divisionData, isLoading: divisionLoading } =
    useGetAllDivisionsQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);
  const [addTour, { isLoading }] = useAddTourMutation();

  const form = useForm<TourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
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

  const handleSubmit = async (data: TourFormValues) => {
    const toastId = toast.loading("Creating tour...");

    if (images.length === 0) {
      toast.error("Please add some images", { id: toastId });
      return;
    }

    if (!data.dateRange.from || !data.dateRange.to) {
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
        .map((item, index) => ({
          day: index + 1,
          title: item.title.trim(),
          description: item.description?.trim() || "",
          meals: (item.meals || "")
            .split(",")
            .map((meal) => meal.trim())
            .filter(Boolean),
        }))
        .filter((item) => item.title),
      maxGuest: Number(data.maxGuest),
      minAge: Number(data.minAge),
      durationDays: data.durationDays ? Number(data.durationDays) : undefined,
      durationNights: data.durationNights ? Number(data.durationNights) : undefined,
      division: data.division,
      district: data.district,
      destination: data.destination,
      tourType: data.tourType,
      guide: data.guide || undefined,
      groupType: data.groupType,
      difficulty: data.difficulty,
      cancellationPolicy: data.cancellationPolicy?.trim() || undefined,
      isFeatured: data.isFeatured,
      isTrending: data.isTrending,
      status: data.status,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => {
      if (image instanceof File) {
        formData.append("files", image);
      }
    });

    try {
      const res = await addTour(formData).unwrap();

      if (res.success) {
        toast.success("Tour created", { id: toastId });
        form.reset(defaultValues);
        setImages([]);
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (err: unknown) {
      toast.error((err as IErrorResponse).message || "Something went wrong", {
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

  const renderStringArraySection = (
    fields: { id: string }[],
    name: "included" | "excluded" | "amenities" | "languages",
    label: string,
    append: (value: { value: string }) => void,
    remove: (index: number) => void,
  ) => (
    <div>
      <div className="flex justify-between">
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
              name={`${name}.${index}.value`}
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
              className="!bg-red-700"
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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-5 mt-8 md:mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Add New Tour</CardTitle>
          <CardDescription>Add a new tour to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="add-tour-form"
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
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("guide", "");
                        }}
                        disabled={!selectedDivision}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                        <FormControl>
                          <SelectTrigger className="w-full">
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
              <FormField
                control={form.control}
                name="guide"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Assign Guide{" "}
                      <span className="text-xs text-muted-foreground font-normal">(Optional — select division first)</span>
                    </FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                      disabled={!selectedDivision}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={selectedDivision ? "Select an available guide" : "Select a division first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">— No guide —</SelectItem>
                        {(availableGuidesData?.data ?? []).map((g) => {
                          const user = getGuideUserOption(g.user);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="maxGuest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Guest</FormLabel>
                      <FormControl>
                        <Input min={1} step={1} type="number" placeholder="Maximum guests" {...field} />
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
                        <Input min={0} step={1} type="number" placeholder="Minimum age" {...field} />
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
                          autoFocus
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
                      <Textarea placeholder="Description" rows={4} {...field} />
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
                      <Textarea
                        placeholder="e.g. Free cancellation up to 48 hours before departure"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full mt-5">
                <MultipleImageUploader setImages={setImages} />
              </div>

              <div className="border-t border-muted w-full" />

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
                <div className="flex justify-between">
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
                          className="!bg-red-700"
                          size="icon"
                          type="button"
                        >
                          <Trash2 />
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`tourPlan.${index}.title`}
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
                        name={`tourPlan.${index}.description`}
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
                        name={`tourPlan.${index}.meals`}
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
        <CardFooter className="flex justify-end">
          <Button disabled={isLoading} type="submit" form="add-tour-form" className="cursor-pointer">
            {isLoading ? "Creating..." : "Create Tour"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};