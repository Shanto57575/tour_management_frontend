import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { specializationOptions, type GuideFormValues } from "../types";

interface Props {
  form: UseFormReturn<GuideFormValues>;
}

export function StepProfessionalInfo({ form }: Props) {
  const selectedSpecializations = form.watch("specializations") || [];

  const toggleSpecialization = (value: (typeof specializationOptions)[number]) => {
    const current = form.getValues("specializations") || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    form.setValue("specializations", updated, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <FieldSet>
      <FieldLegend className="mb-8 text-purple-500 dark:text-purple-400">Professional Information</FieldLegend>

      <Field data-invalid={!!form.formState.errors.languages}>
        <FieldLabel>Languages</FieldLabel>
        <Input
          placeholder="e.g. Bangla, English, Hindi"
          aria-invalid={!!form.formState.errors.languages}
          {...form.register("languages")}
        />
        <FieldDescription>Separate multiple languages with commas.</FieldDescription>
        <FieldError>{form.formState.errors.languages?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Experience (Years, optional)</FieldLabel>
        <Input type="number" min={0} placeholder="e.g. 4" {...form.register("experienceYears")} />
      </Field>

      <Field>
        <FieldLabel>Specializations (optional)</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {specializationOptions.map((item) => {
            const selected = selectedSpecializations.includes(item);
            return (
              <Button
                type="button"
                key={item}
                variant={selected ? "default" : "outline"}
                onClick={() => toggleSpecialization(item)}
                className={cn(
                  "h-9 px-3 rounded-full text-xs capitalize",
                  selected && "bg-primary text-primary-foreground",
                )}
              >
                {item}
              </Button>
            );
          })}
        </div>
        <FieldDescription>Select all categories that match your expertise.</FieldDescription>
      </Field>

      <Field data-invalid={!!form.formState.errors.bio}>
        <FieldLabel>Bio (optional)</FieldLabel>
        <Textarea
          rows={4}
          placeholder="Write a short professional intro"
          aria-invalid={!!form.formState.errors.bio}
          {...form.register("bio")}
        />
        <FieldError>{form.formState.errors.bio?.message}</FieldError>
      </Field>
    </FieldSet>
  );
}
