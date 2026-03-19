import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import type { GuideFormValues, IDivisionOption, IDistrictOption } from "../types";

interface Props {
  form: UseFormReturn<GuideFormValues>;
  divisions: IDivisionOption[];
  districts: IDistrictOption[];
  isLoadingDivisions: boolean;
  isLoadingDistricts: boolean;
}

export function StepIdentityLocation({
  form,
  divisions,
  districts,
  isLoadingDivisions,
  isLoadingDistricts,
}: Props) {
  const selectedDivision = form.watch("division");

  return (
    <FieldSet>
      <FieldLegend className="mb-8 text-purple-500 dark:text-purple-400">Identity and Location</FieldLegend>
      <Field data-invalid={!!form.formState.errors.nidNumber}>
        <FieldLabel>NID Number</FieldLabel>
        <Input
          placeholder="Enter your NID number"
          aria-invalid={!!form.formState.errors.nidNumber}
          {...form.register("nidNumber")}
        />
        <FieldError>{form.formState.errors.nidNumber?.message}</FieldError>
      </Field>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field data-invalid={!!form.formState.errors.division}>
          <FieldLabel>Division</FieldLabel>
          <Select
            value={form.watch("division")}
            onValueChange={(value) => {
              form.setValue("division", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              form.setValue("district", "", { shouldValidate: true });
            }}
            disabled={isLoadingDivisions}
          >
            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.division}>
              <SelectValue
                placeholder={isLoadingDivisions ? "Loading divisions..." : "Select your division"}
              />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((division) => (
                <SelectItem key={division._id} value={division._id}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{form.formState.errors.division?.message}</FieldError>
        </Field>

        <Field data-invalid={!!form.formState.errors.district}>
          <FieldLabel>District</FieldLabel>
          <Select
            value={form.watch("district")}
            onValueChange={(value) =>
              form.setValue("district", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            disabled={!selectedDivision || isLoadingDistricts}
          >
            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.district}>
              <SelectValue
                placeholder={
                  !selectedDivision
                    ? "Select division first"
                    : isLoadingDistricts
                      ? "Loading districts..."
                      : "Select your district"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district._id} value={district._id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{form.formState.errors.district?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel>Operating Areas (optional)</FieldLabel>
        <Input
          placeholder="e.g. Gulshan, Dhanmondi, Old Dhaka"
          {...form.register("operatingAreas")}
        />
        <FieldDescription>Separate multiple areas with commas.</FieldDescription>
      </Field>
    </FieldSet>
  );
}
