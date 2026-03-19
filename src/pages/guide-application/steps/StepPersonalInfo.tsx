import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { GuideFormValues } from "../types";

interface Props {
  form: UseFormReturn<GuideFormValues>;
}

export function StepPersonalInfo({ form }: Props) {
  return (
    <FieldSet>
      <FieldLegend className="mb-8 text-purple-500 dark:text-purple-400">Personal Information</FieldLegend>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field data-invalid={!!form.formState.errors.dateOfBirth}>
          <FieldLabel>Date of Birth</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("dateOfBirth") && "text-muted-foreground",
                )}
                aria-invalid={!!form.formState.errors.dateOfBirth}
              >
                {form.watch("dateOfBirth")
                  ? format(new Date(form.watch("dateOfBirth")), "PPP")
                  : "Pick your date of birth"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch("dateOfBirth") ? new Date(form.watch("dateOfBirth")) : undefined}
                onSelect={(date) => {
                  if (!date) return;
                  form.setValue("dateOfBirth", format(date, "yyyy-MM-dd"), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                captionLayout="dropdown"
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
          <FieldError>{form.formState.errors.dateOfBirth?.message}</FieldError>
        </Field>

        <Field data-invalid={!!form.formState.errors.gender}>
          <FieldLabel>Gender</FieldLabel>
          <Select
            value={form.watch("gender")}
            onValueChange={(value) =>
              form.setValue("gender", value as GuideFormValues["gender"], {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.gender}>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>{form.formState.errors.gender?.message}</FieldError>
        </Field>

        <Field data-invalid={!!form.formState.errors.phone}>
          <FieldLabel>Phone</FieldLabel>
          <Input
            placeholder="Enter your phone number"
            aria-invalid={!!form.formState.errors.phone}
            {...form.register("phone")}
          />
          <FieldError>{form.formState.errors.phone?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Alternate Phone (optional)</FieldLabel>
          <Input placeholder="Enter alternate phone number" {...form.register("alternatePhone")} />
        </Field>
      </FieldGroup>

      <Field data-invalid={!!form.formState.errors.presentAddress}>
        <FieldLabel>Present Address</FieldLabel>
        <Textarea
          rows={3}
          placeholder="Enter your present address"
          aria-invalid={!!form.formState.errors.presentAddress}
          {...form.register("presentAddress")}
        />
        <FieldError>{form.formState.errors.presentAddress?.message}</FieldError>
      </Field>

      <Field data-invalid={!!form.formState.errors.permanentAddress}>
        <FieldLabel>Permanent Address</FieldLabel>
        <Textarea
          rows={3}
          placeholder="Enter your permanent address"
          aria-invalid={!!form.formState.errors.permanentAddress}
          {...form.register("permanentAddress")}
        />
        <FieldError>{form.formState.errors.permanentAddress?.message}</FieldError>
      </Field>
    </FieldSet>
  );
}
