import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import {
  type IDestination,
  useAddDestinationMutation,
  useUpdateDestinationMutation,
} from "@/redux/features/destination/destination.api";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

type TMode = "create" | "update";

interface IProps {
  mode: TMode;
  trigger: ReactNode;
  destination?: IDestination;
}

interface IDivision {
  _id: string;
  name: string;
}

interface IFormState {
  name: string;
  summary: string;
  description: string;
  startingPrice: string;
  duration: string;
  district: string;
  attractions: string;
  bestTimeToVisit: string;
  division: string;
  isFeatured: string;
}

const getInitialState = (destination?: IDestination): IFormState => ({
  name: destination?.name ?? "",
  summary: destination?.summary ?? "",
  description: destination?.description ?? "",
  startingPrice: destination?.startingPrice
    ? String(destination.startingPrice)
    : "",
  duration: destination?.duration ?? "",
  district: destination?.district ?? "",
  attractions: destination?.attractions?.join(", ") ?? "",
  bestTimeToVisit: destination?.bestTimeToVisit ?? "",
  division:
    typeof destination?.division === "string"
      ? destination.division
      : destination?.division?._id ?? "",
  isFeatured: destination?.isFeatured ? "true" : "false",
});

const DestinationFormModal = ({ mode, trigger, destination }: IProps) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<[] | (File | FileMetadata)[]>([]);
  const [deleteImageUrls, setDeleteImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState<IFormState>(getInitialState(destination));

  const [addDestination, { isLoading: isAdding }] = useAddDestinationMutation();
  const [updateDestination, { isLoading: isUpdating }] =
    useUpdateDestinationMutation();
  const { data: divisionsResponse } = useGetAllDivisionsQuery(undefined);

  const isLoading = isAdding || isUpdating;

  const divisions = useMemo(() => {
    if (!divisionsResponse) return [] as IDivision[];

    const response = divisionsResponse as {
      division?: IDivision[];
      data?: { division?: IDivision[] } | IDivision[];
    };

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response?.division ?? response?.data?.division ?? [];
  }, [divisionsResponse]);

  useEffect(() => {
    if (open) {
      setForm(getInitialState(destination));
      setDeleteImageUrls([]);
      setImages([]);
    }
  }, [open, destination]);

  const existingImages = destination?.images ?? [];

  const toggleDeleteImage = (url: string) => {
    setDeleteImageUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url],
    );
  };

  const updateField = (key: keyof IFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Destination name is required");
      return;
    }

    if (!form.division) {
      toast.error("Division is required");
      return;
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      summary: form.summary.trim() || undefined,
      description: form.description.trim() || undefined,
      startingPrice: form.startingPrice ? Number(form.startingPrice) : undefined,
      duration: form.duration.trim() || undefined,
      district: form.district.trim() || undefined,
      attractions: form.attractions
        ? form.attractions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      bestTimeToVisit: form.bestTimeToVisit.trim() || undefined,
      division: form.division,
      isFeatured: form.isFeatured === "true",
    };

    if (mode === "update") {
      payload.deleteImageUrls = deleteImageUrls;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });

    const toastId =
      mode === "create"
        ? toast.loading("Adding destination...")
        : toast.loading("Updating destination...");

    try {
      if (mode === "create") {
        const res = await addDestination(formData).unwrap();
        if (res?.success) {
          toast.success(res.message || "Destination added successfully", {
            id: toastId,
          });
        }
      } else if (destination?._id) {
        const res = await updateDestination({
          destinationId: destination._id,
          destinationData: formData,
        }).unwrap();

        if (res?.success) {
          toast.success(res.message || "Destination updated successfully", {
            id: toastId,
          });
        }
      }

      setOpen(false);
      setImages([]);
      setDeleteImageUrls([]);
    } catch (error: unknown) {
      const err = error as {
        data?: {
          errorSources?: { message?: string }[];
          message?: string;
        };
      };
      const errMessage =
        err?.data?.errorSources?.[0]?.message ??
        err?.data?.message ??
        "Something went wrong";
      toast.error(errMessage, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full lg:min-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Destination" : "Update Destination"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Destination Name</Label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Cox's Bazar"
            />
          </div>

          <div className="space-y-2">
            <Label>Division</Label>
            <Select
              value={form.division}
              onValueChange={(value) => updateField("division", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division._id} value={division._id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Summary</Label>
            <Input
              value={form.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="Short summary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              placeholder="Destination description"
            />
          </div>

          <div className="space-y-2">
            <Label>Starting Price</Label>
            <Input
              type="number"
              min={0}
              value={form.startingPrice}
              onChange={(e) => updateField("startingPrice", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Input
              value={form.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="e.g. 2 days"
            />
          </div>

          <div className="space-y-2">
            <Label>District</Label>
            <Input
              value={form.district}
              onChange={(e) => updateField("district", e.target.value)}
              placeholder="e.g. Bandarban"
            />
          </div>

          <div className="space-y-2">
            <Label>Best Time To Visit</Label>
            <Input
              value={form.bestTimeToVisit}
              onChange={(e) => updateField("bestTimeToVisit", e.target.value)}
              placeholder="e.g. Winter"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Attractions (comma separated)</Label>
            <Input
              value={form.attractions}
              onChange={(e) => updateField("attractions", e.target.value)}
              placeholder="Beach, Hills, Waterfalls"
            />
          </div>

          <div className="space-y-2">
            <Label>Featured</Label>
            <Select
              value={form.isFeatured}
              onValueChange={(value) => updateField("isFeatured", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select featured status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {mode === "update" && existingImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Existing Images</Label>
              <Badge variant="outline">
                Marked for delete: {deleteImageUrls.length}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {existingImages.map((url) => {
                const isMarked = deleteImageUrls.includes(url);
                return (
                  <div
                    key={url}
                    className={`relative rounded-md border overflow-hidden ${
                      isMarked ? "opacity-60 border-destructive" : "border-border"
                    }`}
                  >
                    <img
                      src={url}
                      alt="destination"
                      className="h-24 w-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant={isMarked ? "destructive" : "secondary"}
                      onClick={() => toggleDeleteImage(url)}
                      className="absolute top-2 right-2 h-7 w-7"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>{mode === "create" ? "Upload Images" : "Add New Images"}</Label>
          <MultipleImageUploader setImages={setImages} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span>Please wait</span>
                <LoaderCircleIcon className="animate-spin" size={16} />
              </>
            ) : mode === "create" ? (
              "Add Destination"
            ) : (
              "Update Destination"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationFormModal;
