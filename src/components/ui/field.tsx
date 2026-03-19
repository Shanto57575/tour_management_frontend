import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const fieldVariants = cva("grid gap-2", {
  variants: {
    orientation: {
      vertical: "",
      horizontal: "md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-4",
      responsive:
        "@md/field-group:grid-cols-[220px_minmax(0,1fr)] @md/field-group:items-start @md/field-group:gap-4",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset className={cn("grid gap-5", className)} {...props} />;
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      className={cn("text-base font-semibold text-foreground tracking-tight", className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("@container/field-group grid gap-4", className)} {...props} />;
}

function Field({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      className={cn(
        fieldVariants({ orientation }),
        "data-[invalid=true]:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-1.5", className)} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label className={cn("text-sm text-foreground", className)} {...props} />;
}

function FieldTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm font-medium text-foreground", className)} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs leading-relaxed text-muted-foreground text-pretty", className)}
      {...props}
    />
  );
}

function FieldSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator className={cn("my-1", className)} {...props} />;
}

type FieldErrorItem =
  | { message?: string | null }
  | string
  | undefined
  | null
  | Array<{ message?: string | null } | string | undefined | null>;

interface FieldErrorProps extends React.ComponentProps<"div"> {
  errors?: FieldErrorItem;
}

function FieldError({ className, errors, children, ...props }: FieldErrorProps) {
  const fromErrors = (() => {
    if (!errors) return [] as string[];
    if (typeof errors === "string") return [errors];
    if (Array.isArray(errors)) {
      return errors
        .map((item) => {
          if (!item) return "";
          if (typeof item === "string") return item;
          return item.message ?? "";
        })
        .filter(Boolean) as string[];
    }

    return errors.message ? [errors.message] : [];
  })();

  const fromChildren = typeof children === "string" ? [children] : [];
  const messages = [...fromErrors, ...fromChildren].filter(Boolean);

  if (messages.length === 0 && !children) {
    return null;
  }

  return (
    <div
      className={cn("text-xs font-medium text-destructive", className)}
      aria-live="polite"
      {...props}
    >
      {messages.length > 1 ? (
        <ul className="list-disc pl-4 space-y-1">
          {messages.map((message, index) => (
            <li key={`${message}-${index}`}>{message}</li>
          ))}
        </ul>
      ) : messages.length === 1 ? (
        <span>{messages[0]}</span>
      ) : (
        children
      )}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
