import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { ImageUploadField, type ImageFieldState } from "../ImageUploadField";
import type { GuideFormValues } from "../types";

interface Props {
  form: UseFormReturn<GuideFormValues>;
  isReapplyMode: boolean;
  profileImage: ImageFieldState;
  nidFrontImage: ImageFieldState;
  nidBackImage: ImageFieldState;
  licenseImage: ImageFieldState;
}

export function StepDocuments({
  form,
  isReapplyMode,
  profileImage,
  nidFrontImage,
  nidBackImage,
  licenseImage,
}: Props) {
  return (
    <FieldSet>
      <FieldLegend className="mb-8 text-purple-500 dark:text-purple-400">Documents</FieldLegend>

      <Field>
        <FieldLabel>License Number (optional)</FieldLabel>
        <Input placeholder="Enter your license number" {...form.register("licenseNumber")} />
      </Field>

      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ImageUploadField
          label="Profile Photo"
          uploadHint="Upload profile photo (JPG/PNG, max 5MB)."
          imageState={profileImage}
          alt="Profile preview"
          required
          isReapplyMode={isReapplyMode}
        />

        <ImageUploadField
          label="NID Front Photo"
          uploadHint="Upload NID front side (JPG/PNG, max 5MB)."
          imageState={nidFrontImage}
          alt="NID front preview"
          required
          isReapplyMode={isReapplyMode}
        />

        <ImageUploadField
          label="NID Back Photo"
          uploadHint="Upload NID back side (JPG/PNG, max 5MB)."
          imageState={nidBackImage}
          alt="NID back preview"
          required
          isReapplyMode={isReapplyMode}
        />

        <ImageUploadField
          label={
            <>
              License Photo{" "}
              <span className="text-zinc-400 text-xs font-normal">(optional)</span>
              {isReapplyMode && licenseImage.existingUrl && (
                <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                  (previous image loaded)
                </span>
              )}
            </>
          }
          uploadHint="Upload license image (JPG/PNG, max 5MB)."
          imageState={licenseImage}
          alt="License preview"
        />
      </FieldGroup>
    </FieldSet>
  );
}
