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
import type { IChangePassword } from "@/types/auth.type";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IChangePassword) => void;
  isLoading: boolean;
}

export const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: ChangePasswordModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

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

  const handleFormSubmit: SubmitHandler<ChangePasswordFormData> = (data) => {
    onSubmit({ oldPassword: data.oldPassword, newPassword: data.newPassword });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <PasswordInput
            label="Current Password"
            name="oldPassword"
            register={register}
            error={errors.oldPassword}
            placeholder="Enter your current password"
            {...{
              validate: {
                required: (v: string) => v || "Current password is required",
              },
            }}
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            register={register}
            error={errors.newPassword}
            placeholder="Enter your new password"
            rules={passwordValidation}
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
            placeholder="Confirm your new password"
            rules={{
              required: "Please confirm your password",
              validate: (value: string) => value === newPassword || "Passwords do not match"
            }}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleFormSubmit)}
              className="flex-1 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
