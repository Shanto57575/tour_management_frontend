import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import type { IGuideApplication } from "@/redux/features/guide/guide.api";
import type { RejectedHistoryEntry } from "./types";

export const parseCsvToArray = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const findLatestRejectedReason = (application: IGuideApplication) => {
  const history = application.statusHistory || [];
  const rejectedEntry = [...history].reverse().find((item) => item.status === "REJECTED");
  return rejectedEntry?.reason || "No specific feedback provided.";
};

export const getStatusChangedByDisplay = (
  changedBy: IGuideApplication["statusHistory"][number]["changedBy"],
) => {
  if (typeof changedBy === "string") return changedBy;
  if (changedBy?.name) return changedBy.name;
  if (changedBy?.email) return changedBy.email;
  return changedBy?._id || "Unknown";
};

export const getRejectedHistoryEntries = (application: IGuideApplication): RejectedHistoryEntry[] => {
  return (application.statusHistory || [])
    .filter((item) => item.status === "REJECTED")
    .map((item, index) => ({
      id: `${application._id}-reject-${index}`,
      reason: item.reason?.trim() || "No specific feedback provided.",
      changedAt: item.changedAt,
      changedBy: getStatusChangedByDisplay(item.changedBy),
    }));
};

export const toSafeTimestamp = (value?: string) => {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const selectFile = (
  file: File | undefined,
  setFile: (value: File | null) => void,
  setPreview: Dispatch<SetStateAction<string | null>>,
) => {
  if (!file) {
    setFile(null);
    setPreview(null);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Each image must be under 5MB");
    return;
  }

  if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    toast.error("Only JPG, JPEG, and PNG images are supported");
    return;
  }

  setPreview((currentPreview) => {
    if (currentPreview && currentPreview.startsWith("blob:")) {
      URL.revokeObjectURL(currentPreview);
    }
    return URL.createObjectURL(file);
  });
  setFile(file);
};

export const clearImagePreview = (
  preview: string | null,
  setFile: (value: File | null) => void,
  setPreview: (value: string | null) => void,
) => {
  if (preview && preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview);
  }
  setFile(null);
  setPreview(null);
};
