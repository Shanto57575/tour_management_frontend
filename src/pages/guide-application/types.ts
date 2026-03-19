import { z } from "zod";

export const specializationOptions = [
  "historical",
  "adventure",
  "eco-tourism",
  "heritage",
  "religious",
  "beach",
  "hill-trekking",
  "city-tour",
  "wildlife",
  "food-tourism",
] as const;

export type GuideSpecialization = (typeof specializationOptions)[number];

export interface IDivisionOption {
  _id: string;
  name: string;
}

export interface IDistrictOption {
  _id: string;
  name: string;
}

export const guideFormSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { message: "Gender is required" }),
  phone: z.string().min(5, "Phone is required"),
  alternatePhone: z.string().optional(),
  presentAddress: z.string().min(2, "Present address is required"),
  permanentAddress: z.string().min(2, "Permanent address is required"),
  nidNumber: z.string().min(5, "NID number is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  operatingAreas: z.string().optional(),
  languages: z.string().min(1, "At least one language is required"),
  experienceYears: z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
    z.number().min(0, "Experience cannot be negative").optional(),
  ),
  specializations: z.array(z.enum(specializationOptions)).optional(),
  bio: z.string().max(1000, "Bio must be at most 1000 characters").optional(),
  licenseNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankBranchName: z.string().optional(),
  bkashNumber: z.string().optional(),
  nagadNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
});

export type GuideFormValues = z.infer<typeof guideFormSchema>;

export interface RejectedHistoryEntry {
  id: string;
  reason: string;
  changedAt: string | undefined;
  changedBy: string;
}
