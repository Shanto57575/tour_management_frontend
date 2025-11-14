import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PasswordInput } from "./PasswordInput";
import { Button } from "@/components/ui/button";
import type { ISetPassword } from "@/types/auth.type";

interface SetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface SetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ISetPassword) => void;
  isLoading: boolean;
}

export const SetPasswordModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: SetPasswordModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const passwordValidation = {
    required: "Password is required",
    minLength: { value: 6, message: "Password must be at least 6 characters" },
    maxLength: { value: 30, message: "Password must not exceed 30 characters" },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      message:
        "Password must include uppercase, lowercase, number, and special character",
    },
  };

  const handleFormSubmit: SubmitHandler<SetPasswordFormData> = (data) => {
    onSubmit({ password: data.password });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Password</DialogTitle>
          <DialogDescription>
            Create a password to enable email/password login
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <PasswordInput
            label="New Password"
            name="password"
            register={register}
            error={errors.password}
            {...{ validate: passwordValidation }}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
            {...{
              validate: {
                required: (value: string) =>
                  value || "Please confirm your password",
                match: (value: string) =>
                  value === password || "Passwords do not match",
              },
            }}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleFormSubmit)}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Setting..." : "Set Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
