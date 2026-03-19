import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import type { GuideFormValues } from "../types";

interface Props {
  form: UseFormReturn<GuideFormValues>;
}

export function StepPaymentEmergency({ form }: Props) {
  return (
    <FieldSet>
      <FieldLegend className="mb-8 text-purple-500 dark:text-purple-400">
        Payment and Emergency Contact
      </FieldLegend>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Bank Name (optional)</FieldLabel>
          <Input placeholder="Enter your bank name" {...form.register("bankName")} />
        </Field>
        <Field>
          <FieldLabel>Bank Account Number (optional)</FieldLabel>
          <Input placeholder="Enter your bank account number" {...form.register("bankAccountNumber")} />
        </Field>
        <Field>
          <FieldLabel>Bank Branch Name (optional)</FieldLabel>
          <Input placeholder="Enter your bank branch name" {...form.register("bankBranchName")} />
        </Field>
        <Field>
          <FieldLabel>Bkash Number (optional)</FieldLabel>
          <Input placeholder="Enter your bKash number" {...form.register("bkashNumber")} />
        </Field>
        <Field>
          <FieldLabel>Nagad Number (optional)</FieldLabel>
          <Input placeholder="Enter your Nagad number" {...form.register("nagadNumber")} />
        </Field>
      </FieldGroup>

      <div className="border-t border-border pt-4">
        <FieldLegend className="text-sm font-medium">Emergency Contact</FieldLegend>
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field>
            <FieldLabel>Name (optional)</FieldLabel>
            <Input
              placeholder="Enter emergency contact name"
              {...form.register("emergencyContactName")}
            />
          </Field>
          <Field>
            <FieldLabel>Phone (optional)</FieldLabel>
            <Input
              placeholder="Enter emergency contact phone"
              {...form.register("emergencyContactPhone")}
            />
          </Field>
          <Field className="md:col-span-2">
            <FieldLabel>Relation (optional)</FieldLabel>
            <Input
              placeholder="e.g. Brother, Father, Friend"
              {...form.register("emergencyContactRelation")}
            />
          </Field>
        </FieldGroup>
      </div>
    </FieldSet>
  );
}
