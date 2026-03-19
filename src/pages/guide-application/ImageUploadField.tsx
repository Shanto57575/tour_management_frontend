import type { Dispatch, SetStateAction } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { selectFile, clearImagePreview } from "./utils";

export interface ImageFieldState {
  preview: string | null;
  existingUrl: string | null;
  setFile: (value: File | null) => void;
  setPreview: Dispatch<SetStateAction<string | null>>;
  setExistingUrl: (url: string | null) => void;
}

interface ImageUploadFieldProps {
  label: React.ReactNode;
  uploadHint: string;
  imageState: ImageFieldState;
  alt: string;
  required?: boolean;
  isReapplyMode?: boolean;
}

export function ImageUploadField({
  label,
  uploadHint,
  imageState,
  alt,
  required,
  isReapplyMode,
}: ImageUploadFieldProps) {
  const { preview, existingUrl, setFile, setPreview, setExistingUrl } = imageState;
  const hasImage = Boolean(preview || existingUrl);

  return (
    <Field>
      <FieldLabel>{label}{required && <span className="text-rose-500"> *</span>}</FieldLabel>
      <div className="relative border-2 border-dashed rounded-xl p-4 text-center bg-muted/30 border-border hover:border-primary/50 transition-colors">
        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <Input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => selectFile(e.target.files?.[0], setFile, setPreview)}
        />
        <FieldDescription>{hasImage ? "Click to replace image" : uploadHint}</FieldDescription>
      </div>
      {hasImage ? (
        <div className="relative mt-2">
          <img
            src={preview ?? existingUrl!}
            alt={alt}
            className="h-40 w-full object-cover rounded-md border border-border"
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => {
              if (preview) {
                clearImagePreview(preview, setFile, setPreview);
              } else {
                setExistingUrl(null);
              }
            }}
            aria-label={`Remove ${alt}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : required && isReapplyMode ? (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
          ⚠ Previous image not available — please upload a new one.
        </p>
      ) : null}
    </Field>
  );
}
