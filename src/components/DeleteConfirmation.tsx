import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface IProps {
  children?: ReactNode;
  onConfirm: () => void;
  module?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmClassName?: string;
  cancelClassName?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export default function DeleteConfirmation({
  children,
  onConfirm,
  module,
  title = "Are you sure?",
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  confirmClassName,
  cancelClassName,
  contentClassName,
  open,
  onOpenChange,
  disabled = false,
}: IProps) {
  const fallbackDescription = module
    ? `This action cannot be undone. This will permanently delete the ${module}.`
    : "This action cannot be undone.";

  const handleConfirm = () => {
    if (disabled) return;
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children ? <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> : null}
      <AlertDialogContent className={cn("min-h-44", contentClassName)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description || fallbackDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={cn("cursor-pointer", cancelClassName)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn("bg-red-500 hover:bg-red-700 cursor-pointer", confirmClassName)}
            onClick={handleConfirm}
            disabled={disabled}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
